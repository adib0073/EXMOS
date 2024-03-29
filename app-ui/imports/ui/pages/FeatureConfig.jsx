import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { SelectedIcon } from '../components/Icons/SelectedIcon.jsx';
import { UnselectedIcon } from '../components/Icons/UnselectedIcon.jsx';
import { BASE_API, DATA_SUMMARY_DEFAULT_MODEL, FRIENDLY_NAMES_ENG, FRIENDLY_NAMES_SLO } from '../Constants.jsx';
import { ConfigBar } from '../components/ConfigCharts/ConfigBar.jsx';
import { ConfigSlider } from '../components/ConfigCharts/ConfigSlider.jsx';
import 'antd/dist/antd.css';
import { Input, message, Spin, Tooltip } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { ConfigArea } from '../components/ConfigCharts/ConfigArea.jsx';
import axios from 'axios';
import { tooltipEnglishContent } from '../tooltipContent/tooltipEnglishContent.jsx';
import { tooltipSloveneContent } from '../tooltipContent/tooltipSloveneContent.jsx';
import { GetConfigData } from './Configuration.jsx';



const PostConfigData = ({ userid, group, featureConfig }) => {
    axios.post(BASE_API + '/configandretrain', {
        UserId: userid,
        Cohort: group,
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
            console.log('model training complete ...');
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

const RestoreConfigData = ({ userid, group, featureConfig, setFeatureConfig }) => {
    //console.log(group);
    axios.post(BASE_API + '/restoreandretrain', {
        UserId: userid,
        Cohort: group,
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
        }
        else {
            console.log("Error reported. Login failed.")
            // TO-DO: Navigate to Error Screen.
        }
    }).catch(function (error) {
        console.log(error);
    });
};

const PostInteractions = ({ userid, group, interactioData }) => {
    axios.post(BASE_API + '/trackinteractions', {
        UserId: userid,
        Cohort: group,
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

const handleResetButton = (userid, cohort, group, featureConfig, setFeatureConfig, setReloadFlag, navigate, language) => {
    if (window.confirm(
        language == "ENG"
            ? "Do you want to reset to default values?"
            : "Ali želite ponastaviti na privzete vrednosti?"
    )) {
        RestoreConfigData({ userid, group, featureConfig, setFeatureConfig });
        setReloadFlag(true);
        setTimeout(function () {
            message.success(
                language == "ENG"
                    ? "Default model is restored. Redirecting to dashboard ..."
                    : "Privzeti model je obnovljen. Preusmerjanje na dashboard ..."
                , 3);
            setReloadFlag(false);
            navigate('/dashboard/' + cohort);
        }, 3000);
    }
};

const handleCancelButton = (userid, setFeatureConfig, language) => {
    if (window.confirm(
        language == "ENG"
            ? "Do you want to revert all your changes?"
            : "Ali želite razveljaviti vse svoje spremembe?"
    )) {
        GetConfigData({ userid, setFeatureConfig });
        window.location.reload();
    }
};

const handleTrainButton = (userid, cohort, group, featureConfig, setReloadFlag, navigate, language) => {
    if (window.confirm(
        language == "ENG"
            ? 'Do you want to save and re-train the machine learning model?'
            : 'Ali želite shraniti in ponovno usposobiti model strojnega učenja?'
    )) {
        //window.location.reload();        
        PostConfigData({ userid, group, featureConfig });
        setReloadFlag(true);
        setTimeout(function () {
            message.success(
                language == "ENG"
                    ? "Model is successfully re-trained with latest changes."
                    : "Model je uspešno ponovno usposobljen z najnovejšimi spremembami."
                , 4);
            setReloadFlag(false);
            navigate('/dashboard/' + cohort);
        }, 4000);

    }
};


export const FeatureConfig = ({ userid, cohort, group, language, featureConfig, setFeatureConfig }) => {
    const [reloadFlag, setReloadFlag] = useState(false);
    const [warningFlag, setWarningFlag] = useState(false);

    const navigate = useNavigate();

    const handleTickClick = (feature) => {
        const updatedFeature = { ...featureConfig[feature], isSelected: !featureConfig[feature].isSelected }

        setFeatureConfig({
            ...featureConfig,
            [feature]: updatedFeature
        });

        //PostInteractions({ userid, group, interactioData });
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
        //PostInteractions({ userid, group, interactioData });
    };

    const inputOnChange = (e) => {
        console.log(e.target.value);
    };

    useEffect(() => {
        setReloadFlag(true);
        //GetConfigData({ userid, setFeatureConfig });
        setTimeout(function () {
            setReloadFlag(false);
        }, 1500);
    }, []);

    const loadingIndicator = (
        <>
            <Spin tip=
                {
                    (language == "ENG")
                        ? "Updating changes. Please wait ..."
                        : "Posodabljanje sprememb. Prosim počakaj ..."
                }
                size="large" />
        </>
    );

    // Language variable
    const lang = (language == "ENG") ? tooltipEnglishContent : tooltipSloveneContent;
    const FRIENDLY_NAMES = (language == "ENG") ? FRIENDLY_NAMES_ENG : FRIENDLY_NAMES_SLO;

    return (
        reloadFlag ? loadingIndicator :
            <>
                <div className='config-display-fc-r1'>
                    <div className='config-display-fc-r1-text'>
                        {
                            language == "ENG"
                                ? "The current model is trained on the selected predictor variables with selected data configurations:"
                                : "Trenutni model se usposobi na izbranih funkcijah z izbranimi konfiguracijami podatkov:"
                        }
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
                                            <b>{FRIENDLY_NAMES["target"]}</b>
                                        </Tooltip>
                                    </div>
                                    <div className='cd-chart-left-control'>
                                        <Input addonBefore={featureConfig["target"]["categories"][0]} key={featureConfig["target"]["categories"][0] + featureConfig["target"]["category_ratio"][0]} defaultValue={featureConfig["target"]["category_ratio"][0] + "%"} size="small" />
                                        <Input addonBefore={featureConfig["target"]["categories"][1]} key={featureConfig["target"]["categories"][1] + featureConfig["target"]["category_ratio"][1]} defaultValue={featureConfig["target"]["category_ratio"][1] + "%"} onChange={inputOnChange} />
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
                                                <b>{FRIENDLY_NAMES["Glucose"]}</b> {"(" + featureConfig["Glucose"].unit + ")"}
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
                                            cohort={group}
                                            setWarningFlag={setWarningFlag}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "Glucose") }} >
                                    <ConfigArea
                                        x_values={featureConfig["Glucose"].xdata}
                                        y_values={featureConfig["Glucose"].ydata}
                                        selectedLimit={[featureConfig["Glucose"].lowerLimit, featureConfig["Glucose"].upperLimit]}
                                        isActive={featureConfig["Glucose"].isSelected}
                                        q1={featureConfig["Glucose"].q1}
                                        q3={featureConfig["Glucose"].q3}
                                        name={
                                            language == "ENG"
                                                ? "Glucose"
                                                : "Glukoza"
                                        }
                                        lang={language}
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
                                                <b>{FRIENDLY_NAMES["BMI"]}</b> {"(" + featureConfig["BMI"].unit + ")"}
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
                                            cohort={group}
                                            setWarningFlag={setWarningFlag}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "BMI") }}>
                                    <ConfigArea
                                        x_values={featureConfig["BMI"].xdata}
                                        y_values={featureConfig["BMI"].ydata}
                                        selectedLimit={[featureConfig["BMI"].lowerLimit, featureConfig["BMI"].upperLimit]}
                                        isActive={featureConfig["BMI"].isSelected}
                                        q1={featureConfig["BMI"].q1}
                                        q3={featureConfig["BMI"].q3}
                                        name={
                                            language == "ENG"
                                                ? "BMI"
                                                : "BMI"
                                        }
                                        lang={language}
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
                                                <b>{FRIENDLY_NAMES["Insulin"]}</b> {"(" + featureConfig["Insulin"].unit + ")"}
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
                                            cohort={group}
                                            setWarningFlag={setWarningFlag}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "Insulin") }}>
                                    <ConfigArea
                                        x_values={featureConfig["Insulin"].xdata}
                                        y_values={featureConfig["Insulin"].ydata}
                                        selectedLimit={[featureConfig["Insulin"].lowerLimit, featureConfig["Insulin"].upperLimit]}
                                        isActive={featureConfig["Insulin"].isSelected}
                                        q1={featureConfig["Insulin"].q1}
                                        q3={featureConfig["Insulin"].q3}
                                        name={
                                            language == "ENG"
                                                ? "Insulin"
                                                : "Inzulin"
                                        }
                                        lang={language}
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
                                                <b>{FRIENDLY_NAMES["Age"]}</b>
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
                                            cohort={group}
                                            setWarningFlag={setWarningFlag}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "Age") }}>
                                    <ConfigArea
                                        x_values={featureConfig["Age"].xdata}
                                        y_values={featureConfig["Age"].ydata}
                                        selectedLimit={[featureConfig["Age"].lowerLimit, featureConfig["Age"].upperLimit]}
                                        isActive={featureConfig["Age"].isSelected}
                                        q1={featureConfig["Age"].q1}
                                        q3={featureConfig["Age"].q3}
                                        name={
                                            language == "ENG"
                                                ? "Age"
                                                : "Starost"
                                        }
                                        lang={language}
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
                                                <b>{FRIENDLY_NAMES["Pregnancies"]}</b>
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
                                            cohort={group}
                                            setWarningFlag={setWarningFlag}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "Pregnancies") }}>
                                    <ConfigArea
                                        x_values={featureConfig["Pregnancies"].xdata}
                                        y_values={featureConfig["Pregnancies"].ydata}
                                        selectedLimit={[featureConfig["Pregnancies"].lowerLimit, featureConfig["Pregnancies"].upperLimit]}
                                        isActive={featureConfig["Pregnancies"].isSelected}
                                        q1={featureConfig["Pregnancies"].q1}
                                        q3={featureConfig["Pregnancies"].q3}
                                        name={
                                            language == "ENG"
                                                ? "Pregnancies"
                                                : "Število nosečnosti"
                                        }
                                        lang={language}
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
                                                <b>{FRIENDLY_NAMES["BloodPressure"]}</b> {"(" + featureConfig["BloodPressure"].unit + ")"}
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
                                            cohort={group}
                                            setWarningFlag={setWarningFlag}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "BloodPressure") }}>
                                    <ConfigArea
                                        x_values={featureConfig["BloodPressure"].xdata}
                                        y_values={featureConfig["BloodPressure"].ydata}
                                        selectedLimit={[featureConfig["BloodPressure"].lowerLimit, featureConfig["BloodPressure"].upperLimit]}
                                        isActive={featureConfig["BloodPressure"].isSelected}
                                        q1={featureConfig["BloodPressure"].q1}
                                        q3={featureConfig["BloodPressure"].q3}
                                        name={
                                            language == "ENG"
                                                ? "Pressure"
                                                : "Krvni pritisk"
                                        }
                                        lang={language}
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
                                                <b>{FRIENDLY_NAMES["SkinThickness"]}</b> {"(" + featureConfig["SkinThickness"].unit + ")"}
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
                                            cohort={group}
                                            setWarningFlag={setWarningFlag}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "SkinThickness") }}>
                                    <ConfigArea
                                        x_values={featureConfig["SkinThickness"].xdata}
                                        y_values={featureConfig["SkinThickness"].ydata}
                                        selectedLimit={[featureConfig["SkinThickness"].lowerLimit, featureConfig["SkinThickness"].upperLimit]}
                                        isActive={featureConfig["SkinThickness"].isSelected}
                                        q1={featureConfig["SkinThickness"].q1}
                                        q3={featureConfig["SkinThickness"].q3}
                                        name={
                                            language == "ENG"
                                                ? "Skin Thickness"
                                                : "Debelina kože"
                                        }
                                        lang={language}
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
                                                <b>{FRIENDLY_NAMES["DiabetesPedigreeFunction"]}</b>
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
                                            cohort={group}
                                            setWarningFlag={setWarningFlag}
                                        />
                                    </div>
                                </div>
                                <div className='cd-chart-right' onMouseEnter={() => { handleMouseIn() }} onMouseLeave={() => { handleMouseOut("featureConfig", "DiabetesPedigreeFunction") }}>
                                    <ConfigArea
                                        x_values={featureConfig["DiabetesPedigreeFunction"].xdata}
                                        y_values={featureConfig["DiabetesPedigreeFunction"].ydata}
                                        selectedLimit={[featureConfig["DiabetesPedigreeFunction"].lowerLimit, featureConfig["DiabetesPedigreeFunction"].upperLimit]}
                                        isActive={featureConfig["DiabetesPedigreeFunction"].isSelected}
                                        q1={featureConfig["DiabetesPedigreeFunction"].q1}
                                        q3={featureConfig["DiabetesPedigreeFunction"].q3}
                                        name={
                                            language == "ENG"
                                                ? "Pedigree Function"
                                                : "Funkcija rodovnika"
                                        }
                                        lang={language}
                                        unit={""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='config-display-fc-r3'>
                    <div className='config-display-fc-r3-text'>

                        {
                            warningFlag
                                ? <span style={{ color: "#D64242", fontSize: "larger" }}>
                                    <b>
                                        !! Warning: the size of the training data has reduced significantly after this configuration!!
                                        This is harmful for the model. Please cancel or revert the current changes.
                                    </b>
                                </span>
                                :
                                "* You can select/deselect predictior variables or filter variable values to tune the trained model"
                        }

                    </div>


                    <div className='config-display-fc-r3-item'>
                        <button
                            className="reset-button"
                            type="submit"
                            onClick={() => { handleResetButton(userid, cohort, group, featureConfig, setFeatureConfig, setReloadFlag, navigate, language) }}
                        >
                            {
                                language == "ENG"
                                    ? "Reset to defaults"
                                    : "Ponastavi na privzeto"
                            }
                        </button>

                        <button
                            className="cancel-button"
                            type="submit"
                            onClick={() => { handleCancelButton(userid, setFeatureConfig, language) }}
                        >
                            {
                                language == "ENG"
                                    ? "Cancel changes"
                                    : "Prekliči spremembe"
                            }
                        </button>
                        <button
                            className="train-button"
                            type="submit"
                            onClick={() => { handleTrainButton(userid, cohort, group, featureConfig, setReloadFlag, navigate, language) }}
                        >
                            {"Save and Re-train"}
                        </button>
                    </div>
                </div>
            </>
    );
};