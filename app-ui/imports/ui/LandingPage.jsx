import React from 'react';
import { useNavigate  } from 'react-router-dom';
import { Input, Select } from 'antd';



export const LandingPage = () => {
    const navigate = useNavigate ();
    const selectedDashType = () => {
        navigate('/dashboard');
    }
    return (<div className="app-container">
        <div className="lp-container">
            <div className="lp-container-inner">
                <img className="lp-container-image" src="https://events.transperfect.com/wp-content/uploads/2021/09/DataForce-Logo-White.png" />
                <h1 className="lp-container-headerfont-1">
                    Explanatory Model Steering for Healthcare
                </h1>
                <br />
                <h1 className="lp-container-headerfont-2">
                    An Interactive Machine Learning platform for healthcare experts for personalized predictions
                </h1>
                <Input placeholder="Please enter your user id" />
                <br />
                <Input placeholder="Please enter your assigned code" />
                <br />
                <br />
                <button onClick={selectedDashType}>Let's Start</button>
            </div>
        </div>
        <div className='video-container'>
            <video autoPlay loop muted width="100%" height="100%">
                <source src="https://drive.google.com/uc?export=download&id=11iei1XUn8nlaKqelYwyueplnj42-JjQb" type="video/mp4" />
            </video>
        </div>
    </div >
    );

};