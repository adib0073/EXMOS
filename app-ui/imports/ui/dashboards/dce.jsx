import React from 'react';
import { useRef, useState, useEffect } from 'react';
import NavBar from '../components/NavBar/NavBar.jsx';
import './dce.css'
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { DoughnutChart } from '../components/EstimatedRiskChart/DoughnutChart.jsx';
import { HollowBullet } from '../components/Icons/HollowBullet.jsx';
import { BASE_API, DATA_SUMMARY_DEFAULT_MODEL } from '../Constants.jsx';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart'
// TO-DO - Delete following if not required
import { distributionRecords } from '../records/distributionRecords.jsx';
import { records } from '../records/records.jsx';
import { ContinuousDistribution } from '../components/PatientSummaryPlot/ContinuousDistribution.jsx';

const GetPredChartValue = ({ userid, setAccChartVals }) => {

    axios.get(BASE_API + '/getpredchartvalues/?user=' + userid)
        .then(function (response) {
            console.log(response.data["OutputJson"]);
            setAccChartVals({
                accuracy: response.data["OutputJson"]["Accuracy"],
                nsamples: response.data["OutputJson"]["NumSamples"],
                nfeats: response.data["OutputJson"]["NumFeatures"],
                pct: response.data["OutputJson"]["ScoreChange"]
            });

        }).catch(function (error) {
            console.log(error);
        });


}

const GetDSChartValue = ({ userid, setDsChartVals }) => {

    axios.get(BASE_API + '/getdatasummaryvalues/?user=' + userid)
        .then(function (response) {
            console.log(response.data["OutputJson"]);
            setDsChartVals({
                "Pregnancies": response.data["OutputJson"]["Pregnancies"],
                "Glucose": response.data["OutputJson"]["Glucose"],
                "BloodPressure": response.data["OutputJson"]["BloodPressure"],
                "SkinThickness": response.data["OutputJson"]["SkinThickness"],
                "Insulin": response.data["OutputJson"]["Insulin"],
                "BMI": response.data["OutputJson"]["BMI"],
                "DiabetesPedigreeFunction": response.data["OutputJson"]["DiabetesPedigreeFunction"],
                "Age": response.data["OutputJson"]["Age"],
            });

        }).catch(function (error) {
            console.log(error);
        });


}


