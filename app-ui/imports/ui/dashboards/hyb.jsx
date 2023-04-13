import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { NavBar } from '../components/NavBar/NavBar.jsx';
import './hyb.css'
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { UpGreenArrow } from '../components/Icons/UpGreenArrow.jsx';
import { UpRedArrow } from '../components/Icons/UpRedArrow.jsx';
import { DownRedArrow } from '../components/Icons/DownRedArrow.jsx';
import { DoughnutChart } from '../components/EstimatedRiskChart/DoughnutChart.jsx';
import { HollowBullet } from '../components/Icons/HollowBullet.jsx';
import { RectBlock } from '../components/Icons/RectBlock.jsx';
import { BASE_API, DATA_SUMMARY_DEFAULT_MODEL, DATA_ISSUE_FRIENDLY_NAMEs } from '../Constants.jsx';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart'
import { ContinuousDistribution } from '../components/PatientSummaryPlot/ContinuousDistribution.jsx';
import { HorizontalBarCharts } from '../components/FeatureImportance/HorizontalBarCharts.jsx';
import { Tooltip, Spin } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { tooltipEnglishContent } from '../tooltipContent/tooltipEnglishContent.jsx';
import { tooltipSloveneContent } from '../tooltipContent/tooltipSloveneContent.jsx';

const GetPredChartValue = ({ userid, setAccChartVals }) => {

    axios.get(BASE_API + '/getpredchartvalues/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setAccChartVals({
                accuracy: response.data["OutputJson"]["Accuracy"],
                nsamples: response.data["OutputJson"]["NumSamples"],
                nfeats: response.data["OutputJson"]["NumFeatures"],
                pct: response.data["OutputJson"]["ScoreChange"],
                aco: response.data["OutputJson"]["AutoCorrectOn"]
            });

        }).catch(function (error) {
            console.log(error);
        });
};

const GetTopDecisionRules = ({ userid, setTopRules, setRuleView }) => {
    //console.log(userid);
    axios.get(BASE_API + '/getdecisionrules/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setTopRules(response.data["OutputJson"]);
            setRuleView(response.data["OutputJson"]["diabetic"])
        }).catch(function (error) {
            console.log(error);
        });
};

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
};

const GetFeatureImportance = ({ userid, setFeatureImportance }) => {
    //console.log(userid);
    axios.get(BASE_API + '/getfeatureimportance/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setFeatureImportance(response.data["OutputJson"]);
        }).catch(function (error) {
            console.log(error);
        });
};

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
};

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
};

