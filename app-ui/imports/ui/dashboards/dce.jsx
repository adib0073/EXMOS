import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { NavBar } from '../components/NavBar/NavBar.jsx';
import './dce.css'
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { UpGreenArrow } from '../components/Icons/UpGreenArrow.jsx';
import { DownRedArrow } from '../components/Icons/DownRedArrow.jsx';
import { DoughnutChart } from '../components/EstimatedRiskChart/DoughnutChart.jsx';
import { HollowBullet } from '../components/Icons/HollowBullet.jsx';
import { BASE_API, DATA_SUMMARY_DEFAULT_MODEL } from '../Constants.jsx';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart'
import { ContinuousDistribution } from '../components/PatientSummaryPlot/ContinuousDistribution.jsx';
// TO-DO - Delete following if not required

const GetPredChartValue = ({ userid, setAccChartVals }) => {

    axios.get(BASE_API + '/getpredchartvalues/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
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
            //console.log(response.data["OutputJson"]);
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

const GetDQChartValue = ({ userid, setDqChartVals }) => {

    axios.get(BASE_API + '/getdataquality/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setDqChartVals({
                "score": response.data["OutputJson"]["score"],
                "quality_class": response.data["OutputJson"]["quality_class"],
                "issues": response.data["OutputJson"]["issues"],
                "issue_val": response.data["OutputJson"]["issue_val"]
            });

        }).catch(function (error) {
            console.log(error);
        });
}

const GetKIChartValue = ({ userid, setKiChartVals }) => {

    axios.get(BASE_API + '/getkeyinsights/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setKiChartVals({
                "pct_list": response.data["OutputJson"]["pct_list"],
                "input_list": response.data["OutputJson"]["input_list"],
                "insight_list": response.data["OutputJson"]["insight_list"]
            });

        }).catch(function (error) {
            console.log(error);
        });
}

