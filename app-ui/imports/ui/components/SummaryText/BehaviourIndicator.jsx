import React from 'react';
import 'antd/dist/antd.css';
import { Tooltip } from 'antd';
import './SummaryText.css';

export const BehaviourIndicator = ({ measure, statusType }) => {
    let color = 'black';
    let message = measure;
    if (statusType == "Good"){
        color = "#449231";
        message = "Keep the current status to reduce risk";
    }
    else if(statusType == "Medium"){
        color = "#EA965A";
        message = "This can increase risk";
    }
    else{
        color = "#D64242";
        message = "This can significantly increase risk";
    }
    return (
        <div className="key-value-text-box" style={{ color: color }}>
            <Tooltip title={message}>{measure}</Tooltip>
        </div>);
};