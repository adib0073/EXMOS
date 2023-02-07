import React from 'react';
import { useRef, useState, useEffect } from 'react';
import NavBar from '../components/NavBar/NavBar.jsx';
import './dce.css'
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { DoughnutChart } from '../components/EstimatedRiskChart/DoughnutChart.jsx';
import { HollowBullet } from '../components/Icons/HollowBullet.jsx';

export const DCE = () => {
    const accuracyChartRef = useRef();
    
    
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
                                    <DoughnutChart accuracy={30} chartRef={accuracyChartRef} />
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> Training Samples : <b>{700}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> Features Considered : <b>{8}</b>
                                </div>
                                <div className='chart-container-info'>
                                    <HollowBullet /> <b>{"+3"}%</b> from previous score

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