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

export const HYB = ({ user }) => {
    var userid = user.id;
    var cohort = user.cohort;
    if (userid == null || userid == "") {
        userid = window.localStorage.getItem('userid');
    }
    return (
        <>
            <NavBar user={user} />
            <div className="hyb-container">
                <div className="hyb-container-r1">
                    <div className="hyb-container-r1c1">
                        row 1 column 1
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