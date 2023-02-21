import React from 'react';
import { useEffect, useState } from 'react';
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { SelectedIcon } from '../components/Icons/SelectedIcon.jsx';
import { UnselectedIcon } from '../components/Icons/UnselectedIcon.jsx';
import { FEATURE_CONFIG_DATA } from '../Constants.jsx';
import { ConfigBar } from '../components/ConfigCharts/ConfigBar.jsx';
import { ConfigSlider } from '../components/ConfigCharts/ConfigSlider.jsx';
import 'antd/dist/antd.css';
import { Input, Slider } from 'antd';
import { ConfigArea } from '../components/ConfigCharts/ConfigArea.jsx';

const GetConfigData = ({ userid, setFeatureConfig }) => {
};

const handleCancelButton = ({ userid, setFeatureConfig }) => {
};

const handleTrainButton = ({ userid, setFeatureConfig }) => {
};

const handleTickClick = () => {
    console.log("Clicked");
    setFeatureConfig(prevConfig => ({
        ...prevConfig,
        [featureName]: prevValue => ({
            ...prevValue,
            "isSelected": !isSelected
        })
    }));
};

export const FeatureConfig = ({ userid }) => {
    const [featureConfig, setFeatureConfig] = useState(FEATURE_CONFIG_DATA);

    const handleTickClick = (feature) => {
        console.log(featureConfig[feature]);
        const updatedFeature = {...featureConfig[feature], isSelected: !featureConfig[feature].isSelected}
        console.log(featureConfig[feature]);

        setFeatureConfig({
            ...featureConfig,
            [feature]: updatedFeature});
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
                                    <Input addonBefore={"Diabetic"} defaultValue={34} size="small" />
                                    <Input addonBefore={"Non-Diabetic"} defaultValue={66} />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigBar x_values={["Diabetic", "Non-diabetic"]} y_values={[230, 410]} />
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
                                    <ConfigSlider defaultLimit={[0, 120]} selectedLimit={[20, 100]} />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={[70, 75, 80, 83, 85, 90, 92, 95, 98, 100, 105, 110, 112, 120, 125]}
                                    y_values={[20, 40, 80, 150, 80, 25, 30, 10, 32, 20, 30, 30, 40, 15, 25]}
                                    selectedLimit={[80, 98]}
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
                                    <ConfigSlider defaultLimit={[10, 70]} selectedLimit={[18, 35]} />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={[70, 75, 80, 83, 85, 90, 92, 95, 98, 100, 105, 110, 112, 120, 125]}
                                    y_values={[20, 40, 80, 150, 80, 25, 30, 10, 32, 20, 30, 30, 40, 15, 25]}
                                    selectedLimit={[80, 98]}
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
                                    <ConfigSlider defaultLimit={[10, 220]} selectedLimit={[50, 200]} />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={[70, 75, 80, 83, 85, 90, 92, 95, 98, 100, 105, 110, 112, 120, 125]}
                                    y_values={[20, 40, 80, 150, 80, 25, 30, 10, 32, 20, 30, 30, 40, 15, 25]}
                                    selectedLimit={[80, 98]}
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
                                    <ConfigSlider defaultLimit={[10, 220]} selectedLimit={[50, 200]} />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={[70, 75, 80, 83, 85, 90, 92, 95, 98, 100, 105, 110, 112, 120, 125]}
                                    y_values={[20, 40, 80, 150, 80, 25, 30, 10, 32, 20, 30, 30, 40, 15, 25]}
                                    selectedLimit={[80, 98]}
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
                                    <ConfigSlider defaultLimit={[10, 220]} selectedLimit={[50, 200]} />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={[70, 75, 80, 83, 85, 90, 92, 95, 98, 100, 105, 110, 112, 120, 125]}
                                    y_values={[20, 40, 80, 150, 80, 25, 30, 10, 32, 20, 30, 30, 40, 15, 25]}
                                    selectedLimit={[80, 98]}
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
                                    <ConfigSlider defaultLimit={[10, 220]} selectedLimit={[50, 200]} />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={[70, 75, 80, 83, 85, 90, 92, 95, 98, 100, 105, 110, 112, 120, 125]}
                                    y_values={[20, 40, 80, 150, 80, 25, 30, 10, 32, 20, 30, 30, 40, 15, 25]}
                                    selectedLimit={[80, 98]}
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
                                    <ConfigSlider defaultLimit={[10, 220]} selectedLimit={[50, 200]} />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={[70, 75, 80, 83, 85, 90, 92, 95, 98, 100, 105, 110, 112, 120, 125]}
                                    y_values={[20, 40, 80, 150, 80, 25, 30, 10, 32, 20, 30, 30, 40, 15, 25]}
                                    selectedLimit={[80, 98]}
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
                                    <ConfigSlider defaultLimit={[10, 220]} selectedLimit={[50, 200]} />
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                <ConfigArea
                                    x_values={[70, 75, 80, 83, 85, 90, 92, 95, 98, 100, 105, 110, 112, 120, 125]}
                                    y_values={[20, 40, 80, 150, 80, 25, 30, 10, 32, 20, 30, 30, 40, 15, 25]}
                                    selectedLimit={[80, 98]}
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
                        onClick={handleCancelButton}
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