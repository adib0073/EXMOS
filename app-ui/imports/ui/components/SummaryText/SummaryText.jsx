import React from 'react';
import 'antd/dist/antd.css';
import { Tooltip, Select } from 'antd';
import { ArrowUpOutlined, DownOutlined } from '@ant-design/icons';
import './SummaryText.css';
import { BehaviourIndicator } from './BehaviourIndicator.jsx';
import { MeasureIndicator } from './MeasureIndicator';
import { records } from '../../records/records';

const { Option } = Select;

let [key1, key2, key3, key4] = ['Patient ID', 'Region', 'Institution', 'Gender'];
let [key5, key6, key7, key8] = ['Age', 'Blood Sugar', 'BMI', 'Waist Measure'];
let [key9, key10, key11, key12] = ['Pulse', 'Drinking Status', 'Smoking Status', 'Physical Activity Level'];


export const SummaryText = ({ patient,
    setPatient,
    setRisk,
    setPatientInfo,
    updateIsSelectedCCFE,
    setMeasureValue,
    setPRecords
}) => {
    const updateSelectedPatient = (value) => {
        setRisk(records[value["value"]]["Risk"]);
        setPatient(value["value"]);
        setPatientInfo(records[value["value"]]["PatientInfo"]);
        setMeasureValue([
            records[value["value"]]["PatientInfo"].bloodSugar.value,
            records[value["value"]]["PatientInfo"].waistMeasure.value,
            records[value["value"]]["PatientInfo"].bmi.value,
            records[value["value"]]["PatientInfo"].drinkingStatus.value,
            records[value["value"]]["PatientInfo"].smokingStatus.value,
            records[value["value"]]["PatientInfo"].physicalActivityLevel.value
        ])
        setPRecords([
            records[value["value"]]["PatientInfo"].bloodSugar.value,
            records[value["value"]]["PatientInfo"].waistMeasure.value,
            records[value["value"]]["PatientInfo"].bmi.value,
            records[value["value"]]["PatientInfo"].drinkingStatus.value,
            records[value["value"]]["PatientInfo"].smokingStatus.value,
            records[value["value"]]["PatientInfo"].physicalActivityLevel.value
        ])
        updateIsSelectedCCFE([false, false]);
    };
    const patientInfo = patient["PatientInfo"];
    let allPatients = Object.keys(records);
    allPatients = allPatients.sort();
    allPatients = allPatients.map(v => <Select.Option key={v} value={v}>{v}</Select.Option>);

    return (
        <>
            <div className="inner-text-box-1-key" style={{ flex: 1 }}>
                <div className="key-value-text-box">
                    <b>{key1}</b> :
                </div>
                <div className="key-value-text-box">
                    <b>{key2}</b> :
                </div>
                <div className="key-value-text-box">
                    <b>{key3}</b>:
                </div>
                <div className="key-value-text-box">
                    <b>{key4}</b> :
                </div>
            </div>
            <div className="inner-text-box-1-val">
                <div className="key-value-text-box">
                    <Select
                        labelInValue
                        defaultValue={{
                            value: patientInfo["patientId"],
                            label: patientInfo["patientId"],
                        }}
                        style={{
                            width: 70,
                        }}
                        onChange={updateSelectedPatient}>
                        {allPatients}
                    </Select>
                </div>
                <div className="key-value-text-box" style={{ paddingLeft: '10px' }}>
                    {patientInfo["region"]}
                </div>
                <div className="key-value-text-box" style={{ paddingLeft: '10px' }}>
                    <Tooltip title={patientInfo["institution"]}> {patientInfo["institution"]}</Tooltip>
                </div>
                <div className="key-value-text-box" style={{ paddingLeft: '10px' }}>
                    <Tooltip title={patientInfo["gender"]}> {patientInfo["gender"]}</Tooltip>
                </div>
            </div>
            <div className="inner-text-box-1-key" style={{ flex: 1.5 }}>
                <div className="key-value-text-box">
                    <b>{key5}</b> :
                </div>
                <div className="key-value-text-box">
                    <b>{key6}</b> :
                </div>
                <div className="key-value-text-box">
                    <b>{key7}</b>:
                </div>
                <div className="key-value-text-box">
                    <b>{key8}</b> :
                </div>
            </div>
            <div className="inner-text-box-1-val">
                <div className="key-value-text-box">
                    <Tooltip title={patientInfo["age"]}>{patientInfo["age"]}</Tooltip>
                </div>
                <MeasureIndicator measure={patientInfo["bloodSugar"]} />
                <MeasureIndicator measure={patientInfo["bmi"]} />
                <MeasureIndicator measure={patientInfo["waistMeasure"]} />
            </div>
            <div className="inner-text-box-1-key">
                <div className="key-value-text-box">
                    <b>{key9}</b> :
                </div>
                <div className="key-value-text-box">
                    <b>{key10}</b> :
                </div>
                <div className="key-value-text-box">
                    <b>{key11}</b>:
                </div>
                <div className="key-value-text-box">
                    <b>{key12}</b> :
                </div>
            </div>
            <div className="inner-text-box-1-val">
                <MeasureIndicator measure={patientInfo["pulse"]} />
                <BehaviourIndicator measure={patientInfo["drinkingStatus"]["value"]} statusType={patientInfo["drinkingStatus"]["type"]} />
                <BehaviourIndicator measure={patientInfo["smokingStatus"]["value"]} statusType={patientInfo["smokingStatus"]["type"]} />
                <BehaviourIndicator measure={patientInfo["physicalActivityLevel"]["value"]} statusType={patientInfo["physicalActivityLevel"]["type"]} />
            </div>
        </>
    );

};