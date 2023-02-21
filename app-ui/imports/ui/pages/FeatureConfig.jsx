import React from 'react';
import { useEffect, useState } from 'react';
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { SelectedIcon } from '../components/Icons/SelectedIcon.jsx';
import { UnselectedIcon } from '../components/Icons/UnselectedIcon.jsx';
import { BASE_API, DATA_SUMMARY_DEFAULT_MODEL } from '../Constants.jsx';
import { ConfigBar } from '../components/ConfigCharts/ConfigBar.jsx';
import { ConfigSlider } from '../components/ConfigCharts/ConfigSlider.jsx';
import 'antd/dist/antd.css';
import { Input, Slider } from 'antd';
import { ConfigArea } from '../components/ConfigCharts/ConfigArea.jsx';
import axios from 'axios';


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

const handleCancelButton = (userid, setFeatureConfig) => {
    console.log('Canceled');
    if (window.confirm('Do you want to revert all your changes?')) {
        GetConfigData({ userid, setFeatureConfig });
        window.location.reload();
    }
};

const handleTrainButton = ({ userid, setFeatureConfig }) => {
};


export const FeatureConfig = ({ userid }) => {
    const [featureConfig, setFeatureConfig] = useState(DATA_SUMMARY_DEFAULT_MODEL);

    const handleTickClick = (feature) => {
        const updatedFeature = { ...featureConfig[feature], isSelected: !featureConfig[feature].isSelected }

        setFeatureConfig({
            ...featureConfig,
            [feature]: updatedFeature
        });
    };

    const inputOnChange = (e) => {
        console.log(e.target.value);
    };

    useEffect(() => {
        GetConfigData({ userid, setFeatureConfig });
    }, []);

    return (
        <>
            <div className='config-display-fc-r1'>
                <div className='config-display-fc-r1-text'>
                    The current model is trained on the selected features with selected data configurations:
                </div>
                <div className='config-display-fc-r1-icon'>
                    <InfoLogo setButtonPopup={false} setChartIndex={0} index={3} />
                </div>
            </div>
            <div className='config-display-fc-r2'>
                <div className='config-display-fc-r2c1'>
                    <div className='cd-chart-container'>
                        <div className='cd-chart-tick-box'>
                            <SelectedIcon />
                        </div>
                        <div className='cd-chart-box'>
                            <div className='cd-chart-left'>
                                <div className='cd-chart-left-text'>
                                    <b>{featureConfig["target"].name}</b>
                                </div>
                                <div className='cd-chart-left-control'>
                                    <Input addonBefore={featureConfig["target"]["categories"][0]} defaultValue={featureConfig["target"]["category_ratio"][0]} size="small" />
                                    <Input addonBefore={featureConfig["target"]["categories"][1]} defaultValue={featureConfig["target"]["category_ratio"][1]} onChange={inputOnChange} />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigBar x_values={featureConfig["target"]["categories"]} y_values={featureConfig["target"]["category_ratio"]} />
                            </div>
                        </div>
                    </div>
                    <div className='cd-chart-container'>
                        <div className='cd-chart-tick-box' onClick={() => { handleTickClick("Glucose") }}>
                            {featureConfig["Glucose"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                        </div>
                        <div className='cd-chart-box'>
                            <div className='cd-chart-left'>
                                <div className='cd-chart-left-text'>
                                    <b>{featureConfig["Glucose"].name}</b>
                                </div>
                                <div className='cd-chart-left-control'>
                                    <ConfigSlider
                                        defaultLimit={[featureConfig["Glucose"].defaultLowerLimit, featureConfig["Glucose"].defaultUpperLimit]}
                                        selectedLimit={[featureConfig["Glucose"].lowerLimit, featureConfig["Glucose"].upperLimit]}
                                        featureConfig={featureConfig}
                                        setFeatureConfig={setFeatureConfig}
                                        featureName={"Glucose"}
                                    />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={featureConfig["Glucose"].xdata}
                                    y_values={featureConfig["Glucose"].ydata}
                                    selectedLimit={[featureConfig["Glucose"].lowerLimit, featureConfig["Glucose"].upperLimit]}
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
                                    <b>{featureConfig["BMI"].name}</b>
                                </div>
                                <div className='cd-chart-left-control' >
                                    <ConfigSlider
                                        defaultLimit={[featureConfig["BMI"].defaultLowerLimit, featureConfig["BMI"].defaultUpperLimit]}
                                        selectedLimit={[featureConfig["BMI"].lowerLimit, featureConfig["BMI"].upperLimit]}
                                        featureConfig={featureConfig}
                                        setFeatureConfig={setFeatureConfig}
                                        featureName={"BMI"}
                                    />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={featureConfig["BMI"].xdata}
                                    y_values={featureConfig["BMI"].ydata}
                                    selectedLimit={[featureConfig["BMI"].lowerLimit, featureConfig["BMI"].upperLimit]}
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
                                    <b>{featureConfig["Insulin"].name}</b>
                                </div>
                                <div className='cd-chart-left-control'>
                                    <ConfigSlider
                                        defaultLimit={[featureConfig["Insulin"].defaultLowerLimit, featureConfig["Insulin"].defaultUpperLimit]}
                                        selectedLimit={[featureConfig["Insulin"].lowerLimit, featureConfig["Insulin"].upperLimit]}
                                        featureConfig={featureConfig}
                                        setFeatureConfig={setFeatureConfig}
                                        featureName={"Insulin"}
                                    />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={featureConfig["Insulin"].xdata}
                                    y_values={featureConfig["Insulin"].ydata}
                                    selectedLimit={[featureConfig["Insulin"].lowerLimit, featureConfig["Insulin"].upperLimit]}
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
                                    <b>{featureConfig["Age"].name}</b>
                                </div>
                                <div className='cd-chart-left-control'>
                                    <ConfigSlider
                                        defaultLimit={[featureConfig["Age"].defaultLowerLimit, featureConfig["Age"].defaultUpperLimit]}
                                        selectedLimit={[featureConfig["Age"].lowerLimit, featureConfig["Age"].upperLimit]}
                                        featureConfig={featureConfig}
                                        setFeatureConfig={setFeatureConfig}
                                        featureName={"Age"}
                                    />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={featureConfig["Age"].xdata}
                                    y_values={featureConfig["Age"].ydata}
                                    selectedLimit={[featureConfig["Age"].lowerLimit, featureConfig["Age"].upperLimit]}
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
                                    <b>{featureConfig["Pregnancies"].name}</b>
                                </div>
                                <div className='cd-chart-left-control'>
                                    <ConfigSlider
                                        defaultLimit={[featureConfig["Pregnancies"].defaultLowerLimit, featureConfig["Pregnancies"].defaultUpperLimit]}
                                        selectedLimit={[featureConfig["Pregnancies"].lowerLimit, featureConfig["Pregnancies"].upperLimit]}
                                        featureConfig={featureConfig}
                                        setFeatureConfig={setFeatureConfig}
                                        featureName={"Pregnancies"}
                                    />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={featureConfig["Pregnancies"].xdata}
                                    y_values={featureConfig["Pregnancies"].ydata}
                                    selectedLimit={[featureConfig["Pregnancies"].lowerLimit, featureConfig["Pregnancies"].upperLimit]}
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
                                    <b>{featureConfig["BloodPressure"].name}</b>
                                </div>
                                <div className='cd-chart-left-control'>
                                    <ConfigSlider
                                        defaultLimit={[featureConfig["BloodPressure"].defaultLowerLimit, featureConfig["BloodPressure"].defaultUpperLimit]}
                                        selectedLimit={[featureConfig["BloodPressure"].lowerLimit, featureConfig["BloodPressure"].upperLimit]}
                                        featureConfig={featureConfig}
                                        setFeatureConfig={setFeatureConfig}
                                        featureName={"BloodPressure"}
                                    />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={featureConfig["BloodPressure"].xdata}
                                    y_values={featureConfig["BloodPressure"].ydata}
                                    selectedLimit={[featureConfig["BloodPressure"].lowerLimit, featureConfig["BloodPressure"].upperLimit]}
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
                                    <b>{featureConfig["SkinThickness"].name}</b>
                                </div>
                                <div className='cd-chart-left-control'>
                                    <ConfigSlider
                                        defaultLimit={[featureConfig["SkinThickness"].defaultLowerLimit, featureConfig["SkinThickness"].defaultUpperLimit]}
                                        selectedLimit={[featureConfig["SkinThickness"].lowerLimit, featureConfig["SkinThickness"].upperLimit]}
                                        featureConfig={featureConfig}
                                        setFeatureConfig={setFeatureConfig}
                                        featureName={"SkinThickness"}
                                    />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={featureConfig["SkinThickness"].xdata}
                                    y_values={featureConfig["SkinThickness"].ydata}
                                    selectedLimit={[featureConfig["SkinThickness"].lowerLimit, featureConfig["SkinThickness"].upperLimit]}
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
                                    <b>{featureConfig["DiabetesPedigreeFunction"].name}</b>
                                </div>
                                <div className='cd-chart-left-control'>
                                    <ConfigSlider
                                        defaultLimit={[featureConfig["DiabetesPedigreeFunction"].defaultLowerLimit, featureConfig["DiabetesPedigreeFunction"].defaultUpperLimit]}
                                        selectedLimit={[featureConfig["DiabetesPedigreeFunction"].lowerLimit, featureConfig["DiabetesPedigreeFunction"].upperLimit]}
                                        featureConfig={featureConfig}
                                        setFeatureConfig={setFeatureConfig}
                                        featureName={"DiabetesPedigreeFunction"}
                                    />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={featureConfig["DiabetesPedigreeFunction"].xdata}
                                    y_values={featureConfig["DiabetesPedigreeFunction"].ydata}
                                    selectedLimit={[featureConfig["DiabetesPedigreeFunction"].lowerLimit, featureConfig["DiabetesPedigreeFunction"].upperLimit]}
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
                        className="cancel-button"
                        type="submit"
                        onClick={() => {handleCancelButton(userid, setFeatureConfig)}}
                    >
                        Cancel changes
                    </button>
                    <button
                        className="train-button"
                        type="submit"
                        onClick={handleTrainButton}
                    >
                        Save and Re-train
                    </button>
                </div>
            </div>
        </>

    );
};