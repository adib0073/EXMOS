import React from 'react';
import { useRef, useState } from 'react';
import NavBar from './components/NavBar/NavBar.jsx';
import { EstimatedRiskChart } from './components/EstimatedRiskChart/EstimatedRiskChart.jsx';
import { DoughnutChart } from './components/EstimatedRiskChart/DoughnutChart.jsx';
import { SummaryText } from './components/SummaryText/SummaryText.jsx';
import { PatientSummaryPlot } from './components/PatientSummaryPlot/PatientSummaryPlot.jsx';
import { RiskRecoveryPlot } from './components/RiskRecoveryPlot/RiskRecoveryPlot.jsx';
import { FeatureImportance } from './components/FeatureImportance/FeatureImportance.jsx';
import { CCFE } from './components/CCFE/CCFE.jsx';
import { MoreInfoTemplate } from './components/MoreInfo/MoreInfoTemplate.jsx';
import { records } from './records/records.jsx';
import { ActionableRiskFactors } from './components/FeatureImportance/ActionableRiskFactors.jsx';

export const App = () => {
  const [patient, setPatient] = useState("2631");
  const [risk, setRisk] = useState(records[patient]["Risk"]);
  const [patientInfo, setPatientInfo] = useState(records[patient]["PatientInfo"]);
  const [measureValue, setMeasureValue] = useState(
    [
      records[patient]["PatientInfo"].bloodSugar.value,
      records[patient]["PatientInfo"].waistMeasure.value,
      records[patient]["PatientInfo"].bmi.value,
      records[patient]["PatientInfo"].drinkingStatus.value,
      records[patient]["PatientInfo"].smokingStatus.value,
      records[patient]["PatientInfo"].physicalActivityLevel.value
    ]);
  const [pRecords, setPRecords] = useState(
    [
      records[patient]["PatientInfo"].bloodSugar.value,
      records[patient]["PatientInfo"].waistMeasure.value,
      records[patient]["PatientInfo"].bmi.value,
      records[patient]["PatientInfo"].drinkingStatus.value,
      records[patient]["PatientInfo"].smokingStatus.value,
      records[patient]["PatientInfo"].physicalActivityLevel.value
    ]);

  const riskChartRef = useRef();
  const [popupTrigger, setPopupTrigger] = useState(false);
  const [chartIndex, setChartIndex] = useState(0);
  const [isSelected, updateIsSelected] = useState([false, false]);
  const [isVizSelected, updateVizSelected] = useState([false, false]);

  return (<div className="app-container">
    <NavBar />
    <div className="container">
      <MoreInfoTemplate trigger={popupTrigger} setPopupTrigger={setPopupTrigger} index={chartIndex} />
      <div className="container-box-1">
        <div className="text-box">
          <SummaryText
            patient={records[patient]}
            setPatient={setPatient}
            setRisk={setRisk}
            setPatientInfo={setPatientInfo}
            updateIsSelectedCCFE={updateIsSelected}
            setMeasureValue={setMeasureValue}
            setPRecords={setPRecords}
          />
        </div>
        <div className="progress-box">
          <DoughnutChart estimatedRisk={risk} chartRef={riskChartRef} />
        </div>
      </div>

      <div className="container-box-2">
        <div className="container-box-2-1">
          <PatientSummaryPlot
            patient={patient}
            patientInfo={measureValue}
            setMeasureValue={setMeasureValue}
            risk={isVizSelected[1] ? (records[patient]["Risk"]):(risk)}
            setRisk={setRisk}
            setPopupTrigger={setPopupTrigger}
            setChartIndex={setChartIndex}
            updateIsSelectedCCFE={updateIsSelected}
            setPRecords = {setPRecords}
            isVizSelected ={isVizSelected}
            updateVizSelected = {updateVizSelected}
          />
          <RiskRecoveryPlot
            setPopupTrigger={setPopupTrigger}
            setChartIndex={setChartIndex}
            recovery={records[patient]["Risk Recovery"]}
          />
        </div>

        <div className="container-box-2-2">
          <CCFE
            counterFactuals={records[patient]["Recommendations"]}
            risk={risk}
            setRisk={setRisk}
            setPopupTrigger={setPopupTrigger}
            setChartIndex={setChartIndex}
            isSelected={isSelected}
            updateIsSelected={updateIsSelected}
            setPRecords={setPRecords}
          />
          <ActionableRiskFactors
            patient={patient}
            riskFactors = {records[patient]["Risk Factors"]}
            patientInfo ={pRecords}
            setPRecords ={setPRecords}
            setMeasureValue={setMeasureValue}
            setPopupTrigger={setPopupTrigger}
            setChartIndex={setChartIndex}
            risk={isVizSelected[0] ? (records[patient]["Risk"]):(risk)}
            setRisk={setRisk}
            isSelectedCCFE={isSelected}
            updateIsSelectedCCFE={updateIsSelected}
            isVizSelected ={isVizSelected}
            updateVizSelected = {updateVizSelected}
          />
        </div>
      </div>
    </div>
  </div >);

};
