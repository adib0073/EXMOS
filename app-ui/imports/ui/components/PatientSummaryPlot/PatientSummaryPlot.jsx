import React, { useState } from 'react';
import { ContinuousDistribution } from './ContinuousDistribution';
import { DiscreteDistribution } from './DiscreteDistribution';
import { InfoLogo } from '../Icons/InfoLogo';
import { distributionRecords } from '../../records/distributionRecords';
import 'antd/dist/antd.css';
import { ReloadOutlined, AimOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { records } from '../../records/records';


const getImportanceFactor = (patient, measureName) => {
    let riskFactors = records[patient]["Risk Factors"];

    let listVal = [];
    Object.entries(riskFactors).forEach(([k, v]) => {
        listVal.push(v.value);
      })

    let maxImportance = Math.max(...listVal);
    return riskFactors[measureName].value/maxImportance;
}

export const PatientSummaryPlot = (
    {
        patient,
        patientInfo,
        setMeasureValue,
        risk,
        setRisk,
        setPopupTrigger,
        setChartIndex,
        updateIsSelectedCCFE,
        setPRecords,
        isVizSelected, 
        updateVizSelected
    }) => {

    const [enabledWhatIf, setWhatIf] = useState(false);

    const handleReload = (patient) => {
        setMeasureValue([
            records[patient]["PatientInfo"].bloodSugar.value,
            records[patient]["PatientInfo"].waistMeasure.value,
            records[patient]["PatientInfo"].bmi.value,
            records[patient]["PatientInfo"].drinkingStatus.value,
            records[patient]["PatientInfo"].smokingStatus.value,
            records[patient]["PatientInfo"].physicalActivityLevel.value
        ])

        setRisk(records[patient]["Risk"]);
        updateIsSelectedCCFE([false, false]);
        setWhatIf(false);
        updateVizSelected(isVizSelected.map((val, index) => {       
            if (index == 0) {
              val = false
            }
      
            return val
          }));
    };


    return (<div className="container-box-2-1-1">
        <div className="chart-title-box">
            <Tooltip
                title="The distribution plots shown for each health variable shows the count of patients (on y-axis) for each value of the variable (on x-axis). Find out where the current patient is as compared to other patients."
                overlayStyle={{ maxWidth: '500px' }}
                placement="rightTop"
            >
                <div className="chart-title">
                    Patient Summary
                </div>
            </Tooltip>
            <div className="chart-icons">
                <div className="chart-reload">
                    <Tooltip title={enabledWhatIf ? "What-If enabled, hover over the total estimated risk and check the updated value. Hit reload to see the original visual." : "Try out clicking and changing the values for the summary plots."}>
                        <AimOutlined style={{ color: enabledWhatIf ? '#D64242' : 'darkgrey' }} />
                    </Tooltip>
                </div>
                <div className="chart-reload">
                    <Tooltip title="Reload this visual">
                        <ReloadOutlined onClick={() => { handleReload(patient) }} />
                    </Tooltip>
                </div>
                <div className="chart-info-logo">
                    <InfoLogo setButtonPopup={setPopupTrigger} setChartIndex={setChartIndex} index={0} />
                </div>
            </div>
        </div>
        <div className="chart-container">
            <div className="chart-box-1">
                <div className="summary-chart-box">
                    <span className="ValueLabel">
                        {distributionRecords["bloodSugar"]["variable"]}:
                    </span>
                    <br />
                    <ContinuousDistribution
                        patient={patient}
                        currentRisk={risk}
                        setRisk={setRisk}
                        measure={distributionRecords["bloodSugar"]}
                        index={0}
                        patientValue={patientInfo}
                        setMeasureValue={setMeasureValue}
                        setWhatIf={setWhatIf}
                        setPRecords={setPRecords}
                        updateIsSelectedCCFE={updateIsSelectedCCFE}
                        importanceFactor={getImportanceFactor(patient, "bloodSugar")}
                        updateVizSelected={updateVizSelected}
                    />
                </div>
                <div className="summary-chart-box">
                    <span className="ValueLabel">
                        {distributionRecords["waistMeasure"]["variable"]}:
                    </span>
                    <br />
                    <ContinuousDistribution
                        patient={patient}
                        currentRisk={risk}
                        setRisk={setRisk}
                        measure={distributionRecords["waistMeasure"]}
                        index={1}
                        patientValue={patientInfo}
                        setMeasureValue={setMeasureValue}
                        setWhatIf={setWhatIf}
                        setPRecords={setPRecords}
                        updateIsSelectedCCFE={updateIsSelectedCCFE}
                        importanceFactor={getImportanceFactor(patient, "waistMeasure")}
                        updateVizSelected={updateVizSelected}
                    />
                </div>
                <div className="summary-chart-box">
                    <span className="ValueLabel">
                        {distributionRecords["bmi"]["variable"]}:
                    </span>
                    <br />
                    <ContinuousDistribution
                        patient={patient}
                        currentRisk={risk}
                        setRisk={setRisk}
                        measure={distributionRecords["bmi"]}
                        index={2}
                        patientValue={patientInfo}
                        setMeasureValue={setMeasureValue}
                        setWhatIf={setWhatIf}
                        setPRecords={setPRecords}
                        updateIsSelectedCCFE={updateIsSelectedCCFE}
                        importanceFactor={getImportanceFactor(patient, "bmi")}
                        updateVizSelected={updateVizSelected}
                    />
                </div>
                <div className="SummaryChartLabels">
                    Patient Measures
                </div>
            </div>
            <div className="chart-box-2">
                <div className="summary-chart-box">
                    <span className="ValueLabel">
                        {distributionRecords["drinkingStatus"]["variable"]}:
                    </span>
                    <br />
                    <DiscreteDistribution
                        patient={patient}
                        currentRisk={risk}
                        setRisk={setRisk}
                        measure={distributionRecords["drinkingStatus"]}
                        index={3}
                        patientValue={patientInfo}
                        setMeasureValue={setMeasureValue}
                        setWhatIf={setWhatIf}
                        setPRecords={setPRecords}
                        updateIsSelectedCCFE={updateIsSelectedCCFE}
                        importanceFactor={getImportanceFactor(patient, "drinkingStatus")}
                        updateVizSelected={updateVizSelected}
                    />
                </div>
                <div className="summary-chart-box">
                    <span className="ValueLabel">
                        {distributionRecords["smokingStatus"]["variable"]}:
                    </span>
                    <br />
                    <DiscreteDistribution
                        patient={patient}
                        currentRisk={risk}
                        setRisk={setRisk}
                        measure={distributionRecords["smokingStatus"]}
                        index={4}
                        patientValue={patientInfo}
                        setMeasureValue={setMeasureValue}
                        setWhatIf={setWhatIf}
                        setPRecords={setPRecords}
                        updateIsSelectedCCFE={updateIsSelectedCCFE}
                        importanceFactor={getImportanceFactor(patient, "smokingStatus")}
                        updateVizSelected={updateVizSelected}
                    />
                </div>
                <div className="summary-chart-box">
                    <span className="ValueLabel">
                        {distributionRecords["physicalActivityLevel"]["variable"]}:
                    </span>
                    <br />
                    <DiscreteDistribution
                        patient={patient}
                        currentRisk={risk}
                        setRisk={setRisk}
                        measure={distributionRecords["physicalActivityLevel"]}
                        index={5}
                        patientValue={patientInfo}
                        setMeasureValue={setMeasureValue}
                        setWhatIf={setWhatIf}
                        setPRecords={setPRecords}
                        updateIsSelectedCCFE={updateIsSelectedCCFE}
                        importanceFactor={getImportanceFactor(patient, "physicalActivityLevel")}
                        updateVizSelected={updateVizSelected}
                    />
                </div>
                <div className="SummaryChartLabels">
                    Patient Behaviours
                </div>
            </div>
        </div>
    </div>);
};