export const DCE = ({ userid }) => {
    const accuracyChartRef = useRef();
    const [accChartVals, setAccChartVals] = useState({ accuracy: 0, nsamples: 0, nfeats: 0, pct: 0 });
    const [dsChartVals, setDsChartVals] = useState(DATA_SUMMARY_DEFAULT_MODEL);
    // TO-DO: Handle null  cases
    useEffect(() => {
        GetPredChartValue({ userid, setAccChartVals });
        console.log(dsChartVals);
        GetDSChartValue({ userid, setDsChartVals });
    }, []);
    // ## PAGE RELOAD IF NEEDED ##
    /*window.addEventListener("beforeunload", (event) => {
        getData();
        console.log("API call before page reload");
    });
  
    window.addEventListener("unload", (event) => {
        getData();
        console.log("API call after page reload");
    });*/
    // ## END OF PAGE RELOAD ##
    console.log(dsChartVals["Glucose"].xdata);

    return (
        <>
            <NavBar />
            <div className="dce-container">
                <div className="dce-container-left-col">
                    <div className="dce-container-left-r1">
                        <div className="dce-container-left-r1c1">
                            <div className="chart-title-box">
                                <div className="chart-title">
                                    Prediction Accuracy
                                </div>
                                <div className="chart-icons">
                                    <InfoLogo setButtonPopup={false} setChartIndex={0} index={3} />
                                </div>
                            </div>
                            <div className="chart-container">
                                <div className='chart-container-viz'>
                                    <DoughnutChart accuracy={accChartVals.accuracy} chartRef={accuracyChartRef} />
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> Training Samples : <b>{accChartVals.nsamples}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> Features Considered : <b>{accChartVals.nfeats}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> <b>{accChartVals.pct}%</b> from previous score
                                </div>
                            </div>
                        </div >
                        <div className="dce-container-left-r1c2">
                            <div className="chart-title-box">
                                <div className="chart-title">
                                    Key Insights
                                </div>
                                <div className="chart-icons">
                                    <InfoLogo setButtonPopup={false} setChartIndex={0} index={3} />
                                </div>
                            </div>
                            <div className="chart-container">
                                <div className="capsule-container">
                                    <div className="capsule-div">
                                        <div className="capsule-div-left">
                                            {89}%
                                        </div>
                                        <div className="capsule-div-right">
                                            {"Diabetic patients have"}  <b>{"BMI higher than 25"}</b>
                                        </div>
                                    </div>
                                    <div className="capsule-div">
                                        <div className="capsule-div-left">
                                            {87}%
                                        </div>
                                        <div className="capsule-div-right">
                                            {"Diabetic patients have"}  <b>{"Blood Sugar more than 6.5"}</b>
                                        </div>
                                    </div>
                                    <div className="capsule-div">
                                        <div className="capsule-div-left">
                                            {49}%
                                        </div>
                                        <div className="capsule-div-right">
                                            {"Diabetic patients have"}  <b>{"low exercise levels"}</b>
                                        </div>
                                    </div>
                                    <div className="capsule-div">
                                        <div className="capsule-div-left">
                                            {38}%
                                        </div>
                                        <div className="capsule-div-right">
                                            {"Diabetic patients have"}  <b>{"alcohol addiction"}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div >
                    <div className="dce-container-left-r2">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Data Quality Score
                            </div>
                            <div className="chart-icons">
                                <InfoLogo setButtonPopup={false} setChartIndex={0} index={3} />
                            </div>
                        </div>
                        <div className="chart-container">
                            <div className="dq-div">
                                <div className='dq-div-left'>
                                    <GaugeChart
                                        nrOfLevels={2}
                                        arcsLength={[0.65, 0.35]}
                                        percent={0.65}
                                        textColor={"black"}
                                        hideText={true}
                                        colors={['#1363DF', '#E5E5E5']}
                                        style={{ width: "15vw" }}
                                    />
                                    <div className='dq-div-left-info'>
                                        Poor
                                    </div>
                                </div>
                                <div className='dq-div-right'>
                                    <div className='dq-div-rc1'>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> 3% class imbalance
                                        </div>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> - {5}% feature correlation
                                        </div>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> -  {1}% data redundancy
                                        </div>
                                    </div>
                                    <div className='dq-div-rc2'>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> - {3}% class imbalance
                                        </div>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> - {5}% feature correlation
                                        </div>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> -  {1}% data redundancy
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
                <div className="dce-container-right-col">
                    <div className="chart-title-box">
                        <div className="chart-title">
                            Data Summary
                        </div>
                        <div className="chart-icons">
                            <InfoLogo setButtonPopup={false} setChartIndex={0} index={3} />
                        </div>
                    </div>
                    <div className="chart-container">
                        <div className="chart-box">
                            <div className="chart-box-1">
                                <div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {dsChartVals["Glucose"].name}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        patient={"2631"}
                                        currentRisk={80}
                                        //setRisk={setRisk}
                                        measure={distributionRecords["bloodSugar"]}
                                        index={0}
                                        patientValue={[dsChartVals["Glucose"].average]}
                                        yVal={dsChartVals["Glucose"].ydata}
                                        xVal={dsChartVals["Glucose"].ydata}
                                    />
                                </div>
                                <div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {distributionRecords["bloodSugar"]["variable"]}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        patient={"2631"}
                                        currentRisk={80}
                                        //setRisk={setRisk}
                                        measure={distributionRecords["bloodSugar"]}
                                        index={0}
                                        patientValue={[dsChartVals["Glucose"].average]}
                                        yVal={dsChartVals["Glucose"].ydata}
                                        xVal={dsChartVals["Glucose"].ydata}
                                    />
                                </div>
                                <div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {distributionRecords["bloodSugar"]["variable"]}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        patient={"2631"}
                                        currentRisk={80}
                                        //setRisk={setRisk}
                                        measure={distributionRecords["bloodSugar"]}
                                        index={0}
                                        patientValue={[dsChartVals["Glucose"].average]}
                                        yVal={dsChartVals["Glucose"].ydata}
                                        xVal={dsChartVals["Glucose"].ydata}
                                    />
                                </div>
                                <div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {distributionRecords["bloodSugar"]["variable"]}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        patient={"2631"}
                                        currentRisk={80}
                                        //setRisk={setRisk}
                                        measure={distributionRecords["bloodSugar"]}
                                        index={0}
                                        patientValue={[dsChartVals["Glucose"].average]}
                                        yVal={dsChartVals["Glucose"].ydata}
                                        xVal={dsChartVals["Glucose"].ydata}
                                    />
                                </div>
                            </div>
                            <div className="chart-box-2">
                                <div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {distributionRecords["bloodSugar"]["variable"]}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        patient={"2631"}
                                        currentRisk={80}
                                        //setRisk={setRisk}
                                        measure={distributionRecords["bloodSugar"]}
                                        index={0}
                                        patientValue={[dsChartVals["Glucose"].average]}
                                        yVal={dsChartVals["Glucose"].ydata}
                                        xVal={dsChartVals["Glucose"].ydata}
                                    />
                                </div><div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {distributionRecords["bloodSugar"]["variable"]}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        patient={"2631"}
                                        currentRisk={80}
                                        //setRisk={setRisk}
                                        measure={distributionRecords["bloodSugar"]}
                                        index={0}
                                        patientValue={[dsChartVals["Glucose"].average]}
                                        yVal={dsChartVals["Glucose"].ydata}
                                        xVal={dsChartVals["Glucose"].ydata}
                                    />
                                </div><div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {distributionRecords["bloodSugar"]["variable"]}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        patient={"2631"}
                                        currentRisk={80}
                                        //setRisk={setRisk}
                                        measure={distributionRecords["bloodSugar"]}
                                        index={0}
                                        patientValue={[dsChartVals["Glucose"].average]}
                                        yVal={dsChartVals["Glucose"].ydata}
                                        xVal={dsChartVals["Glucose"].ydata}
                                    />
                                </div><div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {distributionRecords["bloodSugar"]["variable"]}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        patient={"2631"}
                                        currentRisk={80}
                                        //setRisk={setRisk}
                                        measure={distributionRecords["bloodSugar"]}
                                        index={0}
                                        patientValue={[dsChartVals["Glucose"].average]}
                                        yVal={dsChartVals["Glucose"].ydata}
                                        xVal={dsChartVals["Glucose"].ydata}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
};