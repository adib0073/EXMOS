import React from 'react';
import 'antd/dist/antd.css';
import { Input, Slider } from 'antd';

const handleSliderChange = (value) => {
    console.log(value);
};

export const ConfigSlider = ({ defaultLimit, selectedLimit }) => {
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
        defaultValue={selectedLimit}
        min={defaultLimit[0]}
        max={defaultLimit[1]}
        onChange={handleSliderChange}
        //dotStyle={{ borderColor: "#67A3FF" }}
        trackStyle={{ background: "#67A3FF" }}
        handleStyle={{ borderColor: "#67A3FF" }}
        railStyle={{ background: "#E5E5E5" }}
    />);

};