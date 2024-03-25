import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar/NavBar.jsx';
import './Configuration.css'
import { DataIssueConfig } from './DataIssueConfig.jsx';
import { FeatureConfig } from './FeatureConfig.jsx';
import { BASE_API, DATA_SUMMARY_DEFAULT_MODEL } from '../Constants.jsx';
import axios from 'axios';

// MCON functions
export const GetConfigData = ({ userid, setFeatureConfig }) => {
    axios.get(BASE_API + '/getconfigdata/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setFeatureConfig({
                "Pregnancies": response.data["OutputJson"]["Pregnancies"],
                "Glucose": response.data["OutputJson"]["Glucose"],
                "BloodPressure": response.data["OutputJson"]["BloodPressure"],
                "SkinThickness": response.data["OutputJson"]["SkinThickness"],
                "Insulin": response.data["OutputJson"]["Insulin"],
                "BMI": response.data["OutputJson"]["BMI"],
                "DiabetesPedigreeFunction": response.data["OutputJson"]["DiabetesPedigreeFunction"],
                "Age": response.data["OutputJson"]["Age"],
                "target": response.data["OutputJson"]["target"]
            });

        }).catch(function (error) {
            console.log(error);
        });
};


// ACON functions
export const GetAutoCorrectConfigs = ({ userid, setSelectedDataIssues, setWaitFlag }) => {
    //console.log(userid);
    axios.get(BASE_API + '/getautocorrectconfig/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setSelectedDataIssues(response.data["OutputJson"]);
            setWaitFlag(false);
        }).catch(function (error) {
            console.log(error);
        });
};


export const GetOutliers = ({ userid, setOutlierData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkoutliers/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setOutlierData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "outlier": response.data["isOutlier"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};

export const GetImbalance = ({ userid, setImbalanceData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkclassimbalance/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setImbalanceData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "imbalance": response.data["isImbalance"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};

export const GetDuplicates = ({ userid, setDuplicateData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkduplicates/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setDuplicateData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "duplicate": response.data["isDuplicate"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};
export const GetSkew = ({ userid, setSkewData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkskew/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setSkewData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "skew": response.data["isSkew"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};
export const GetDrift = ({ userid, setDriftData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkdatadrift/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setDriftData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "drift": response.data["isDrift"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};
export const GetCorrelation = ({ userid, setCorrelationData, setDisplayIssue }) => {
    //console.log(userid);
    axios.get(BASE_API + '/checkcorrelation/?user=' + userid)
        .then(function (response) {
            //console.log(response.data["OutputJson"]);
            setCorrelationData(response.data["OutputJson"]);
            setDisplayIssue(prevState => ({
                ...prevState,
                "correlation": response.data["isCorrelated"]
            }));
        }).catch(function (error) {
            console.log(error);
        });
};

export const Configuration = ({ user, activeTab, setActiveTab }) => {
    var userid = user.id;
    if (userid == null || userid == "") {
        userid = window.localStorage.getItem('userid');
    }
    var cohort = user.cohort;
    if (cohort == null || cohort == "") {
        cohort = window.localStorage.getItem('cohort');
    }
    var group = user.group;
    if (group == null || group == "") {
        group = window.localStorage.getItem('group');
    }
    var language = user.language;
    if (language == null || language == "") {
        language = window.localStorage.getItem('language');
    }

    const handleTab1View = () => {
        setActiveTab("tab1");
    };
    const handleTab2View = () => {
        setActiveTab("tab2");
    };

    // MCON Init
    const [featureConfig, setFeatureConfig] = useState(DATA_SUMMARY_DEFAULT_MODEL);

    // ACON Init
    /* Use State Initializations */
    const [outlierData, setOutlierData] = useState([
        {
            "feature": "No feature",
            "status": false,
        }
    ]);
    const [duplicateData, setDuplicateData] = useState(
        {
            "duplicate_score": 0
        }
    );
    const [imblanceData, setImbalanceData] = useState({
        "majority": "non-diabetic",
        "majority_pct": 0,
        "minority": "diabetic",
        "minority_pct": 0
    });
    const [driftData, setDriftData] = useState({
        "overall": {
            "drift_score": 0
        },
        "feature": "No feature",
    }
    );
    const [skewData, setSkewData] = useState(
        {
            "skew_score": 0,
            "features": "No features"
        }
    );
    const [correlationData, setCorrelationData] = useState(
        {
            "corrScore": 0,
            "corrFeatures": "No features"
        }
    );
    const [displayIssue, setDisplayIssue] = useState(
        {
            "outlier": true,
            "correlation": true,
            "skew": true,
            "imbalance": true,
            "drift": true,
            "duplicate": true,
        }
    );

    const [outlierMapData, setOutlierMapData] = useState({
        "actuals": {
            "y_val": [0],
            "x_val": [0]
        },
        "corrected": {
            "y_val": [0],
            "x_val": [0]
        },
        "lower": 0,
        "upper": 0
    });

    const [selectedDataIssues, setSelectedDataIssues] = useState(
        {
            "outlier": false,
            "correlation": false,
            "skew": false,
            "imbalance": false,
            "drift": false,
            "duplicate": false,
        }
    );

    const [waitFlag, setWaitFlag] = useState(true);

    useEffect(() => {
        // MCON
        GetConfigData({ userid, setFeatureConfig });
        // ACON
        GetAutoCorrectConfigs({ userid, setSelectedDataIssues, setWaitFlag})
        GetOutliers({ userid, setOutlierData, setDisplayIssue });
        GetImbalance({ userid, setImbalanceData, setDisplayIssue });
        GetDuplicates({ userid, setDuplicateData, setDisplayIssue });
        GetDrift({ userid, setDriftData, setDisplayIssue });
        GetCorrelation({ userid, setCorrelationData, setDisplayIssue });
        GetSkew({ userid, setSkewData, setDisplayIssue });
    }, []);

    return (
        <>
            <NavBar user={user} />
            <div className="config-container">
                <ul className="tab">
                    <li className={activeTab === "tab1" ? "active" : ""}
                        onClick={handleTab1View}
                    >
                        Manual Configuration
                    </li>
                    <li className={activeTab === "tab2" ? "active" : ""}
                        onClick={handleTab2View}
                    >
                        Automated Configuration
                    </li>
                </ul>
                <div className="config-display">
                    {activeTab === "tab1"
                        ?
                        <FeatureConfig
                            userid={userid}
                            cohort={cohort}
                            group={group}
                            language={language}
                            featureConfig={featureConfig}
                            setFeatureConfig={setFeatureConfig}
                        />
                        :
                        <DataIssueConfig
                            userid={userid} cohort={cohort} group={group} language={language}
                            outlierData={outlierData} setOutlierData={setOutlierData}
                            duplicateData={duplicateData} setDuplicateData={setDuplicateData}
                            imblanceData={imblanceData} setImbalanceData={setImbalanceData}
                            driftData={driftData} setDriftData={setDriftData}
                            skewData={skewData} setSkewData={setSkewData}
                            correlationData={correlationData} setCorrelationData={setCorrelationData}
                            displayIssue={displayIssue} setDisplayIssue={setDisplayIssue}
                            outlierMapData={outlierMapData} setOutlierMapData={setOutlierMapData}
                            selectedDataIssues={selectedDataIssues} setSelectedDataIssues={setSelectedDataIssues}
                            waitFlag={waitFlag} setWaitFlag={setWaitFlag}
                            setActiveTab={setActiveTab}
                        />
                    }
                </div>
            </div>
        </>);

};