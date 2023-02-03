import React from 'react';
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { LandingPage } from './LandingPage';

export const App = () => {
    const [user, setUser] = useState({ id: "", cohort: "" });

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </>
    );

};