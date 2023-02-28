import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar/NavBar.jsx';
import './Configuration.css'
import { DataIssueConfig } from './DataIssueConfig.jsx';
import { FeatureConfig } from './FeatureConfig.jsx';

export const Configuration = ({ user, setUser }) => {
    const [activeTab, setActiveTab] = useState("tab1");
    var userid = user.id;
    if (userid == null || userid==""){
        userid = window.localStorage.getItem('userid');
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
                    >Configure Features</li>
                    <li className={activeTab === "tab2" ? "active" : ""}
                        onClick={handleTab2View}
                    >Correct Data Issues</li>
                </ul>
                <div className="config-display">
                    {activeTab === "tab1" ? <FeatureConfig userid={userid} /> : <DataIssueConfig userid={userid}/>}
                </div>
            </div>
        </>);

};