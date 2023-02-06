import React from 'react';
import { useRef, useState, useEffect } from 'react';
import NavBar from '../components/NavBar/NavBar.jsx';
import './dce.css'

export const DCE = () => {
    return (
        <>
            <NavBar />
            <div className="dce-container">
                <div className="dce-container-left-col">
                    <div className="dce-container-left-r1">
                        <div className="dce-container-left-r1c1">
                            Left Col - Row 1 - Sub Col 1
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