const PostInteractions = ({ userid, cohort, interactioData }) => {
    axios.post(BASE_API + '/trackinteractions', {
        UserId: userid,
        Cohort: cohort,
        JsonData: interactioData
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        console.log(response.data["OutputJson"]);
        if (response.data["StatusCode"]) {
            // Fire and Forget
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

export const HYB = ({ user }) => {
    var userid = user.id;
    if (userid == null || userid == "") {
        userid = window.localStorage.getItem('userid');
    }
    var cohort = user.cohort;
    if (cohort == null || cohort == "") {
        cohort = window.localStorage.getItem('cohort');
    }

    const accuracyChartRef = useRef();
    // Set UseStates
    const [accChartVals, setAccChartVals] = useState({ accuracy: 0, nsamples: 0, nfeats: 0, pct: 0, aco: false });
    const [activeFilter, setActiveFilter] = useState("diabetic");
    const [topRules, setTopRules] = useState({
        "diabetic": null,
        "non-diabetic": null
    });
    const [ruleView, setRuleView] = useState(["Not found"]);
    const [kiChartVals, setKiChartVals] = useState({
        "pct_list": [0, 0, 0, 0],
        "input_list": ["Not available. ", "Not available. ", "Not available. ", "Not available. "],
        "insight_list": ["Calculating ...", "Calculating ...", "Calculating ...", "Calculating ..."],
    });
    const [dqChartVals, setDqChartVals] = useState({
        "score": 0.0,
        "quality_class": "Unknown",
        "issues": ["class imbalance", "outliers", "feature correlation", "data redundancy", "data drift", "data leakage"],
        "issue_val": [0, 0, 0, 0, 0, 0]
    });
    const [featureImportance, setFeatureImportance] = useState(
        {
            "actionable": {
                "features": null,
                "importance": null
            },
            "non-actionable": {
                "features": null,
                "importance": null
            },
        });
    const [dsChartVals, setDsChartVals] = useState(DATA_SUMMARY_DEFAULT_MODEL);

    const greenFont = "#449231";
    const redFont = "#D64242";

    useEffect(() => {
        GetPredChartValue({ userid, setAccChartVals });
        GetFeatureImportance({ userid, setFeatureImportance });
        GetTopDecisionRules({ userid, setTopRules, setRuleView });
        GetKIChartValue({ userid, setKiChartVals });
        GetDQChartValue({ userid, setDqChartVals });
        GetDSChartValue({ userid, setDsChartVals });
    }, []);

    // Top Rules
    const handleFilterClick = (category) => {
        setActiveFilter(category);
        setRuleView(topRules[category]);
    };

    // Hover time for interaction data
    var startTime, endTime;
    const handleMouseIn = () => {
        startTime = new Date();
    };
    const handleMouseOut = (viz, feature) => {
        endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var duration = Math.round(timeDiff % 60);

        let interactioData = {
            "viz": viz,
            "eventType": "hover",
            "description": feature,
            "timestamp": Date().toString(),
            "duration": duration
        }

        PostInteractions({ userid, cohort, interactioData });
    };
    const handleVizClick = (viz, feature) => {

        let interactioData = {
            "viz": viz,
            "eventType": "click",
            "description": feature,
            "timestamp": Date().toString(),
            "duration": 0
        }

        PostInteractions({ userid, cohort, interactioData });
    };

    // Loading Indicator
    const loadingIndicator = (
        <>
            <Spin tip="Loading ...  " size="small" />
        </>
    );

    // Language variable
    // TO-DO: Take language preferred as input
    const lang = (1 == 1) ? tooltipEnglishContent : tooltipSloveneContent;

    // Data Quality Gauage Chart Color
    const dqChartColor = dqChartVals["score"] > 0.8 ? "#1363DF" : dqChartVals["score"] > 0.5 ? "#67A3FF" : "#FFB1C1" 

    return (
        <>
            <NavBar user={user} />
            <div className="hyb-container">
                <div className="hyb-container-r1">
                    <div className="hyb-container-r1c1">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Prediction Accuracy
                            </div>
                            <Tooltip
                                placement="bottom"
                                title={lang.dce.accuracyChart.autoCorrectOn}
                                overlayStyle={{ maxWidth: '500px' }}
                            >
                                {accChartVals.aco ?
                                    <div className="chart-icons">
                                        <PlusCircleOutlined style={{ fontSize: '15px', color: redFont }} />
                                    </div>
                                    : null
                                }
                            </Tooltip>
                            <Tooltip
                                placement="bottom"
                                title={lang.dce.accuracyChart.title}
                                overlayStyle={{ maxWidth: '500px' }}
                            >
                                <div className="chart-icons">
                                    <InfoLogo />
                                </div>
                            </Tooltip>
                        </div>
                        <div className="chart-container" onClick={() => { handleVizClick("PredictionAccuracy", "Viz") }} onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("PredictionAccuracy", "Viz") }}>
                            <div className='chart-container-viz'>
                                <DoughnutChart accuracy={accChartVals.accuracy} chartRef={accuracyChartRef} />
                            </div>
                            <div className='chart-container-info' style={{ marginLeft: "20%" }}>
                                <Tooltip
                                    placement="right"
                                    title={lang.dce.accuracyChart.trainingSamples}
                                    overlayStyle={{ maxWidth: '400px' }}
                                >
                                    <HollowBullet /> &nbsp;Training Samples : <b>{accChartVals.nsamples}</b>
                                </Tooltip>
                            </div>
                            <div className='chart-container-info' style={{ marginLeft: "20%" }}>
                                <Tooltip
                                    placement="right"
                                    title={lang.dce.accuracyChart.featuresConsidered}
                                    overlayStyle={{ maxWidth: '400px' }}
                                >
                                    <HollowBullet /> &nbsp;Features Considered : <b>{accChartVals.nfeats}</b>
                                </Tooltip>
                            </div>
                            <div className='chart-container-info' style={{ marginLeft: "20%" }}>
                                <Tooltip
                                    placement="right"
                                    title={(accChartVals.pct > 0) ? lang.dce.accuracyChart.upScore : lang.dce.accuracyChart.downScore}
                                    overlayStyle={{ maxWidth: '400px' }}
                                >
                                    <span style={{ color: (accChartVals.pct > 0) ? greenFont : redFont }}>
                                        {(accChartVals.pct > 0) ? <UpGreenArrow /> : <DownRedArrow />}
                                        <b> &nbsp;{accChartVals.pct}% </b>
                                    </span>
                                    from previous score
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className="hyb-container-r1c2">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Top Decision Rules
                            </div>
                            <Tooltip
                                placement="bottom"
                                title={lang.mce.decisionRule.title}
                                overlayStyle={{ maxWidth: '500px' }}
                            >
                                <div className="chart-icons">
                                    <InfoLogo />
                                </div>
                            </Tooltip>
                        </div>
                        <div className="chart-container-mce">
                            {topRules.diabetic == null || topRules['non-diabetic'] == null ?
                                loadingIndicator :
                                <>
                                    <div className="top-rules-filter">
                                        <div className={activeFilter === "diabetic" ? "top-rules-filter-left-active" : "top-rules-filter-left"} onClick={() => { handleFilterClick("diabetic") }}>
                                            Diabetic
                                        </div>
                                        <div className={activeFilter === "non-diabetic" ? "top-rules-filter-right-active" : "top-rules-filter-right"} onClick={() => { handleFilterClick("non-diabetic") }}>
                                            Non-diabetic
                                        </div>
                                    </div>
                                    <div className="top-rules-viz" onClick={() => { handleVizClick("DecisionRules", "Viz") }} onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("DecisionRules", "Viz") }}>
                                        {ruleView.map((item, index) => {
                                            return (
                                                <div className="top-rules-viz-item-hyb" key={index}>
                                                    <b>{item}</b>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="hyb-container-r1c3">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Key Insights
                            </div>
                            <Tooltip
                                placement="bottom"
                                title={lang.dce.keyInsights.title}
                                overlayStyle={{ maxWidth: '500px' }}
                            >
                                <div className="chart-icons">
                                    <InfoLogo />
                                </div>
                            </Tooltip>
                        </div>
                        <div className="chart-container">
                            <div className="capsule-container" onClick={() => { handleVizClick("KeyInsights", "Viz") }} onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("KeyInsights", "Viz") }}>
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
                    </div>
                </div>
                <div className="hyb-container-r2">
                    <div className="hyb-container-r2c1">
                        <div className="hyb-container-r2c1-r1">
                            <div className="chart-title-box">
                                <div className="chart-title">
                                    Important Risk Factors
                                </div>
                                <Tooltip
                                    placement="bottom"
                                    title={lang.mce.featureImportance.title}
                                    overlayStyle={{ maxWidth: '500px' }}
                                >
                                    <div className="chart-icons">
                                        <InfoLogo />
                                    </div>
                                </Tooltip>
                            </div>
                            <div className="chart-container-fi">
                                {featureImportance.actionable.features == null || featureImportance['non-actionable'].features == null ?
                                    loadingIndicator :
                                    <>
                                        <div className="chart-box-fi" onClick={() => { handleVizClick("FeatureImportance", "Viz") }} onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("FeatureImportance", "Viz") }}>
                                            <div className="cc-fi-left">
                                                <HorizontalBarCharts
                                                    x_values={featureImportance.actionable.importance}
                                                    y_labels={featureImportance.actionable.features}
                                                    isActionable={true}
                                                />
                                            </div>
                                            <div className="cc-text-left">
                                                <Tooltip
                                                    placement="bottom"
                                                    title={lang.mce.featureImportance.actionable}
                                                    overlayStyle={{ maxWidth: '400px' }}
                                                >
                                                    <b>Actionable Factors</b>
                                                </Tooltip>
                                            </div>
                                            <div className="cc-fi-right">
                                                <HorizontalBarCharts
                                                    x_values={featureImportance['non-actionable'].importance}
                                                    y_labels={featureImportance['non-actionable'].features}
                                                    isActionable={false}
                                                />
                                            </div>
                                            <div className="cc-text-right">
                                                <Tooltip
                                                    placement="bottom"
                                                    title={lang.mce.featureImportance.nonActionable}
                                                    overlayStyle={{ maxWidth: '400px' }}
                                                >
                                                    <b>Non-actionable Factors</b>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div><div className="hyb-container-r2c1-r2">
                            <div className="chart-title-box">
                                <div className="chart-title">
                                    Data Quality Score
                                </div>
                                <Tooltip
                                    placement="bottom"
                                    title={lang.dce.dataQuality.title}
                                    overlayStyle={{ maxWidth: '500px' }}
                                >
                                    <div className="chart-icons">
                                        <InfoLogo />
                                    </div>
                                </Tooltip>
                            </div>
                            <div className="chart-container">
                                <div className="dq-div" onClick={() => { handleVizClick("DataQuality", "Viz") }} onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("DataQuality", "Viz") }}>
                                    {dqChartVals.score < 0.01 ?
                                        loadingIndicator :
                                        <>
                                            <div className='dq-div-left'>
                                                <Tooltip
                                                    placement="top"
                                                    title={"The data quality is " + dqChartVals["quality_class"].toLowerCase() + ". If the score > 80, then the quality is good. If the score > 50, the quality is moderate. If the score < 50, the quality is poor."}
                                                    overlayStyle={{ maxWidth: '400px' }}
                                                >
                                                    <div>
                                                        <GaugeChart
                                                            nrOfLevels={3}
                                                            arcsLength={[0.5, 0.3, 0.2]}
                                                            percent={dqChartVals["score"]}
                                                            textColor={"black"}
                                                            hideText={true}
                                                            colors={[
                                                                (dqChartVals["score"] > 0.0 ? dqChartColor : '#E5E5E5'),
                                                                (dqChartVals["score"] > 0.5 ? dqChartColor : '#E5E5E5'),
                                                                (dqChartVals["score"] > 0.8 ? dqChartColor : '#E5E5E5')
                                                            ]}
                                                            style={{ width: "15vw" }}
                                                        />
                                                    </div>
                                                </Tooltip>
                                                <div className='dq-div-left-info'>
                                                    <Tooltip
                                                        placement="bottom"
                                                        title={"The data quality is " + dqChartVals["quality_class"] + ". The data quality changes based on how it is configured."}
                                                        overlayStyle={{ maxWidth: '400px' }}
                                                    >
                                                        {dqChartVals["quality_class"]} - {Math.round((dqChartVals["score"] * 100 + Number.EPSILON) * 10) / 10} %
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div className='dq-div-right'>
                                                <div className='dq-div-rc1'>
                                                    <div className='dq-div-rc-text'>
                                                        {dqChartVals.issue_val[0] > 0 ? <UpRedArrow /> : <UpGreenArrow />} &nbsp;
                                                        <span style={{ color: (dqChartVals.issue_val[0] > 0) ? redFont : greenFont }}>
                                                            <b>&nbsp;{dqChartVals["issue_val"][0]}%&nbsp;</b>
                                                        </span>
                                                        <Tooltip
                                                            placement="top"
                                                            title={lang.dce.dataQuality[dqChartVals["issues"][0]]}
                                                            overlayStyle={{ maxWidth: '400px' }}
                                                        >
                                                            {DATA_ISSUE_FRIENDLY_NAMEs[dqChartVals["issues"][0]]}
                                                        </Tooltip>
                                                    </div>
                                                    <div className='dq-div-rc-text'>
                                                        {dqChartVals.issue_val[1] > 0 ? <UpRedArrow /> : <UpGreenArrow />} &nbsp;
                                                        <span style={{ color: (dqChartVals.issue_val[1] > 0) ? redFont : greenFont }}>
                                                            <b>&nbsp;{dqChartVals["issue_val"][1]}%&nbsp;</b>
                                                        </span>
                                                        <Tooltip
                                                            placement="top"
                                                            title={lang.dce.dataQuality[dqChartVals["issues"][1]]}
                                                            overlayStyle={{ maxWidth: '400px' }}
                                                        >
                                                            {DATA_ISSUE_FRIENDLY_NAMEs[dqChartVals["issues"][1]]}
                                                        </Tooltip>
                                                    </div>
                                                    <div className='dq-div-rc-text'>
                                                        {dqChartVals.issue_val[2] > 0 ? <UpRedArrow /> : <UpGreenArrow />} &nbsp;
                                                        <span style={{ color: (dqChartVals.issue_val[2] > 0) ? redFont : greenFont }}>
                                                            <b>&nbsp;{dqChartVals["issue_val"][2]}%&nbsp;</b>
                                                        </span>
                                                        <Tooltip
                                                            placement="top"
                                                            title={lang.dce.dataQuality[dqChartVals["issues"][2]]}
                                                            overlayStyle={{ maxWidth: '400px' }}
                                                        >
                                                            {DATA_ISSUE_FRIENDLY_NAMEs[dqChartVals["issues"][2]]}
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <div className='dq-div-rc2'>
                                                    <div className='dq-div-rc-text'>
                                                        {dqChartVals.issue_val[3] > 0 ? <UpRedArrow /> : <UpGreenArrow />} &nbsp;
                                                        <span style={{ color: (dqChartVals.issue_val[3] > 0) ? redFont : greenFont }}>
                                                            <b>&nbsp;{dqChartVals["issue_val"][3]}%&nbsp;</b>
                                                        </span>
                                                        <Tooltip
                                                            placement="top"
                                                            title={lang.dce.dataQuality[dqChartVals["issues"][3]]}
                                                            overlayStyle={{ maxWidth: '400px' }}
                                                        >
                                                            {DATA_ISSUE_FRIENDLY_NAMEs[dqChartVals["issues"][3]]}
                                                        </Tooltip>
                                                    </div>
                                                    <div className='dq-div-rc-text'>
                                                        {dqChartVals.issue_val[4] > 0 ? <UpRedArrow /> : <UpGreenArrow />} &nbsp;
                                                        <span style={{ color: (dqChartVals.issue_val[4] > 0) ? redFont : greenFont }}>
                                                            <b>&nbsp;{dqChartVals["issue_val"][4]}%&nbsp;</b>
                                                        </span>
                                                        <Tooltip
                                                            placement="top"
                                                            title={lang.dce.dataQuality[dqChartVals["issues"][4]]}
                                                            overlayStyle={{ maxWidth: '400px' }}
                                                        >
                                                            {DATA_ISSUE_FRIENDLY_NAMEs[dqChartVals["issues"][4]]}
                                                        </Tooltip>
                                                    </div>
                                                    <div className='dq-div-rc-text'>
                                                        {dqChartVals.issue_val[5] > 0 ? <UpRedArrow /> : <UpGreenArrow />} &nbsp;
                                                        <span style={{ color: (dqChartVals.issue_val[5] > 0) ? redFont : greenFont }}>
                                                            <b>&nbsp;{dqChartVals["issue_val"][5]}%&nbsp;</b>
                                                        </span>
                                                        <Tooltip
                                                            placement="top"
                                                            title={lang.dce.dataQuality[dqChartVals["issues"][5]]}
                                                            overlayStyle={{ maxWidth: '400px' }}
                                                        >
                                                            {DATA_ISSUE_FRIENDLY_NAMEs[dqChartVals["issues"][5]]}
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hyb-container-r2c2">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Data Density Distribution
                            </div>
                            <Tooltip
                                placement="left"
                                title={lang.dce.dataDensity.title}
                                overlayStyle={{ maxWidth: '500px' }}
                            >
                                <div className="chart-icons">
                                    <InfoLogo />
                                </div>
                            </Tooltip>
                        </div>
                        <div className="chart-container-density">
                            {dsChartVals.Glucose.ydata.length <= 1 || dsChartVals == null ?
                                loadingIndicator :
                                <>
                                    <div className="chart-box" onClick={() => { handleVizClick("DataDensityCharts", "Viz") }} onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("DataDensityCharts", "Viz") }}>
                                        <div className="chart-box-1">
                                            <div className="summary-chart-box">
                                                <Tooltip
                                                    placement="top"
                                                    title={dsChartVals["Glucose"].description}
                                                    overlayStyle={{ maxWidth: '500px' }}
                                                >
                                                    <span className="ValueLabel">
                                                        {dsChartVals["Glucose"].name}: {"(" + dsChartVals["Glucose"].unit + ")"}
                                                    </span>
                                                </Tooltip>
                                                <br />
                                                <ContinuousDistribution
                                                    average={[dsChartVals["Glucose"].average]}
                                                    yVal={dsChartVals["Glucose"].ydata}
                                                    xVal={dsChartVals["Glucose"].xdata}
                                                    uLimit={dsChartVals["Glucose"].upperLimit}
                                                    lLimit={dsChartVals["Glucose"].lowerLimit}
                                                    isActive={dsChartVals["Glucose"].isSelected}
                                                    q1={dsChartVals["Glucose"].q1}
                                                    q3={dsChartVals["Glucose"].q3}
                                                    name={"Glucose"}
                                                    unit={dsChartVals["Glucose"].unit}
                                                />
                                            </div>
                                            <div className="summary-chart-box">
                                                <Tooltip
                                                    placement="top"
                                                    title={dsChartVals["BloodPressure"].description}
                                                    overlayStyle={{ maxWidth: '500px' }}
                                                >
                                                    <span className="ValueLabel">
                                                        {dsChartVals["BloodPressure"].name}: {"(" + dsChartVals["BloodPressure"].unit + ")"}
                                                    </span>
                                                </Tooltip>
                                                <br />
                                                <ContinuousDistribution
                                                    average={[dsChartVals["BloodPressure"].average]}
                                                    yVal={dsChartVals["BloodPressure"].ydata}
                                                    xVal={dsChartVals["BloodPressure"].xdata}
                                                    uLimit={dsChartVals["BloodPressure"].upperLimit}
                                                    lLimit={dsChartVals["BloodPressure"].lowerLimit}
                                                    isActive={dsChartVals["BloodPressure"].isSelected}
                                                    q1={dsChartVals["BloodPressure"].q1}
                                                    q3={dsChartVals["BloodPressure"].q3}
                                                    name={"Blood Pressure"}
                                                    unit={dsChartVals["BloodPressure"].unit}
                                                />
                                            </div>
                                            <div className="summary-chart-box">
                                                <Tooltip
                                                    placement="top"
                                                    title={dsChartVals["Insulin"].description}
                                                    overlayStyle={{ maxWidth: '500px' }}
                                                >
                                                    <span className="ValueLabel">
                                                        {dsChartVals["Insulin"].name}: {"(" + dsChartVals["Insulin"].unit + ")"}
                                                    </span>
                                                </Tooltip>
                                                <br />
                                                <ContinuousDistribution
                                                    average={[dsChartVals["Insulin"].average]}
                                                    yVal={dsChartVals["Insulin"].ydata}
                                                    xVal={dsChartVals["Insulin"].xdata}
                                                    uLimit={dsChartVals["Insulin"].upperLimit}
                                                    lLimit={dsChartVals["Insulin"].lowerLimit}
                                                    isActive={dsChartVals["Insulin"].isSelected}
                                                    q1={dsChartVals["Insulin"].q1}
                                                    q3={dsChartVals["Insulin"].q3}
                                                    name={"Insulin"}
                                                    unit={dsChartVals["Insulin"].unit}
                                                />
                                            </div>
                                            <div className="summary-chart-box">
                                                <Tooltip
                                                    placement="top"
                                                    title={dsChartVals["Pregnancies"].description}
                                                    overlayStyle={{ maxWidth: '500px' }}
                                                >
                                                    <span className="ValueLabel">
                                                        {dsChartVals["Pregnancies"].name}:
                                                    </span>
                                                </Tooltip>
                                                <br />
                                                <ContinuousDistribution
                                                    average={[dsChartVals["Pregnancies"].average]}
                                                    yVal={dsChartVals["Pregnancies"].ydata}
                                                    xVal={dsChartVals["Pregnancies"].xdata}
                                                    uLimit={dsChartVals["Pregnancies"].upperLimit}
                                                    lLimit={dsChartVals["Pregnancies"].lowerLimit}
                                                    isActive={dsChartVals["Pregnancies"].isSelected}
                                                    q1={dsChartVals["Pregnancies"].q1}
                                                    q3={dsChartVals["Pregnancies"].q3}
                                                    name={"Pregnancies"}
                                                    unit={""}
                                                />
                                            </div>
                                        </div>
                                        <div className="chart-box-2">
                                            <div className="summary-chart-box">
                                                <Tooltip
                                                    placement="top"
                                                    title={dsChartVals["SkinThickness"].description}
                                                    overlayStyle={{ maxWidth: '500px' }}
                                                >
                                                    <span className="ValueLabel">
                                                        {dsChartVals["SkinThickness"].name}: {"(" + dsChartVals["SkinThickness"].unit + ")"}
                                                    </span>
                                                </Tooltip>
                                                <br />
                                                <ContinuousDistribution
                                                    average={[dsChartVals["SkinThickness"].average]}
                                                    yVal={dsChartVals["SkinThickness"].ydata}
                                                    xVal={dsChartVals["SkinThickness"].xdata}
                                                    uLimit={dsChartVals["SkinThickness"].upperLimit}
                                                    lLimit={dsChartVals["SkinThickness"].lowerLimit}
                                                    isActive={dsChartVals["SkinThickness"].isSelected}
                                                    q1={dsChartVals["SkinThickness"].q1}
                                                    q3={dsChartVals["SkinThickness"].q3}
                                                    name={"Skin Thickness"}
                                                    unit={dsChartVals["SkinThickness"].unit}
                                                />
                                            </div><div className="summary-chart-box">
                                                <Tooltip
                                                    placement="top"
                                                    title={dsChartVals["Age"].description}
                                                    overlayStyle={{ maxWidth: '500px' }}
                                                >
                                                    <span className="ValueLabel">
                                                        {dsChartVals["Age"].name}:
                                                    </span>
                                                </Tooltip>
                                                <br />
                                                <ContinuousDistribution
                                                    average={[dsChartVals["Age"].average]}
                                                    yVal={dsChartVals["Age"].ydata}
                                                    xVal={dsChartVals["Age"].xdata}
                                                    uLimit={dsChartVals["Age"].upperLimit}
                                                    lLimit={dsChartVals["Age"].lowerLimit}
                                                    isActive={dsChartVals["Age"].isSelected}
                                                    q1={dsChartVals["Age"].q1}
                                                    q3={dsChartVals["Age"].q3}
                                                    name={"Age"}
                                                    unit={""}
                                                />
                                            </div><div className="summary-chart-box">
                                                <Tooltip
                                                    placement="top"
                                                    title={dsChartVals["DiabetesPedigreeFunction"].description}
                                                    overlayStyle={{ maxWidth: '500px' }}
                                                >
                                                    <span className="ValueLabel">
                                                        {dsChartVals["DiabetesPedigreeFunction"].name}:
                                                    </span>
                                                </Tooltip>
                                                <br />
                                                <ContinuousDistribution
                                                    average={[dsChartVals["DiabetesPedigreeFunction"].average]}
                                                    yVal={dsChartVals["DiabetesPedigreeFunction"].ydata}
                                                    xVal={dsChartVals["DiabetesPedigreeFunction"].xdata}
                                                    uLimit={dsChartVals["DiabetesPedigreeFunction"].upperLimit}
                                                    lLimit={dsChartVals["DiabetesPedigreeFunction"].lowerLimit}
                                                    isActive={dsChartVals["DiabetesPedigreeFunction"].isSelected}
                                                    q1={dsChartVals["DiabetesPedigreeFunction"].q1}
                                                    q3={dsChartVals["DiabetesPedigreeFunction"].q3}
                                                    name={"Pedigree Function"}
                                                    unit={""}
                                                />
                                            </div><div className="summary-chart-box">
                                                <Tooltip
                                                    placement="top"
                                                    title={dsChartVals["BMI"].description}
                                                    overlayStyle={{ maxWidth: '500px' }}
                                                >
                                                    <span className="ValueLabel">
                                                        {dsChartVals["BMI"].name}: {"(" + dsChartVals["BMI"].unit + ")"}
                                                    </span>
                                                </Tooltip>
                                                <br />
                                                <ContinuousDistribution
                                                    average={[dsChartVals["BMI"].average]}
                                                    yVal={dsChartVals["BMI"].ydata}
                                                    xVal={dsChartVals["BMI"].xdata}
                                                    uLimit={dsChartVals["BMI"].upperLimit}
                                                    lLimit={dsChartVals["BMI"].lowerLimit}
                                                    isActive={dsChartVals["BMI"].isSelected}
                                                    q1={dsChartVals["BMI"].q1}
                                                    q3={dsChartVals["BMI"].q3}
                                                    name={"BMI"}
                                                    unit={dsChartVals["BMI"].unit}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                        <div className="bottom-legend">
                            <Tooltip
                                placement="bottom"
                                title={lang.dce.dataDensity.extreme}
                                overlayStyle={{ maxWidth: '400px' }}
                            >
                                <RectBlock color="#FFB1C1" /> Extreme Values &nbsp;
                            </Tooltip>
                            <Tooltip
                                placement="bottom"
                                title={lang.dce.dataDensity.nonExtreme}
                                overlayStyle={{ maxWidth: '400px' }}
                            >
                                <RectBlock color="#67A3FF" /> Non-extreme Values
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};