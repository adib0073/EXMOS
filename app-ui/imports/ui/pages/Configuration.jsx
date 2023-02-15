import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar/NavBar.jsx';
import './Configuration.css'

export const Configuration = ({ user, setUser }) => {
    
    const handleTabView = () => {
        console.log("Pressed");
    };
    return (
        <>
            <NavBar user={user} />
            <div className="config-container">
                <div className="tab">
                    <button className="tablinks" onClick={handleTabView}>Configure Features</button>
                    <button className="tablinks" onClick={handleTabView}>Correct Data Issues</button>
                </div>
                <div className="config-display">
                </div>
            </div>
        </>);

};