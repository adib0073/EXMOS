import React from 'react';
import { useEffect, useState } from 'react';
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { SelectedIcon } from '../components/Icons/SelectedIcon.jsx';
import { UnselectedIcon } from '../components/Icons/UnselectedIcon.jsx';
import { BASE_API, DATA_SUMMARY_DEFAULT_MODEL } from '../Constants.jsx';
import { ConfigBar } from '../components/ConfigCharts/ConfigBar.jsx';
import { ConfigSlider } from '../components/ConfigCharts/ConfigSlider.jsx';
import 'antd/dist/antd.css';
import { Input, message, Spin, Tooltip } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { ConfigArea } from '../components/ConfigCharts/ConfigArea.jsx';
import axios from 'axios';
import { tooltipEnglishContent } from '../tooltipContent/tooltipEnglishContent.jsx';
import { tooltipSloveneContent } from '../tooltipContent/tooltipSloveneContent.jsx';


const GetConfigData = ({ userid, setFeatureConfig }) => {
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
const PostConfigData = ({ userid, cohort, featureConfig }) => {
    axios.post(BASE_API + '/configandretrain', {
        UserId: userid,
        Cohort: cohort,
        JsonData: featureConfig
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            /*"Access-Control-Allow-Origin": "*",*/
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        //console.log(response.data["OutputJson"]);
        if (response.data["StatusCode"]) {
            /*
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
            });*/
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

const RestoreConfigData = ({ userid, cohort, featureConfig, setFeatureConfig }) => {
    axios.post(BASE_API + '/restoreandretrain', {
        UserId: userid,
        Cohort: cohort,
        JsonData: featureConfig
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        //console.log(response.data["OutputJson"]);
        if (response.data["StatusCode"]) {
            // Call Get Config Data
            GetConfigData({ userid, setFeatureConfig });
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

const PostInteractions = ({ userid, cohort, interactioData }) => {
    axios.post(BASE_API + '/trackinteractions', {
        UserId: userid,
        Cohort: cohort,
        JsonData: interactioData
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "X-Auth-Token, Origin, Authorization, X-Requested-With, Content-Type, Accept"
        }
    }).then(function (response) {
        //console.log(response.data["OutputJson"]);
        if (response.data["StatusCode"]) {
            // Fire and Forget
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

const handleResetButton = (userid, cohort, featureConfig, setFeatureConfig, setReloadFlag) => {
    if (window.confirm('Do you want to reset to default values?')) {
        setReloadFlag(true);
        RestoreConfigData({ userid, cohort, featureConfig, setFeatureConfig });
        setTimeout(function () {
            message.success("Default model is restored.", 5);
            setReloadFlag(false);
        }, 6000);
    }
};

const handleCancelButton = (userid, setFeatureConfig) => {
    if (window.confirm('Do you want to revert all your changes?')) {
        GetConfigData({ userid, setFeatureConfig });
        window.location.reload();
    }
};

const handleTrainButton = (userid, cohort, featureConfig, setReloadFlag) => {
    if (window.confirm('Do you want to save and re-train the machine learning model?')) {
        //window.location.reload();
        setReloadFlag(true);
        PostConfigData({ userid, cohort, featureConfig });
        setTimeout(function () {
            message.success("Model is successfully re-trained with latest changes.", 3);
            setReloadFlag(false);
        }, 3000);

    }
};


export const FeatureConfig = ({ userid, cohort }) => {
    const [featureConfig, setFeatureConfig] = useState(DATA_SUMMARY_DEFAULT_MODEL);
    const [reloadFlag, setReloadFlag] = useState(false);

    const handleTickClick = (feature) => {
        const updatedFeature = { ...featureConfig[feature], isSelected: !featureConfig[feature].isSelected }

        setFeatureConfig({
            ...featureConfig,
            [feature]: updatedFeature
        });

        let interactioData = {
            "viz": "featureSelection",
            "eventType": "click",
            "description": feature,
            "timestamp": Date().toString(),
            "duration": 0
        }

        PostInteractions({ userid, cohort, interactioData });
    };
    // Hover time for interaction data
    var startTime, endTime;
    const handleMouseIn = () => {
        startTime = new Date();
    };
    const handleMouseOut = (viz, feature) => {
        endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var duration = Math.round(timeDiff % 60);

        let interactioData = {
            "viz": viz,
            "eventType": "hover",
            "description": feature,
            "timestamp": Date().toString(),
            "duration": duration
        }

        PostInteractions({ userid, cohort, interactioData });
    };

    const sliderClick = (viz, feature) => {
        console.log("slider clicked");

    };

    const inputOnChange = (e) => {
        console.log(e.target.value);
    };

    useEffect(() => {
        setReloadFlag(true);
        GetConfigData({ userid, setFeatureConfig });
        setTimeout(function () {
            setReloadFlag(false);
        }, 3000);
    }, []);

    const loadingIndicator = (
        <>
            <Spin tip="Retrieving latest data ..." size="large" />
        </>
    );

    // Language variable
    // TO-DO: Take language preferred as input
    const lang = (1 == 1) ? tooltipEnglishContent : tooltipSloveneContent;

    return (
        reloadFlag ? loadingIndicator :
            <>
                <div className='config-display-fc-r1'>
                    <div className='config-display-fc-r1-text'>
                        {"The current model is trained on the selected features with selected data configurations:"}
                    </div>
                    <Tooltip
                        placement="top"
                        title={lang.featureConfig.title}                        
                        overlayStyle={{ maxWidth: '500px' }}
                    >
                        <div className='config-display-fc-r1-icon'>
                            <InfoLogo />
                        </div>
                    </Tooltip>
                </div>
                <div className='config-display-fc-r2'>
                    <div className='config-display-fc-r2c1'>
                        <div className='cd-chart-container'>
                            <div className='cd-chart-tick-box'>
                                <AimOutlined style={{ fontSize: '24px', color: '#999999' }} />
                            </div>
                            <div className='cd-chart-box'>
                                <div className='cd-chart-left'>
                                    <div className='cd-chart-left-text'>
                                        <Tooltip
                                            placement="right"
                                            title={lang.featureConfig.diabetesStatus}
                                            overlayStyle={{ maxWidth: '400px' }}
                                        >
                                            <b>{featureConfig["target"].name}</b>
                                        </Tooltip>
                                    </div>
                                    <div className='cd-chart-left-control'>
                                        <Input addonBefore={featureConfig["target"]["categories"][0]} key={featureConfig["target"]["categories"][0] + featureConfig["target"]["category_ratio"][0]} defaultValue={featureConfig["target"]["category_ratio"][0]} size="small" />
                                        <Input addonBefore={featureConfig["target"]["categories"][1]} key={featureConfig["target"]["categories"][1] + featureConfig["target"]["category_ratio"][1]} defaultValue={featureConfig["target"]["category_ratio"][1]} onChange={inputOnChange} />
                                    </div>
                                </div>
                                <div className='cd-chart-right'>
                                    <ConfigBar x_values={featureConfig["target"]["categories"]} y_values={featureConfig["target"]["category_ratio"]} />
                                </div>
                            </div>
                        </div>
                        <div className='cd-chart-container'>
                            <div className='cd-chart-tick-box' onClick={() => { handleTickClick("Glucose") }} >
                                {featureConfig["Glucose"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                            </div>
                            <div className='cd-chart-box'>
                                <div className='cd-chart-left'>
                                    <div className='cd-chart-left-text'>
                                        <span style={{ color: (featureConfig["Glucose"].isSelected) ? "#000000" : "#6C6C6C" }}>
                                            <Tooltip
                                                placement="rightTop"
                                                title={lang.featureConfig.glucose}
                                            >
                                                <b>{featureConfig["Glucose"].name}</b> {"(" + featureConfig["Glucose"].unit + ")"}
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className='cd-chart-left-control'>
                                        <ConfigSlider
                                            defaultLimit={[featureConfig["Glucose"].defaultLowerLimit, featureConfig["Glucose"].defaultUpperLimit]}
                                            selectedLimit={[featureConfig["Glucose"].lowerLimit, featureConfig["Glucose"].upperLimit]}
                                            featureConfig={featureConfig}
                                            setFeatureConfig={setFeatureConfig}
                                            featureName={"Glucose"}
                                            isActive={featureConfig["Glucose"].isSelected}
                                            userid={userid}
                                            cohort={cohort}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "Glucose") }} >
                                    <ConfigArea
                                        x_values={featureConfig["Glucose"].xdata}
                                        y_values={featureConfig["Glucose"].ydata}
                                        selectedLimit={[featureConfig["Glucose"].lowerLimit, featureConfig["Glucose"].upperLimit]}
                                        isActive={featureConfig["Glucose"].isSelected}
                                        name={"Glucose"}
                                        unit={featureConfig["Glucose"].unit}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='cd-chart-container'>
                            <div className='cd-chart-tick-box' onClick={() => { handleTickClick("BMI") }}>
                                {featureConfig["BMI"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                            </div>
                            <div className='cd-chart-box'>
                                <div className='cd-chart-left'>
                                    <div className='cd-chart-left-text'>
                                        <span style={{ color: (featureConfig["BMI"].isSelected) ? "#000000" : "#6C6C6C" }}>
                                            <Tooltip
                                                placement="rightTop"
                                                title={lang.featureConfig.bmi}
                                            >
                                                <b>{featureConfig["BMI"].name}</b> {"(" + featureConfig["BMI"].unit + ")"}
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className='cd-chart-left-control' >
                                        <ConfigSlider
                                            defaultLimit={[featureConfig["BMI"].defaultLowerLimit, featureConfig["BMI"].defaultUpperLimit]}
                                            selectedLimit={[featureConfig["BMI"].lowerLimit, featureConfig["BMI"].upperLimit]}
                                            featureConfig={featureConfig}
                                            setFeatureConfig={setFeatureConfig}
                                            featureName={"BMI"}
                                            isActive={featureConfig["BMI"].isSelected}
                                            userid={userid}
                                            cohort={cohort}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "BMI") }}>
                                    <ConfigArea
                                        x_values={featureConfig["BMI"].xdata}
                                        y_values={featureConfig["BMI"].ydata}
                                        selectedLimit={[featureConfig["BMI"].lowerLimit, featureConfig["BMI"].upperLimit]}
                                        isActive={featureConfig["BMI"].isSelected}
                                        name={"BMI"}
                                        unit={featureConfig["BMI"].unit}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='config-display-fc-r2c2'>
                        <div className='cd-chart-container'>
                            <div className='cd-chart-tick-box' onClick={() => { handleTickClick("Insulin") }}>
                                {featureConfig["Insulin"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                            </div>
                            <div className='cd-chart-box'>
                                <div className='cd-chart-left'>
                                    <div className='cd-chart-left-text'>
                                        <span style={{ color: (featureConfig["Insulin"].isSelected) ? "#000000" : "#6C6C6C" }}>
                                            <Tooltip
                                                placement="rightTop"
                                                title={lang.featureConfig.insulin}
                                            >
                                                <b>{featureConfig["Insulin"].name}</b> {"(" + featureConfig["Insulin"].unit + ")"}
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className='cd-chart-left-control'>
                                        <ConfigSlider
                                            defaultLimit={[featureConfig["Insulin"].defaultLowerLimit, featureConfig["Insulin"].defaultUpperLimit]}
                                            selectedLimit={[featureConfig["Insulin"].lowerLimit, featureConfig["Insulin"].upperLimit]}
                                            featureConfig={featureConfig}
                                            setFeatureConfig={setFeatureConfig}
                                            featureName={"Insulin"}
                                            isActive={featureConfig["Insulin"].isSelected}
                                            userid={userid}
                                            cohort={cohort}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "Insulin") }}>
                                    <ConfigArea
                                        x_values={featureConfig["Insulin"].xdata}
                                        y_values={featureConfig["Insulin"].ydata}
                                        selectedLimit={[featureConfig["Insulin"].lowerLimit, featureConfig["Insulin"].upperLimit]}
                                        isActive={featureConfig["Insulin"].isSelected}
                                        name={"Insulin"}
                                        unit={featureConfig["Insulin"].unit}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='cd-chart-container'>
                            <div className='cd-chart-tick-box' onClick={() => { handleTickClick("Age") }}>
                                {featureConfig["Age"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                            </div>
                            <div className='cd-chart-box'>
                                <div className='cd-chart-left'>
                                    <div className='cd-chart-left-text'>
                                        <span style={{ color: (featureConfig["Age"].isSelected) ? "#000000" : "#6C6C6C" }}>
                                            <Tooltip
                                                placement="rightTop"
                                                title={lang.featureConfig.age}
                                            >
                                                <b>{featureConfig["Age"].name}</b>
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className='cd-chart-left-control'>
                                        <ConfigSlider
                                            defaultLimit={[featureConfig["Age"].defaultLowerLimit, featureConfig["Age"].defaultUpperLimit]}
                                            selectedLimit={[featureConfig["Age"].lowerLimit, featureConfig["Age"].upperLimit]}
                                            featureConfig={featureConfig}
                                            setFeatureConfig={setFeatureConfig}
                                            featureName={"Age"}
                                            isActive={featureConfig["Age"].isSelected}
                                            userid={userid}
                                            cohort={cohort}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "Age") }}>
                                    <ConfigArea
                                        x_values={featureConfig["Age"].xdata}
                                        y_values={featureConfig["Age"].ydata}
                                        selectedLimit={[featureConfig["Age"].lowerLimit, featureConfig["Age"].upperLimit]}
                                        isActive={featureConfig["Age"].isSelected}
                                        name={"Age"}
                                        unit={featureConfig["Age"].unit}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='cd-chart-container'>
                            <div className='cd-chart-tick-box' onClick={() => { handleTickClick("Pregnancies") }}>
                                {featureConfig["Pregnancies"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                            </div>
                            <div className='cd-chart-box'>
                                <div className='cd-chart-left'>
                                    <div className='cd-chart-left-text'>
                                        <span style={{ color: (featureConfig["Pregnancies"].isSelected) ? "#000000" : "#6C6C6C" }}>
                                            <Tooltip
                                                placement="rightTop"
                                                title={lang.featureConfig.pregnancies}
                                            >
                                                <b>{featureConfig["Pregnancies"].name}</b>
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className='cd-chart-left-control'>
                                        <ConfigSlider
                                            defaultLimit={[featureConfig["Pregnancies"].defaultLowerLimit, featureConfig["Pregnancies"].defaultUpperLimit]}
                                            selectedLimit={[featureConfig["Pregnancies"].lowerLimit, featureConfig["Pregnancies"].upperLimit]}
                                            featureConfig={featureConfig}
                                            setFeatureConfig={setFeatureConfig}
                                            featureName={"Pregnancies"}
                                            isActive={featureConfig["Pregnancies"].isSelected}
                                            userid={userid}
                                            cohort={cohort}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "Pregnancies") }}>
                                    <ConfigArea
                                        x_values={featureConfig["Pregnancies"].xdata}
                                        y_values={featureConfig["Pregnancies"].ydata}
                                        selectedLimit={[featureConfig["Pregnancies"].lowerLimit, featureConfig["Pregnancies"].upperLimit]}
                                        isActive={featureConfig["Pregnancies"].isSelected}
                                        name={"Pregnancies"}
                                        unit={""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='config-display-fc-r2c3'>
                        <div className='cd-chart-container'>
                            <div className='cd-chart-tick-box' onClick={() => { handleTickClick("BloodPressure") }}>
                                {featureConfig["BloodPressure"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                            </div>
                            <div className='cd-chart-box'>
                                <div className='cd-chart-left'>
                                    <div className='cd-chart-left-text'>
                                        <span style={{ color: (featureConfig["BloodPressure"].isSelected) ? "#000000" : "#6C6C6C" }}>
                                            <Tooltip
                                                placement="rightTop"
                                                title={lang.featureConfig.pressure}
                                            >
                                                <b>{featureConfig["BloodPressure"].name}</b> {"(" + featureConfig["BloodPressure"].unit + ")"}
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className='cd-chart-left-control'>
                                        <ConfigSlider
                                            defaultLimit={[featureConfig["BloodPressure"].defaultLowerLimit, featureConfig["BloodPressure"].defaultUpperLimit]}
                                            selectedLimit={[featureConfig["BloodPressure"].lowerLimit, featureConfig["BloodPressure"].upperLimit]}
                                            featureConfig={featureConfig}
                                            setFeatureConfig={setFeatureConfig}
                                            featureName={"BloodPressure"}
                                            isActive={featureConfig["BloodPressure"].isSelected}
                                            userid={userid}
                                            cohort={cohort}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "BloodPressure") }}>
                                    <ConfigArea
                                        x_values={featureConfig["BloodPressure"].xdata}
                                        y_values={featureConfig["BloodPressure"].ydata}
                                        selectedLimit={[featureConfig["BloodPressure"].lowerLimit, featureConfig["BloodPressure"].upperLimit]}
                                        isActive={featureConfig["BloodPressure"].isSelected}
                                        name={"Pressure"}
                                        unit={featureConfig["BloodPressure"].unit}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='cd-chart-container'>
                            <div className='cd-chart-tick-box' onClick={() => { handleTickClick("SkinThickness") }}>
                                {featureConfig["SkinThickness"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                            </div>
                            <div className='cd-chart-box'>
                                <div className='cd-chart-left'>
                                    <div className='cd-chart-left-text'>
                                        <span style={{ color: (featureConfig["SkinThickness"].isSelected) ? "#000000" : "#6C6C6C" }}>
                                            <Tooltip
                                                placement="rightTop"
                                                title={lang.featureConfig.skinfold}
                                            >
                                                <b>{featureConfig["SkinThickness"].name}</b> {"(" + featureConfig["SkinThickness"].unit + ")"}
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className='cd-chart-left-control'>
                                        <ConfigSlider
                                            defaultLimit={[featureConfig["SkinThickness"].defaultLowerLimit, featureConfig["SkinThickness"].defaultUpperLimit]}
                                            selectedLimit={[featureConfig["SkinThickness"].lowerLimit, featureConfig["SkinThickness"].upperLimit]}
                                            featureConfig={featureConfig}
                                            setFeatureConfig={setFeatureConfig}
                                            featureName={"SkinThickness"}
                                            isActive={featureConfig["SkinThickness"].isSelected}
                                            userid={userid}
                                            cohort={cohort}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "SkinThickness") }}>
                                    <ConfigArea
                                        x_values={featureConfig["SkinThickness"].xdata}
                                        y_values={featureConfig["SkinThickness"].ydata}
                                        selectedLimit={[featureConfig["SkinThickness"].lowerLimit, featureConfig["SkinThickness"].upperLimit]}
                                        isActive={featureConfig["SkinThickness"].isSelected}
                                        name={"Skin Thickness"}
                                        unit={featureConfig["SkinThickness"].unit}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='cd-chart-container'>
                            <div className='cd-chart-tick-box' onClick={() => { handleTickClick("DiabetesPedigreeFunction") }}>
                                {featureConfig["DiabetesPedigreeFunction"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                            </div>
                            <div className='cd-chart-box'>
                                <div className='cd-chart-left'>
                                    <div className='cd-chart-left-text'>
                                        <span style={{ color: (featureConfig["DiabetesPedigreeFunction"].isSelected) ? "#000000" : "#6C6C6C" }}>
                                            <Tooltip
                                                placement="rightTop"
                                                title={lang.featureConfig.dpf}
                                            >
                                                <b>{featureConfig["DiabetesPedigreeFunction"].name}</b>
                                            </Tooltip>
                                        </span>
                                    </div>
                                    <div className='cd-chart-left-control'>
                                        <ConfigSlider
                                            defaultLimit={[featureConfig["DiabetesPedigreeFunction"].defaultLowerLimit, featureConfig["DiabetesPedigreeFunction"].defaultUpperLimit]}
                                            selectedLimit={[featureConfig["DiabetesPedigreeFunction"].lowerLimit, featureConfig["DiabetesPedigreeFunction"].upperLimit]}
                                            featureConfig={featureConfig}
                                            setFeatureConfig={setFeatureConfig}
                                            featureName={"DiabetesPedigreeFunction"}
                                            isActive={featureConfig["DiabetesPedigreeFunction"].isSelected}
                                            userid={userid}
                                            cohort={cohort}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "DiabetesPedigreeFunction") }}>
                                    <ConfigArea
                                        x_values={featureConfig["DiabetesPedigreeFunction"].xdata}
                                        y_values={featureConfig["DiabetesPedigreeFunction"].ydata}
                                        selectedLimit={[featureConfig["DiabetesPedigreeFunction"].lowerLimit, featureConfig["DiabetesPedigreeFunction"].upperLimit]}
                                        isActive={featureConfig["DiabetesPedigreeFunction"].isSelected}
                                        name={"Pedigree Function"}
                                        unit={""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='config-display-fc-r3'>
                    <div className='config-display-fc-r3-text'>
                        * You can select/deselect features or filter feature values to tune the trained model
                    </div>
                    <div className='config-display-fc-r3-item'>
                        <button
                            className="reset-button"
                            type="submit"
                            onClick={() => { handleResetButton(userid, cohort, featureConfig, setFeatureConfig, setReloadFlag) }}
                        >
                            {"Reset to defaults"}
                        </button>

                        <button
                            className="cancel-button"
                            type="submit"
                            onClick={() => { handleCancelButton(userid, setFeatureConfig) }}
                        >
                            {"Cancel changes"}
                        </button>
                        <button
                            className="train-button"
                            type="submit"
                            onClick={() => { handleTrainButton(userid, cohort, featureConfig, setReloadFlag) }}
                        >
                            {"Save and Re-train"}
                        </button>
                    </div>
                </div>
            </>
    );
};