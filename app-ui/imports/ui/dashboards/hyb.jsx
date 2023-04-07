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
import { Tooltip } from 'antd';
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
}

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

    const greenFont = "#449231";
    const redFont = "#D64242";

    useEffect(() => {
        GetPredChartValue({ userid, setAccChartVals });
        //GetFeatureImportance({ userid, setFeatureImportance });
        //GetTopDecisionRules({ userid, setTopRules, setRuleView });
    }, []);

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
                        row 1 column 2
                    </div>
                    <div className="hyb-container-r1c3">
                        row 1 column 3
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