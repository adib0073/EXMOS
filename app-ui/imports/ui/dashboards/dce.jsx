import React from 'react';
import { useRef, useState, useEffect } from 'react';
import NavBar from '../components/NavBar/NavBar.jsx';
import './dce.css'
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { DoughnutChart } from '../components/EstimatedRiskChart/DoughnutChart.jsx';
import { HollowBullet } from '../components/Icons/HollowBullet.jsx';
import { BASE_API } from '../Constants.jsx';
import axios from 'axios';

const GetChartValue = ({ userid, setChartVals }) => {

    axios.get(BASE_API + '/getpredchartvalues/?user=' + userid)
        .then(function (response) {
            console.log(response.data["OutputJson"]);
            setChartVals({
                accuracy: response.data["OutputJson"]["Accuracy"],
                nsamples: response.data["OutputJson"]["NumSamples"],
                nfeats: response.data["OutputJson"]["NumFeatures"],
                pct: response.data["OutputJson"]["ScoreChange"]
            });

        }).catch(function (error) {
            console.log(error);
        });


}


export const DCE = ({ userid }) => {
    const accuracyChartRef = useRef();
    const [chartVals, setChartVals] = useState({ accuracy: 0, nsamples: 0, nfeats: 0, pct: 0 });
    // TO-DO: Handle null  cases
    useEffect(() => {
        GetChartValue({ userid, setChartVals });
    }, []);
    console.log(chartVals)
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
                            <div className="chart-container" id="AccuracyChart">
                                <div className='chart-container-viz'>
                                    <DoughnutChart accuracy={chartVals.accuracy} chartRef={accuracyChartRef} />
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> Training Samples : <b>{chartVals.nsamples}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> Features Considered : <b>{chartVals.nfeats}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> <b>{chartVals.pct}%</b> from previous score

                                </div>
                            </div>
                        </div >
                        <div className="dce-container-left-r1c2">
                            Left Col - Row 1 - Sub Col 2
                        </div >
                    </div >
                    <div className="dce-container-left-r2">
                        Left Col - Row 2
                    </div >
                </div >
                <div className="dce-container-right-col">
                    Right Col
                </div >
            </div >
        </>
    );
};