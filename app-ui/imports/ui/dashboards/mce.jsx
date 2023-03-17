import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { NavBar } from '../components/NavBar/NavBar.jsx';
import './mce.css'
import { Spin } from 'antd';
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { UpGreenArrow } from '../components/Icons/UpGreenArrow.jsx';
import { UpRedArrow } from '../components/Icons/UpRedArrow.jsx';
import { DownRedArrow } from '../components/Icons/DownRedArrow.jsx';
import { DoughnutChart } from '../components/EstimatedRiskChart/DoughnutChart.jsx';
import { HollowBullet } from '../components/Icons/HollowBullet.jsx';
import { BASE_API, DATA_SUMMARY_DEFAULT_MODEL, DATA_ISSUE_FRIENDLY_NAMEs } from '../Constants.jsx';
import axios from 'axios';
import { HorizontalBarCharts } from '../components/FeatureImportance/HorizontalBarCharts.jsx';

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

export const MCE = ({ user }) => {
    var userid = user.id;
    var cohort = user.cohort;
    if (userid == null || userid == "") {
        userid = window.localStorage.getItem('userid');
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

    // Loading Indicator
    const loadingIndicator = (
        <>
            <Spin tip="Loading ...  " size="small" />
        </>
    );

    return (
        <>
            <NavBar user={user} />
            <div className="mce-container">
                <div className="mce-container-r1">
                    <div className="mce-container-r1c1">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Prediction Accuracy
                            </div>
                            <div className="chart-icons">
                                <InfoLogo setButtonPopup={false} setChartIndex={0} index={3} />
                            </div>
                        </div>
                        <div className="chart-container-mce">
                            <div className='chart-container-viz-mce'>
                                <DoughnutChart accuracy={accChartVals.accuracy} chartRef={accuracyChartRef} />
                            </div>
                            <div className='chart-container-info-mce'>
                                <HollowBullet /> &nbsp;Training Samples : <b>{accChartVals.nsamples}</b>
                            </div>
                            <div className='chart-container-info-mce'>
                                <HollowBullet /> &nbsp;Features Considered : <b>{accChartVals.nfeats}</b>
                            </div>
                            <div className='chart-container-info-mce'>
                                <span style={{ color: (accChartVals.pct > 0) ? greenFont : redFont }}>
                                    {(accChartVals.pct > 0) ? <UpGreenArrow /> : <DownRedArrow />}
                                    <b> &nbsp;{accChartVals.pct}% </b>
                                </span>
                                from previous score
                            </div>
                        </div>
                    </div >
                    <div className="mce-container-r1c2">
                        <div className="chart-title-box">
                            <div className="chart-title">
                                Top Decision Rules
                            </div>
                            <div className="chart-icons">
                                <InfoLogo setButtonPopup={false} setChartIndex={0} index={3} />
                            </div>
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
                                    <div className="top-rules-viz">
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
                            Important Risk Factors
                        </div>
                        <div className="chart-icons">
                            <InfoLogo setButtonPopup={false} setChartIndex={0} index={3} />
                        </div>
                    </div>
                    <div className="chart-container-mce">
                        {featureImportance.actionable.features == null || featureImportance['non-actionable'].features == null ?
                            loadingIndicator :
                            <>
                                <div className="chart-box-mce">
                                    <div className="cc-mce-left">
                                        <HorizontalBarCharts
                                            x_values={featureImportance.actionable.importance}
                                            y_labels={featureImportance.actionable.features}
                                            isActionable={true}
                                        />
                                    </div>
                                    <div className="cc-mce-right">
                                        <HorizontalBarCharts
                                            x_values={featureImportance['non-actionable'].importance}
                                            y_labels={featureImportance['non-actionable'].features}
                                            isActionable={false}
                                        />
                                    </div>
                                </div>
                                <div className="chart-container-text">
                                    <div className="cc-text-left">
                                        <b>Actionable Factors</b>
                                    </div>
                                    <div className="cc-text-right">
                                        <b>Non-actionable Factors</b>
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