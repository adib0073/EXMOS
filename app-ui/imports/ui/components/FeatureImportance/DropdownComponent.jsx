import { useState } from 'react';
import React from 'react';
import 'antd/dist/antd.css';
import { Select } from 'antd';
import { distributionRecords } from '../../records/distributionRecords.jsx';
import { records } from '../../records/records.jsx';

const updateValue = (value, measureStatus, setMeasureStatus, pos) => {
    let newMeasures = measureStatus.map(
        (val, index) => {
            if (index == pos) {
                val = value.value
            }
            return val
        })
    setMeasureStatus(newMeasures);
};

const calculateRisk = (newValue, oldValue, values, types, importanceFactor) => {
    let change = 0;

    if (types[values.indexOf(oldValue)] == "Good") {
        if (types[values.indexOf(newValue.value)] == "Bad") {
            change = 15;
        }
        else if (types[values.indexOf(newValue.value)] == "Medium") {
            change = 5;
        }
        else {
            change = 0;
        }
    }
    else if (types[values.indexOf(oldValue)] == "Medium") {
        if (types[values.indexOf(newValue.value)] == "Bad") {
            change = 5;
        }
        else if (types[values.indexOf(newValue.value)] == "Good") {
            change = -5;
        }
        else {
            change = 0;
        }
    }
    else if (types[values.indexOf(oldValue)] == "Bad") {
        if (types[values.indexOf(newValue.value)] == "Medium") {
            change = -5;
        }
        else if (types[values.indexOf(newValue.value)] == "Good") {
            change = -15;
        }
        else {
            change = 0;
        }
    }

    return Math.round(change * importanceFactor);
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

export const DropdownComponent = (
    {
        patient,
        setMeasureValue,
        measureValue,
        measureName,
        measureStatus,
        setMeasureStatus,
        listValues,
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
        <Select
            labelInValue
            value={{
                value: measureValue,
                label: measureValue,
            }}
            style={{
                width: 150,
            }}
            onChange={(value) => {
                updateVizSelected([false, true]);
                resetSummaryPlot(patient, setMeasureValue, updateIsSelectedCCFE);
                setWhatIf(true);
                setRisk(risk + calculateRisk(
                    value,
                    measureValue,
                    distributionRecords[measureName].data,
                    distributionRecords[measureName].valueType,
                    importanceFactor
                ));
                updateValue(value, measureStatus, setMeasureStatus, pos);
            }}
        >
            {listValues}
        </Select>
    );

};