export const DCE = ({ user }) => {
    var userid = user.id;
    var cohort = user.cohort;
    if (userid == null || userid == "") {
        userid = window.localStorage.getItem('userid');
    }
    const accuracyChartRef = useRef();
    const [accChartVals, setAccChartVals] = useState({ accuracy: 0, nsamples: 0, nfeats: 0, pct: 0 });
    const [dsChartVals, setDsChartVals] = useState(DATA_SUMMARY_DEFAULT_MODEL);
    const [dqChartVals, setDqChartVals] = useState({
        "score": 0.0,
        "quality_class": "Unknown",
        "issues": ["class imbalance", "outliers", "feature correlation", "data redundancy", "data drift", "data leakage"],
        "issue_val": [0, 0, 0, 0, 0, 0]
    });
    const [kiChartVals, setKiChartVals] = useState({
        "pct_list": [0, 0, 0, 0],
        "input_list": ["Not available. ", "Not available. ", "Not available. ", "Not available. "],
        "insight_list": ["Try later", "Try later", "Try later", "Try later"],
    });
    useEffect(() => {
        GetPredChartValue({ userid, setAccChartVals });
        GetDSChartValue({ userid, setDsChartVals });
        GetDQChartValue({ userid, setDqChartVals });
        GetKIChartValue({ userid, setKiChartVals });
    }, []);

    const greenFont = "#449231";
    const redFont = "#D64242";

    return (
        <>
            <NavBar user={user} />
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
                                    <HollowBullet /> &nbsp;Training Samples : <b>{accChartVals.nsamples}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> &nbsp;Features Considered : <b>{accChartVals.nfeats}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <span style={{ color: (accChartVals.pct > 0) ? greenFont : redFont }}>
                                        {(accChartVals.pct > 0) ? <UpGreenArrow/> : <DownRedArrow/>}
                                        <b> &nbsp;{accChartVals.pct}% </b>
                                    </span>
                                    from previous score
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
                                            {kiChartVals["pct_list"][0]}%
                                        </div>
                                        <div className="capsule-div-right">
                                            {kiChartVals["input_list"][0]}  <b>{kiChartVals["insight_list"][0]}</b>
                                        </div>
                                    </div>
                                    <div className="capsule-div">
                                        <div className="capsule-div-left">
                                            {kiChartVals["pct_list"][1]}%
                                        </div>
                                        <div className="capsule-div-right">
                                            {kiChartVals["input_list"][1]}  <b>{kiChartVals["insight_list"][1]}</b>
                                        </div>
                                    </div>
                                    <div className="capsule-div">
                                        <div className="capsule-div-left">
                                            {kiChartVals["pct_list"][2]}%
                                        </div>
                                        <div className="capsule-div-right">
                                            {kiChartVals["input_list"][2]}  <b>{kiChartVals["insight_list"][2]}</b>
                                        </div>
                                    </div>
                                    <div className="capsule-div">
                                        <div className="capsule-div-left">
                                            {kiChartVals["pct_list"][3]}%
                                        </div>
                                        <div className="capsule-div-right">
                                            {kiChartVals["input_list"][3]}  <b>{kiChartVals["insight_list"][3]}</b>
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
                                        arcsLength={[dqChartVals["score"], 1 - dqChartVals["score"]]}
                                        percent={dqChartVals["score"]}
                                        textColor={"black"}
                                        hideText={true}
                                        colors={['#1363DF', '#E5E5E5']}
                                        style={{ width: "15vw" }}
                                    />
                                    <div className='dq-div-left-info'>
                                        {dqChartVals["quality_class"]}
                                    </div>
                                </div>
                                <div className='dq-div-right'>
                                    <div className='dq-div-rc1'>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> {dqChartVals["issue_val"][0]}% {dqChartVals["issues"][0]}
                                        </div>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> - {dqChartVals["issue_val"][1]}% {dqChartVals["issues"][1]}
                                        </div>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> -  {dqChartVals["issue_val"][2]}% {dqChartVals["issues"][2]}
                                        </div>
                                    </div>
                                    <div className='dq-div-rc2'>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> - {dqChartVals["issue_val"][3]}% {dqChartVals["issues"][3]}
                                        </div>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> - {dqChartVals["issue_val"][4]}% {dqChartVals["issues"][4]}
                                        </div>
                                        <div className='dq-div-rc-text'>
                                            <HollowBullet /> -  {dqChartVals["issue_val"][5]}% {dqChartVals["issues"][5]}
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
                            Data Density Distribution
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
                                        {"Glucose"}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        average={[dsChartVals["Glucose"].average]}
                                        yVal={dsChartVals["Glucose"].ydata}
                                        xVal={dsChartVals["Glucose"].xdata}
                                        uLimit={dsChartVals["Glucose"].upperLimit}
                                        lLimit={dsChartVals["Glucose"].lowerLimit}
                                    />
                                </div>
                                <div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {"Blood Pressure"}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        average={[dsChartVals["BloodPressure"].average]}
                                        yVal={dsChartVals["BloodPressure"].ydata}
                                        xVal={dsChartVals["BloodPressure"].xdata}
                                        uLimit={dsChartVals["BloodPressure"].upperLimit}
                                        lLimit={dsChartVals["BloodPressure"].lowerLimit}
                                    />
                                </div>
                                <div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {"Insulin"}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        average={[dsChartVals["Insulin"].average]}
                                        yVal={dsChartVals["Insulin"].ydata}
                                        xVal={dsChartVals["Insulin"].xdata}
                                        uLimit={dsChartVals["Insulin"].upperLimit}
                                        lLimit={dsChartVals["Insulin"].lowerLimit}
                                    />
                                </div>
                                <div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {"Pregnancies"}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        average={[dsChartVals["Pregnancies"].average]}
                                        yVal={dsChartVals["Pregnancies"].ydata}
                                        xVal={dsChartVals["Pregnancies"].xdata}
                                        uLimit={dsChartVals["Pregnancies"].upperLimit}
                                        lLimit={dsChartVals["Pregnancies"].lowerLimit}
                                    />
                                </div>
                            </div>
                            <div className="chart-box-2">
                                <div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {"Skin Thickness"}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        average={[dsChartVals["SkinThickness"].average]}
                                        yVal={dsChartVals["SkinThickness"].ydata}
                                        xVal={dsChartVals["SkinThickness"].xdata}
                                        uLimit={dsChartVals["SkinThickness"].upperLimit}
                                        lLimit={dsChartVals["SkinThickness"].lowerLimit}
                                    />
                                </div><div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {"Age"}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        average={[dsChartVals["Age"].average]}
                                        yVal={dsChartVals["Age"].ydata}
                                        xVal={dsChartVals["Age"].xdata}
                                        uLimit={dsChartVals["Age"].upperLimit}
                                        lLimit={dsChartVals["Age"].lowerLimit}
                                    />
                                </div><div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {"Diabetes Pedigree Function"}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        average={[dsChartVals["DiabetesPedigreeFunction"].average]}
                                        yVal={dsChartVals["DiabetesPedigreeFunction"].ydata}
                                        xVal={dsChartVals["DiabetesPedigreeFunction"].xdata}
                                        uLimit={dsChartVals["DiabetesPedigreeFunction"].upperLimit}
                                        lLimit={dsChartVals["DiabetesPedigreeFunction"].lowerLimit}
                                    />
                                </div><div className="summary-chart-box">
                                    <span className="ValueLabel">
                                        {"Body Mass Index"}:
                                    </span>
                                    <br />
                                    <ContinuousDistribution
                                        average={[dsChartVals["BMI"].average]}
                                        yVal={dsChartVals["BMI"].ydata}
                                        xVal={dsChartVals["BMI"].xdata}
                                        uLimit={dsChartVals["BMI"].upperLimit}
                                        lLimit={dsChartVals["BMI"].lowerLimit}
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