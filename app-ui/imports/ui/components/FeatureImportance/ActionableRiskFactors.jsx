import React, { useState } from 'react';
import { MoreInfoTemplate } from '../MoreInfo/MoreInfoTemplate.jsx';
import { InfoLogo } from '../Icons/InfoLogo';
import './ActionableRiskFactors.css';
import 'antd/dist/antd.css';
import { ReloadOutlined, AimOutlined } from '@ant-design/icons';
import { records } from '../../records/records';
import { Select, Tooltip } from 'antd';
import { distributionRecords } from '../../records/distributionRecords.jsx';
import { SliderComponent } from './SliderComponent.jsx';
import { DropdownComponent } from './DropdownComponent.jsx';


const prepareList = (variable, records) => {
  let val = null;
  let list = null;
  let json = {};
  for (let i = 0; i < variable.length; i++) {
    val = records[variable[i]].data;
    list = val.map(v => <Select.Option key={v} value={v}>{v}</Select.Option>);
    json[variable[i]] = list;
  }
  return json;
};

const prepareExplanations = (variable, record) => {

  if (variable >= record.boundaryVal[0] && variable <= record.boundaryVal[1]) {
    return (" (" + record.boundaryVal[0] + " <= " + variable + " <= " + record.boundaryVal[1] + ")");
  }
  else if (variable > record.boundaryVal[1]) {
    return (" ( > " + record.boundaryVal[1] + " )");
  }
  else {
    return (" ( < " + record.boundaryVal[0] + " )");
  }

};

const prepareSortedList = (riskFactors) => {
  let listVal = [];
  let keyVal = [];
  let indexArray = [];
  let i = 0;
  let mVal = [];
  let bVal = [];

  Object.entries(riskFactors).forEach(([k, v]) => {
    listVal.push(v.value);
    keyVal.push(k);
    indexArray.push(i);
    i = i + 1;
  })

  indexArray.sort(function (a, b) {
    return listVal[a] - listVal[b];
  });
  indexArray = indexArray.reverse();

  for (let index = 0; index < indexArray.length; index++) {
    if (riskFactors[keyVal[indexArray[index]]].type == "measure") {
      mVal.push(keyVal[indexArray[index]]);
    }
    else if (riskFactors[keyVal[indexArray[index]]].type == "behaviour") {
      bVal.push(keyVal[indexArray[index]]);
    }

  }

  let maxImportance = Math.max(...listVal);

  return [mVal, bVal, maxImportance];
}

const valueIndices = {
  bloodSugar: 0,
  waistMeasure: 1,
  bmi: 2,
  drinkingStatus: 3,
  smokingStatus: 4,
  physicalActivityLevel: 5,
};


