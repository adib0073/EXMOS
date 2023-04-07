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
import { Tooltip, Spin } from 'antd';
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
                pct: response.data["OutputJson"]["ScoreChange"]
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
    const [accChartVals, setAccChartVals] = useState({ accuracy: 0, nsamples: 0, nfeats: 0, pct: 0 });
    const [activeFilter, setActiveFilter] = useState("diabetic");
    const [topRules, setTopRules] = useState({
        "diabetic": null,
        "non-diabetic": null
    });
    const [ruleView, setRuleView] = useState(["Not found"]);
    const [kiChartVals, setKiChartVals] = useState({
        "pct_list": [0, 0, 0, 0],
        "input_list": ["Not available. ", "Not available. ", "Not available. ", "Not available. "],
        "insight_list": ["Try later", "Try later", "Try later", "Try later"],
    });

    const greenFont = "#449231";
    const redFont = "#D64242";

    useEffect(() => {
        GetPredChartValue({ userid, setAccChartVals });
        //GetFeatureImportance({ userid, setFeatureImportance });
        GetTopDecisionRules({ userid, setTopRules, setRuleView });
        GetKIChartValue({ userid, setKiChartVals });
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
                            <div className='chart-container-info'>
                                <Tooltip
                                    placement="right"
                                    title={lang.dce.accuracyChart.trainingSamples}
                                    overlayStyle={{ maxWidth: '400px' }}
                                >
                                    <HollowBullet /> &nbsp;Training Samples : <b>{accChartVals.nsamples}</b>
                                </Tooltip>
                            </div>
                            <div className='chart-container-info'>
                                <Tooltip
                                    placement="right"
                                    title={lang.dce.accuracyChart.featuresConsidered}
                                    overlayStyle={{ maxWidth: '400px' }}
                                >
                                    <HollowBullet /> &nbsp;Features Considered : <b>{accChartVals.nfeats}</b>
                                </Tooltip>
                            </div>
                            <div className='chart-container-info'>
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
                                                <div className="top-rules-viz-item" key={index}>
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
                            row 2.1 column 1
                        </div><div className="hyb-container-r2c1-r2">
                            row 2.2 column 1
                        </div>
                    </div>
                    <div className="hyb-container-r2c2">
                        row 2 column 2
                    </div>
                </div>
            </div>
        </>
    );

};