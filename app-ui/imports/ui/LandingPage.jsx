import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_API } from './Constants';
import axios from 'axios';

export const LandingPage = ({ user, setUser }) => {
    const navigate = useNavigate();
    useEffect(() => {
        window.localStorage.setItem('userid', user.id);
    }, [user.id]);
    useEffect(() => {
        window.localStorage.setItem('cohort', user.cohort);
    }, [user.cohort]);
    useEffect(() => {
        window.localStorage.setItem('language', user.language);
    }, [user.language]);
    useEffect(() => {
        window.localStorage.setItem('group', user.group);
    }, [user.group]);

    const selectedDashType = () => {
        console.log(user);
        axios.post(BASE_API + '/validateusers', {
            UserId: user.id,
            Cohort: user.group,
            Language: user.language,
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
                "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
            }
        }).then(function (response) {
            //console.log(response.data);
            if (response.data["StatusCode"]) {
                navigate('/dashboard/' + user.cohort);
            }
            else {
                console.log("Error reported. Login failed.")
                // TO-DO: Navigate to Error Screen.
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    const handleChange = e => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    console.log(BASE_API);

    return (<div className="app-container">
        <div className="lp-container">
            <div className="lp-container-inner">
                <img className="lp-container-image" src="https://raw.githubusercontent.com/adib0073/HCI_design/main/EXMOS2023/exmos_logo_1.png" />
                <h1 className="lp-container-headerfont-1">
                    {user.language == "ENG"
                        ?
                        "Explanatory Model Steering for Healthcare"
                        :
                        "Explanatory Model Steering for Healthcare"
                    }

                </h1>
                <br />
                <h1 className="lp-container-headerfont-2">
                    {"An Interactive Explainable Machine Learning Platform for Healthcare Experts for Personalized Predictions"}

                </h1>

                <div className="lp-container-entry">
                    <form onClick={(e) => e.preventDefault()}>
                        <input
                            className="lp-container-entry-input"
                            placeholder={"Enter your username to begin:"}
                            value={user.id}
                            name="id"
                            onChange={handleChange}
                            required />
                        <br />

                        <br />
                        <button
                            className="lp-container-entry-button"
                            disabled={user.id === ""}
                            type="submit"
                            onClick={selectedDashType}
                        >
                            {
                                user.id === "" || user.group === "" ?
                                    "Not ready yet?" : "Let's Start"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div className='video-container'>
            <video autoPlay loop muted width="100%" height="100%">
                <source src="https://github.com/adib0073/HCI_design/blob/main/EXMOS2023/website_bg.mp4?raw=true" type="video/mp4" />
            </video>
        </div>
    </div >
    );

};