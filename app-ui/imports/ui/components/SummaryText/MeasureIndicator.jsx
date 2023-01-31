import React from 'react';
import 'antd/dist/antd.css';
import { Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CheckOutlined } from '@ant-design/icons';
import './SummaryText.css';

export const MeasureIndicator = ({ measure }) => {

    if (measure["value"] <= measure["upperBoundary"] && measure["value"] >= measure["lowerBoundary"]) {
        return (
            <div className="key-value-text-box">
                <Tooltip title={measure["value"]}>{measure["value"]} </Tooltip>
                <Tooltip title={'Try to keep this value within ' +
                    measure["lowerBoundary"] + ' and ' + measure["upperBoundary"] + ' for a lower risk'}>
                    <CheckOutlined style={{ fontWeight: 'bold', fontSize: 12, color: '#449231' }} />
                </Tooltip>
            </div>)
    }
    else if (measure["value"] > measure["upperBoundary"]) {
        return (
            <div className="key-value-text-box">
                <Tooltip title={measure["value"]}>{measure["value"]} </Tooltip>
                <Tooltip title={(((measure["value"] - measure["upperBoundary"]) / measure["upperBoundary"]) * 100).toFixed(1) + '% higher than normal range'}>
                    <ArrowUpOutlined style={{ fontWeight: 'bold', fontSize: 12, color: '#D64242' }} />
                </Tooltip>
            </div>)
    }
    else if (measure["value"] < measure["lowerBoundary"]) {
        return (
            <div className="key-value-text-box">
                <Tooltip title={measure["value"]}>{measure["value"]} </Tooltip>
                <Tooltip title={((Math.abs(measure["value"] - measure["lowerBoundary"]) / measure["lowerBoundary"]) * 100).toFixed(1) + '% lower than normal range'}>
                    <ArrowDownOutlined style={{ fontWeight: 'bold', fontSize: 12, color: '#D64242' }} />
                </Tooltip>
            </div>)
    }
};