export const ActionableRiskFactors = (
  {
    patient,
    riskFactors,
    patientInfo,
    setPRecords,
    setMeasureValue,
    setPopupTrigger,
    setChartIndex,
    risk,
    setRisk,
    isSelectedCCFE,
    updateIsSelectedCCFE,
    isVizSelected,
    updateVizSelected
  }) => {
  const behaviours = ["drinkingStatus", "smokingStatus", "physicalActivityLevel"];
  const behaviourValueList = prepareList(behaviours, distributionRecords);

  let sortedFactors = prepareSortedList(riskFactors);

  const [enabledWhatIf, setWhatIf] = useState(false);

  const handleReload = (patient) => {
    setPRecords([
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
      if (index == 1) {
        val = false
      }

      return val
    }));
  };

  let patientHeathValues = records[patient]["PatientInfo"];

  return (
    <div className="container-box-2-2-2">
      <div className="chart-title-box">
        <div className="chart-title">
          <Tooltip
            placement="rightTop"
            title="Visualize the important risk factors for this patient. Alter the values and see how the risk changes. The impact score tells the importance to which the risk factor affects the overall risk."
          >
            Important Risk Factors
          </Tooltip>
        </div>
        <div className="chart-icons">
          <div className="chart-reload">
            <Tooltip title={enabledWhatIf ? "What-If enabled, hover over the total estimated risk and check the updated value. Hit reload to see the original visual." : "Try out clicking and changing the values for this visual."}>
              <AimOutlined style={{ color: enabledWhatIf ? '#D64242' : 'darkgrey' }} />
            </Tooltip>
          </div>
          <div className="chart-reload">
            <Tooltip title="Reload this visual">
              <ReloadOutlined onClick={() => { handleReload(patient) }} />
            </Tooltip>
          </div>
          <div className="chart-info-logo">
            <InfoLogo setButtonPopup={setPopupTrigger} setChartIndex={setChartIndex} index={2} />
          </div>
        </div>
      </div>
      <div className='chart-intro'>
        <div className="chart-intro-text1-left">
          Patient Measures
        </div>
        <div className="chart-intro-text1-right">
          Patient Behaviours
        </div>
      </div>
      <div className='chart-intro'>
        <div className="chart-intro-text2-left">
          <div className="fi-factor">
            Risk Factors
          </div>
          <div className="fi-impact">
            <Tooltip
              title="Factors with higher positive impact % (also shown in red) increases the overall risk more. Factors with negative impact % (also shown in green) contributes towards decreasing risk."
            >
              Impact %
            </Tooltip>
          </div>
        </div>
        <div className="chart-intro-text2-right">
          <div className="fi-factor">
            Risk Factors
          </div>
          <div className="fi-impact">
            <Tooltip
              title="Factors with higher positive impact % (also shown in red) increases the overall risk more. Factors with negative impact % (also shown in green) contributes towards decreasing risk."
            >
              Impact %
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="chart-container">

        <div className="fi-col-container-left">
          <div className="fi-cell">
            <div className="fi-factor">
              <div className="fi-col-val">
                <b>
                  {distributionRecords[sortedFactors[0][0]].variable}:
                </b> {patientHeathValues[sortedFactors[0][0]].value}
                <span className='threshold-val'>
                  {
                    prepareExplanations(
                      patientHeathValues[sortedFactors[0][0]].value,
                      distributionRecords[sortedFactors[0][0]]
                    )
                  }
                </span>
              </div>
              <div className="fi-col-ri">
                <SliderComponent
                  patient={patient}
                  setMeasureValue={setMeasureValue}
                  measureValue={patientInfo[valueIndices[sortedFactors[0][0]]]}
                  measureName={sortedFactors[0][0]}
                  measureStatus={patientInfo}
                  setMeasureStatus={setPRecords}
                  pos={valueIndices[sortedFactors[0][0]]}
                  setWhatIf={setWhatIf}
                  risk={risk}
                  setRisk={setRisk}
                  updateIsSelectedCCFE={updateIsSelectedCCFE}
                  importanceFactor={riskFactors[sortedFactors[0][0]].value/sortedFactors[2]}
                  updateVizSelected={updateVizSelected}
                />
              </div>
            </div>
            <div className="fi-impact">
              <div className="impact-circle" style={
                { background: riskFactors[sortedFactors[0][0]].isPositive ? '#449231' : '#D64242' }
              }>
                {riskFactors[sortedFactors[0][0]].isPositive ? "-" : "+"}
                <b>{riskFactors[sortedFactors[0][0]].value}</b> %
              </div>
            </div>
          </div>
          <div className="fi-cell">
            <div className="fi-factor">
              <div className="fi-col-val">
                <b>
                  {distributionRecords[sortedFactors[0][1]].variable}:
                </b> {patientHeathValues[sortedFactors[0][1]].value}
                <span className='threshold-val'>
                  {
                    prepareExplanations(
                      patientHeathValues[sortedFactors[0][1]].value,
                      distributionRecords[sortedFactors[0][1]]
                    )
                  }
                </span>
              </div>
              <div className="fi-col-ri">
                <SliderComponent
                  patient={patient}
                  setMeasureValue={setMeasureValue}
                  measureValue={patientInfo[valueIndices[sortedFactors[0][1]]]}
                  measureName={sortedFactors[0][1]}
                  measureStatus={patientInfo}
                  setMeasureStatus={setPRecords}
                  pos={valueIndices[sortedFactors[0][1]]}
                  setWhatIf={setWhatIf}
                  risk={risk}
                  setRisk={setRisk}
                  updateIsSelectedCCFE={updateIsSelectedCCFE}
                  importanceFactor={riskFactors[sortedFactors[0][1]].value/sortedFactors[2]}
                  updateVizSelected={updateVizSelected}
                />
              </div>
            </div>
            <div className="fi-impact">
              <div className="impact-circle" style={
                { background: riskFactors[sortedFactors[0][1]].isPositive ? '#449231' : '#D64242' }
              }>
                {riskFactors[sortedFactors[0][1]].isPositive ? "-" : "+"}
                <b>{riskFactors[sortedFactors[0][1]].value}</b> %
              </div>
            </div>
          </div>
          <div className="fi-cell">
            <div className="fi-factor">
              <div className="fi-col-val">
                <b>
                  {distributionRecords[sortedFactors[0][2]].variable}:
                </b> {patientHeathValues[sortedFactors[0][2]].value}
                <span className='threshold-val'>
                  {
                    prepareExplanations(
                      patientHeathValues[sortedFactors[0][2]].value,
                      distributionRecords[sortedFactors[0][2]]
                    )
                  }
                </span>
              </div>
              <div className="fi-col-ri">
                <SliderComponent
                  patient={patient}
                  setMeasureValue={setMeasureValue}
                  measureValue={patientInfo[valueIndices[sortedFactors[0][2]]]}
                  measureName={sortedFactors[0][2]}
                  measureStatus={patientInfo}
                  setMeasureStatus={setPRecords}
                  pos={valueIndices[sortedFactors[0][2]]}
                  setWhatIf={setWhatIf}
                  risk={risk}
                  setRisk={setRisk}
                  updateIsSelectedCCFE={updateIsSelectedCCFE}
                  importanceFactor={riskFactors[sortedFactors[0][2]].value/sortedFactors[2]}
                  updateVizSelected={updateVizSelected}
                />
              </div>
            </div>
            <div className="fi-impact">
              <div className="impact-circle" style={
                { background: riskFactors[sortedFactors[0][2]].isPositive ? '#449231' : '#D64242' }
              }>
                {riskFactors[sortedFactors[0][2]].isPositive ? "-" : "+"}
                <b>{riskFactors[sortedFactors[0][2]].value}</b> %
              </div>
            </div>
          </div>
        </div>
        <div className="fi-col-container-right">
          <div className="fi-cell">
            <div className="fi-factor">
              <div className="fi-col-val">
                <b>
                  {distributionRecords[sortedFactors[1][0]].variable}:
                </b>
                {
                  " (" + patientInfo[valueIndices[sortedFactors[1][0]]] + ")"
                }
              </div>
              <div className="fi-col-ri-behavior">
                <DropdownComponent
                  patient={patient}
                  setMeasureValue={setMeasureValue}
                  measureValue={patientInfo[valueIndices[sortedFactors[1][0]]]}
                  measureName={sortedFactors[1][0]}
                  measureStatus={patientInfo}
                  setMeasureStatus={setPRecords}
                  listValues={behaviourValueList[sortedFactors[1][0]]}
                  pos={valueIndices[sortedFactors[1][0]]}
                  setWhatIf={setWhatIf}
                  risk={risk}
                  setRisk={setRisk}
                  updateIsSelectedCCFE={updateIsSelectedCCFE}
                  importanceFactor={riskFactors[sortedFactors[1][0]].value/sortedFactors[2]}
                  updateVizSelected={updateVizSelected}
                />
              </div>
            </div>
            <div className="fi-impact">
              <div className="impact-circle" style={
                {
                  background: riskFactors[sortedFactors[1][0]].isPositive ? '#449231' : '#D64242'
                }
              }>
                {
                  riskFactors[sortedFactors[1][0]].isPositive ? "-" : "+"
                }
                <b>{riskFactors[sortedFactors[1][0]].value}</b> %
              </div>
            </div>
          </div>
          <div className="fi-cell">
            <div className="fi-factor">
              <div className="fi-col-val">
                <b>
                  {distributionRecords[sortedFactors[1][1]].variable}:
                </b>
                {
                  " (" + patientInfo[valueIndices[sortedFactors[1][1]]] + ")"
                }
              </div>
              <div className="fi-col-ri-behavior">
                <DropdownComponent
                  patient={patient}
                  setMeasureValue={setMeasureValue}
                  measureValue={patientInfo[valueIndices[sortedFactors[1][1]]]}
                  measureName={sortedFactors[1][1]}
                  measureStatus={patientInfo}
                  setMeasureStatus={setPRecords}
                  listValues={behaviourValueList[sortedFactors[1][1]]}
                  pos={valueIndices[sortedFactors[1][1]]}
                  setWhatIf={setWhatIf}
                  risk={risk}
                  setRisk={setRisk}
                  updateIsSelectedCCFE={updateIsSelectedCCFE}
                  importanceFactor={riskFactors[sortedFactors[1][1]].value/sortedFactors[2]}
                  updateVizSelected={updateVizSelected}
                />
              </div>
            </div>
            <div className="fi-impact">
              <div className="impact-circle" style={
                {
                  background: riskFactors[sortedFactors[1][1]].isPositive ? '#449231' : '#D64242'
                }
              }>
                {
                  riskFactors[sortedFactors[1][1]].isPositive ? "-" : "+"
                }
                <b>{riskFactors[sortedFactors[1][1]].value}</b> %
              </div>
            </div>
          </div>
          <div className="fi-cell">
            <div className="fi-factor">
              <div className="fi-col-val">
                <b>
                  {distributionRecords[sortedFactors[1][2]].variable}:
                </b>
                {
                  " (" + patientInfo[valueIndices[sortedFactors[1][2]]] + ")"
                }
              </div>
              <div className="fi-col-ri-behavior">
                <DropdownComponent
                  patient={patient}
                  setMeasureValue={setMeasureValue}
                  measureValue={patientInfo[valueIndices[sortedFactors[1][2]]]}
                  measureName={sortedFactors[1][2]}
                  measureStatus={patientInfo}
                  setMeasureStatus={setPRecords}
                  listValues={behaviourValueList[sortedFactors[1][2]]}
                  pos={valueIndices[sortedFactors[1][2]]}
                  setWhatIf={setWhatIf}
                  risk={risk}
                  setRisk={setRisk}
                  updateIsSelectedCCFE={updateIsSelectedCCFE}
                  importanceFactor={riskFactors[sortedFactors[1][2]].value/sortedFactors[2]}
                  updateVizSelected={updateVizSelected}
                />
              </div>
            </div>
            <div className="fi-impact">
              <div className="impact-circle" style={
                {
                  background: riskFactors[sortedFactors[1][2]].isPositive ? '#449231' : '#D64242'
                }
              }>
                {
                  riskFactors[sortedFactors[1][2]].isPositive ? "-" : "+"
                }
                <b>{riskFactors[sortedFactors[1][2]].value}</b> %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};