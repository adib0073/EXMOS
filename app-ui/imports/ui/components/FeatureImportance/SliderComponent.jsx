import { useState } from 'react';
import React from 'react';
import 'antd/dist/antd.css';
import { Slider } from 'antd';
import { distributionRecords } from '../../records/distributionRecords.jsx';
import { records } from '../../records/records.jsx';


const prepareMarks = (measureData, currVal) => {
    const bv1 = measureData.boundaryVal[0];
    const bv2 = measureData.boundaryVal[1];

    const marks = {
        [bv1]: bv1,
        [bv2]: bv2,
        [currVal]: currVal
    }

    return (marks);

};

const StatusColor = (record, measure) => {
    let color = 'black';

    if (measure < record.boundaryVal[0] || measure > record.boundaryVal[1]) {
        return "#D64242";
    }

    return "#449231";
};

const calculateRisk = (newValue, oldValue, lowVal, upVal, importanceFactor) => {
    let change = 0;
    if (oldValue >= lowVal && oldValue <= upVal) {
        if (newValue >= lowVal && newValue <= upVal) {
            change = 0;
        }
        else if (newValue > upVal) {
            change = (newValue - upVal) / upVal * 40;
        }
        else if (newValue < lowVal) {
            change = -(newValue - lowVal) / lowVal * 40;
        }
    }
    else if (oldValue > upVal) {
        if (newValue > oldValue) {
            change = (newValue - oldValue) / oldValue * 40;
        }
        else if (newValue <= oldValue && newValue >= lowVal) {
            change = (newValue - oldValue) / oldValue * 40;
        }
        else if (newValue < lowVal) {
            change = - (newValue - lowVal) / lowVal * 40;
        }
    }
    else if (oldValue < lowVal) {
        if (newValue > oldValue && newValue <= upVal) {
            change = - (newValue - oldValue) / oldValue * 40;
        }
        else if (newValue < oldValue) {
            change = - (newValue - oldValue) / oldValue * 40;
        }
        else if (newValue > upVal) {
            change = (newValue - upVal) / upVal * 40;
        }
    }

    return Math.round(change * importanceFactor);
};

const handleValueChange = (value, measureStatus, setMeasureStatus, setRisk, pos) => {
    let newMeasures = measureStatus.map(
        (val, index) => {
            if (index == pos) {
                val = value
            }
            return val
        })
    setMeasureStatus(newMeasures);
};

const resetSummaryPlot = (patient, setMeasureValue, updateIsSelectedCCFE) => {
    setMeasureValue([
        records[patient]["PatientInfo"].bloodSugar.value,
        records[patient]["PatientInfo"].waistMeasure.value,
        records[patient]["PatientInfo"].bmi.value,
        records[patient]["PatientInfo"].drinkingStatus.value,
        records[patient]["PatientInfo"].smokingStatus.value,
        records[patient]["PatientInfo"].physicalActivityLevel.value
    ]);
    updateIsSelectedCCFE([false, false]);
};

export const SliderComponent = (
    {
        patient,
        setMeasureValue,
        measureValue,
        measureName,
        measureStatus,
        setMeasureStatus,
        pos,
        setWhatIf,
        risk,
        setRisk,
        updateIsSelectedCCFE,
        importanceFactor,
        updateVizSelected
    }) => {
    console.log(risk);
    return (
        <Slider
            autoFocus={true}
            step={0.1}
            marks={prepareMarks(distributionRecords[measureName], measureValue)}
            value={measureValue}
            min={Math.min(...distributionRecords[measureName].data)}
            max={Math.max(...distributionRecords[measureName].data)}
            onChange={(value) => {
                setWhatIf(true);
                updateVizSelected([false, true]);
                resetSummaryPlot(patient, setMeasureValue, updateIsSelectedCCFE);
                setRisk(
                    risk +
                    calculateRisk(
                    value,
                    measureValue,
                    distributionRecords[measureName].boundaryVal[0],
                    distributionRecords[measureName].boundaryVal[1],
                    importanceFactor
                ));
                handleValueChange(value, measureStatus, setMeasureStatus, setRisk, pos);
            }}
            dotStyle={{ borderColor: StatusColor(distributionRecords[measureName], measureValue) }}
            trackStyle={{ background: StatusColor(distributionRecords[measureName], measureValue) }}
            handleStyle={{ borderColor: StatusColor(distributionRecords[measureName], measureValue) }}
        />);

};