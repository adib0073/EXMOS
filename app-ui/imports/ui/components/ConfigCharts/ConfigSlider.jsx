import React from 'react';
import 'antd/dist/antd.css';
import { Input, Slider } from 'antd';
import axios from 'axios';
import { BASE_API } from '../../Constants';


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

const handleSliderChange = (value,
    featureName,
    featureConfig,
    setFeatureConfig,
    userid,
    cohort,
    setWarningFlag
) => {

    const updatedFeature = { ...featureConfig[featureName], lowerLimit: value[0], upperLimit: value[1] }

    const LLI = updatedFeature["xdata"].findIndex((element) => element >= value[0]);
    const ULI = updatedFeature["xdata"].findIndex((element) => element >= value[1]);

    const slicedYdata = updatedFeature["ydata"].slice(LLI, ULI);

    let sumYdata = 0;
    slicedYdata.forEach(x => {
        sumYdata += x;
    });

    if (sumYdata < 350) {
        setWarningFlag(true);
    }
    else {
        setWarningFlag(false);
    }


    setFeatureConfig({
        ...featureConfig,
        [featureName]: updatedFeature
    });

    let interactioData = {
        "viz": "featureSliderClick",
        "eventType": "click",
        "description": featureName,
        "timestamp": Date().toString(),
        "duration": 0
    }

    PostInteractions({ userid, cohort, interactioData });
};

export const ConfigSlider = ({ defaultLimit,
    selectedLimit,
    featureConfig,
    setFeatureConfig,
    featureName,
    isActive,
    userid,
    cohort,
    setWarningFlag
}) => {
    const chartColor = isActive ? "#be95ff" : "#6C6C6C";

    return (<Slider
        range
        autoFocus={false}
        step={0.1}
        marks={{
            [defaultLimit[0]]: {
                style: {
                    color: '#6C6C6C',
                    marginTop: "-30px",
                    fontSize: "11px"
                },
                label: defaultLimit[0],
            },
            [selectedLimit[0]]: selectedLimit[0],
            [selectedLimit[1]]: selectedLimit[1],
            [defaultLimit[1]]: {
                style: {
                    color: '#6C6C6C',
                    marginTop: "-30px",
                    fontSize: "11px"
                },
                label: defaultLimit[1],
            },
        }}
        key={featureName + selectedLimit[0] + selectedLimit[1]}
        defaultValue={selectedLimit}
        min={defaultLimit[0]}
        max={defaultLimit[1]}
        onChange={(value) => {
            handleSliderChange(
                value,
                featureName,
                featureConfig,
                setFeatureConfig,
                userid,
                cohort,
                setWarningFlag
            )
        }}
        //dotStyle={{ borderColor: "#be95ff" }}
        trackStyle={{ background: chartColor }}
        handleStyle={{ borderColor: chartColor }}
        railStyle={{ background: "#E5E5E5" }}
        disabled={!isActive}
    />);

};