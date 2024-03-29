import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { NavBar } from '../components/NavBar/NavBar.jsx';
import './mce.css'
import { Spin, Tooltip } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { UpGreenArrow } from '../components/Icons/UpGreenArrow.jsx';
import { UpRedArrow } from '../components/Icons/UpRedArrow.jsx';
import { DownRedArrow } from '../components/Icons/DownRedArrow.jsx';
import { DoughnutChart } from '../components/EstimatedRiskChart/DoughnutChart.jsx';
import { HollowBullet } from '../components/Icons/HollowBullet.jsx';
import {
    BASE_API,
    DATA_SUMMARY_DEFAULT_MODEL,
    DATA_ISSUE_FRIENDLY_NAMES_Eng,
    DATA_ISSUE_FRIENDLY_NAMES_Slo,
    FRIENDLY_NAMES_ENG,
    FRIENDLY_NAMES_SLO,
    FEAT_DESCRIPTIONS_SLO
} from '../Constants.jsx';
import axios from 'axios';
import { HorizontalBarCharts } from '../components/FeatureImportance/HorizontalBarCharts.jsx';
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
}

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

export const MCE = ({ user }) => {
    var userid = user.id;
    if (userid == null || userid == "") {
        userid = window.localStorage.getItem('userid');
    }
    var cohort = user.cohort;
    if (cohort == null || cohort == "") {
        cohort = window.localStorage.getItem('cohort');
    }
    var language = user.language;
    if (language == null || language == "") {
        language = window.localStorage.getItem('language');
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

    useEffect(() => {
        GetPredChartValue({ userid, setAccChartVals });
        GetFeatureImportance({ userid, setFeatureImportance });
        GetTopDecisionRules({ userid, setTopRules, setRuleView });
    }, []);

    const greenFont = "#449231";
    const redFont = "#D64242";

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
    const lang = (language == 'ENG') ? tooltipEnglishContent : tooltipSloveneContent;
    const DATA_ISSUE_FRIENDLY_NAMEs = (language == 'ENG') ? DATA_ISSUE_FRIENDLY_NAMES_Eng : DATA_ISSUE_FRIENDLY_NAMES_Slo;
    const FRIENDLY_NAMES = (language == "ENG") ? FRIENDLY_NAMES_ENG : FRIENDLY_NAMES_SLO;

    return (
        <>
            <NavBar user={user} />
            <div className="mce-container">
                <div className="mce-container-r1">
                    <div className="mce-container-r1c1">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                {
                                    language == "ENG"
                                        ? "Prediction Accuracy"
                                        : "Točnost napovedi"
                                }
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
                                title={lang.mce.accuracyChart.title}
                                overlayStyle={{ maxWidth: '500px' }}
                            >
                                <div className="chart-icons">
                                    <InfoLogo />
                                </div>
                            </Tooltip>
                        </div>
                        <div className="chart-container-mce" onClick={() => { handleVizClick("PredictionAccuracy", "Viz") }} onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("PredictionAccuracy", "Viz") }}>
                            <div className='chart-container-viz-mce'>
                                <DoughnutChart accuracy={accChartVals.accuracy} chartRef={accuracyChartRef} language={language} />
                            </div>
                            <div className='chart-container-info-mce'>
                                <Tooltip
                                    placement="right"
                                    title={lang.mce.accuracyChart.trainingSamples}
                                    overlayStyle={{ maxWidth: '400px' }}
                                >
                                    <HollowBullet /> &nbsp;{language == "ENG" ? "Training Samples" : "Vzorci za usposabljanje"} : <b>{accChartVals.nsamples}</b>
                                </Tooltip>
                            </div>
                            <div className='chart-container-info-mce'>
                                <Tooltip
                                    placement="right"
                                    title={lang.mce.accuracyChart.featuresConsidered}
                                    overlayStyle={{ maxWidth: '400px' }}
                                >
                                    <HollowBullet /> &nbsp;{language == "ENG" ? "Features Considered" : "Upoštevane značilnosti"} : <b>{accChartVals.nfeats}</b>
                                </Tooltip>
                            </div>
                            <div className='chart-container-info-mce'>
                                <Tooltip
                                    placement="right"
                                    title={(accChartVals.pct > 0) ? lang.mce.accuracyChart.upScore : lang.mce.accuracyChart.downScore}
                                    overlayStyle={{ maxWidth: '400px' }}
                                >
                                    <span style={{ color: (accChartVals.pct > 0) ? greenFont : redFont }}>
                                        {(accChartVals.pct > 0) ? <UpGreenArrow /> : <DownRedArrow />}
                                        <b> &nbsp;{accChartVals.pct}% </b>
                                    </span>
                                    {language == "ENG" ? "from previous score" : "od prejšnjega rezultata"}
                                </Tooltip>
                            </div>
                        </div>
                    </div >
                    <div className="mce-container-r1c2">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                {
                                    language == "ENG"
                                        ? "Top Decision Rules"
                                        : "Najpomembnejša pravila odločanja"
                                }
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
                                            {
                                                language == "ENG"
                                                    ? "Diabetic"
                                                    : "Diabetik"
                                            }
                                        </div>
                                        <div className={activeFilter === "non-diabetic" ? "top-rules-filter-right-active" : "top-rules-filter-right"} onClick={() => { handleFilterClick("non-diabetic") }}>
                                            {
                                                language == "ENG"
                                                    ? "Non-diabetic"
                                                    : "Nediabetik"
                                            }
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
                </div>
                <div className="mce-container-r2">
                    <div className="chart-title-box">
                        <div className="chart-title">
                            {
                                language == "ENG"
                                    ? "Important Risk Factors"
                                    : "Pomembni dejavniki tveganja"
                            }
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
                    <div className="chart-container-mce">
                        {featureImportance.actionable.features == null || featureImportance['non-actionable'].features == null ?
                            loadingIndicator :
                            <>
                                <div className="chart-box-mce" onClick={() => { handleVizClick("FeatureImportance", "Viz") }} onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("FeatureImportance", "Viz") }}>
                                    <div className="cc-mce-left">
                                        <HorizontalBarCharts
                                            x_values={featureImportance.actionable.importance}
                                            y_labels={featureImportance.actionable.features}
                                            isActionable={true}
                                            lang={language}
                                        />
                                    </div>
                                    <div className="cc-mce-right">
                                        <HorizontalBarCharts
                                            x_values={featureImportance['non-actionable'].importance}
                                            y_labels={featureImportance['non-actionable'].features}
                                            isActionable={false}
                                            lang={language}
                                        />
                                    </div>
                                </div>
                                <div className="chart-container-text">
                                    <div className="cc-text-left">
                                        <Tooltip
                                            placement="bottom"
                                            title={lang.mce.featureImportance.actionable}
                                            overlayStyle={{ maxWidth: '400px' }}
                                        >
                                            <b>
                                                {
                                                    language == "ENG"
                                                        ? "Actionable Factors"
                                                        : "Ukrepljivi dejavniki"
                                                }
                                            </b>
                                        </Tooltip>
                                    </div>
                                    <div className="cc-text-right">
                                        <Tooltip
                                            placement="bottom"
                                            title={lang.mce.featureImportance.nonActionable}
                                            overlayStyle={{ maxWidth: '400px' }}
                                        >
                                            <b>
                                                {
                                                    language == "ENG"
                                                        ? "Non-actionable Factors"
                                                        : "Neukrepljivi dejavniki"
                                                }
                                            </b>
                                        </Tooltip>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    );

};