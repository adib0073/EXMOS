import React from 'react';
import { useEffect, useState } from 'react';
import { InfoLogo } from '../components/Icons/InfoLogo.jsx';
import { SelectedIcon } from '../components/Icons/SelectedIcon.jsx';
import { UnselectedIcon } from '../components/Icons/UnselectedIcon.jsx';
import { FEATURE_CONFIG_DATA } from '../Constants.jsx';

const GetConfigData = ({ userid, setFeatureConfig }) => {
};

export const FeatureConfig = ({ userid }) => {
    const [featureConfig, setFeatureConfig] = useState(FEATURE_CONFIG_DATA);

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
                                    {featureConfig["target"].name}
                                </div>
                                <div className='cd-chart-left-control'>
                                    Control
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                Chart 1
                            </div>
                        </div>
                    </div>
                    <div className='cd-chart-container'>
                        <div className='cd-chart-tick-box'>
                            {featureConfig["Glucose"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                        </div>
                        <div className='cd-chart-box'>
                            <div className='cd-chart-left'>
                                <div className='cd-chart-left-text'>
                                    {featureConfig["Glucose"].name}
                                </div>
                                <div className='cd-chart-left-control'>
                                    Control
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                Chart 2
                            </div>
                        </div>
                    </div>
                    <div className='cd-chart-container'>
                        <div className='cd-chart-tick-box'>
                            {featureConfig["BMI"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                        </div>
                        <div className='cd-chart-box'>
                            <div className='cd-chart-left'>
                                <div className='cd-chart-left-text'>
                                    {featureConfig["BMI"].name}
                                </div>
                                <div className='cd-chart-left-control'>
                                    Control
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                Chart 3
                            </div>
                        </div>
                    </div>
                </div>
                <div className='config-display-fc-r2c2'>
                    <div className='cd-chart-container'>
                        <div className='cd-chart-tick-box'>
                            {featureConfig["Insulin"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                        </div>
                        <div className='cd-chart-box'>
                            <div className='cd-chart-left'>
                                <div className='cd-chart-left-text'>
                                    {featureConfig["Insulin"].name}
                                </div>
                                <div className='cd-chart-left-control'>
                                    Control
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                Chart 4
                            </div>
                        </div>
                    </div>
                    <div className='cd-chart-container'>
                        <div className='cd-chart-tick-box'>
                            {featureConfig["Age"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                        </div>
                        <div className='cd-chart-box'>
                            <div className='cd-chart-left'>
                                <div className='cd-chart-left-text'>
                                    {featureConfig["Age"].name}
                                </div>
                                <div className='cd-chart-left-control'>
                                    Control
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                Chart 5
                            </div>
                        </div>
                    </div>
                    <div className='cd-chart-container'>
                        <div className='cd-chart-tick-box'>
                            {featureConfig["Pregnancies"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                        </div>
                        <div className='cd-chart-box'>
                            <div className='cd-chart-left'>
                                <div className='cd-chart-left-text'>
                                    {featureConfig["Pregnancies"].name}
                                </div>
                                <div className='cd-chart-left-control'>
                                    Control
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                Chart 6
                            </div>
                        </div>
                    </div>
                </div>
                <div className='config-display-fc-r2c3'>
                    <div className='cd-chart-container'>
                        <div className='cd-chart-tick-box'>
                            {featureConfig["BloodPressure"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                        </div>
                        <div className='cd-chart-box'>
                            <div className='cd-chart-left'>
                                <div className='cd-chart-left-text'>
                                    {featureConfig["BloodPressure"].name}
                                </div>
                                <div className='cd-chart-left-control'>
                                    Control
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                Chart 7
                            </div>
                        </div>
                    </div>
                    <div className='cd-chart-container'>
                        <div className='cd-chart-tick-box'>
                            {featureConfig["SkinThickness"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                        </div>
                        <div className='cd-chart-box'>
                            <div className='cd-chart-left'>
                                <div className='cd-chart-left-text'>
                                    {featureConfig["SkinThickness"].name}
                                </div>
                                <div className='cd-chart-left-control'>
                                    Control
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                Chart 8
                            </div>
                        </div>
                    </div>
                    <div className='cd-chart-container'>
                        <div className='cd-chart-tick-box'>
                            {featureConfig["DiabetesPedigreeFunction"].isSelected ? <SelectedIcon /> : <UnselectedIcon />}
                        </div>
                        <div className='cd-chart-box'>
                            <div className='cd-chart-left'>
                                <div className='cd-chart-left-text'>
                                    {featureConfig["DiabetesPedigreeFunction"].name}
                                </div>
                                <div className='cd-chart-left-control'>
                                    Control
                                </div>
                            </div>
                            <div className='cd-chart-right'>
                                Chart 9
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
                    Button1
                    Button2
                </div>
            </div>
        </>

    );
};