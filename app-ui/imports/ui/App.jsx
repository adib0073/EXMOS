import React from 'react';
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { DCE } from './dashboards/dce.jsx';
import { LandingPage } from './LandingPage';

export const App = () => {
    const [user, setUser] = useState({ id: "", cohort: "" });

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
                    <Route path="/dashboard/dce" element={<DCE />} />
                    <Route path="/dashboard/mce" element={<Dashboard />} />
                    <Route path="/dashboard/hyd" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </>
    );

};