import React from 'react';
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { DCE } from './dashboards/dce.jsx';
import { LandingPage } from './LandingPage';
import { Configuration } from './pages/Configuration';

export const App = () => {
    const [user, setUser] = useState({ id: "", cohort: "" });

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
                    <Route path="/dashboard/dce" element={<DCE user = {user}/>} />
                    <Route path="/dashboard/mce" element={<Dashboard />} />
                    <Route path="/dashboard/hyd" element={<Dashboard />} />
                    <Route path="/configuration" element={<Configuration user={user} setUser={setUser} />} />
                </Routes>
            </BrowserRouter>
        </>
    );

};