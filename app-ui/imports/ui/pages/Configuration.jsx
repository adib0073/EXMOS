import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar/NavBar.jsx';
import './Configuration.css'
import { DataIssueConfig } from './DataIssueConfig.jsx';
import { FeatureConfig } from './FeatureConfig.jsx';

export const Configuration = ({ user, activeTab, setActiveTab }) => {
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

    const handleTab1View = () => {
        setActiveTab("tab1");
    };
    const handleTab2View = () => {
        setActiveTab("tab2");
    };
    return (
        <>
            <NavBar user={user} />
            <div className="config-container">
                <ul className="tab">
                    <li className={activeTab === "tab1" ? "active" : ""}
                        onClick={handleTab1View}
                    >
                        {
                            language == "ENG"
                                ? "Configure Features"
                                : "Konfiguracija spremenljivk"
                        }
                    </li>
                    <li className={activeTab === "tab2" ? "active" : ""}
                        onClick={handleTab2View}
                    >
                        {
                            language == "ENG"
                                ? "Correct Data Issues"
                                : "Odpravite težave s podatki"
                        }
                    </li>
                </ul>
                <div className="config-display">
                    {activeTab === "tab1"
                        ? <FeatureConfig userid={userid} cohort={cohort} language={language} />
                        : <DataIssueConfig userid={userid} cohort={cohort} language={language} setActiveTab={setActiveTab} />
                    }
                </div>
            </div>
        </>);

};