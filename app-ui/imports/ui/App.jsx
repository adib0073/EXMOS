import React from 'react';
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from './Dashboard.jsx';
import { DCE } from './dashboards/dce.jsx';
import { MCE } from './dashboards/mce.jsx';
import { HYB } from './dashboards/hyb.jsx';
import { LandingPage } from './LandingPage.jsx';
import { Configuration } from './pages/Configuration.jsx';

export const App = () => {
    const [user, setUser] = useState({ 
        id: "", 
        group: "all",
        cohort: "HYB", 
        language: "ENG" });

    const [activeTab, setActiveTab] = useState("tab1");
    const [updateDash, setUpdateDash] = useState(true);

    return (
        <>
        <style>
            {'body {background-color:#E5E5E5;}'}
        </style>
            <BrowserRouter basename="/exmos">
                <Routes>
                    <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
                    <Route path="/dashboard/hyb" element={<HYB user = {user} updateDash={updateDash} setUpdateDash={setUpdateDash}/>} />
                    <Route path="/configuration" element={<Configuration user={user} activeTab={activeTab} setActiveTab={setActiveTab}/>} />
                </Routes>
            </BrowserRouter>
        </>
    );

};