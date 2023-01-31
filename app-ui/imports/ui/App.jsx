import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { LandingPage } from './LandingPage';

export const App = () => {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />}/>
                    <Route path="/dashboard" element={<Dashboard />}/>
                </Routes>
            </BrowserRouter>
        </>
    );

};