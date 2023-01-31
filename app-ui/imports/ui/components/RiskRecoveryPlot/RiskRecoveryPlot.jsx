import React from 'react';
import { RiskLineChart } from './RiskLineChart';
import { InfoLogo } from '../Icons/InfoLogo';
import 'antd/dist/antd.css';
import { Tooltip } from 'antd';

export const RiskRecoveryPlot = (
  {
    recovery,
    setPopupTrigger,
    setChartIndex
  }) => {
  return (<div className="container-box-2-1-2">
    <div className="chart-title-box">
      <div className="chart-title">
        <Tooltip
          placement="rightTop"
          overlayStyle={{ maxWidth: '500px' }}
          title="Monitor whether the estimated risk of diabetes for the patients (shown on y-axis) is improving or not over the past months using this visual."
        >
          Risk Recovery
        </Tooltip>
      </div>
      <div className="chart-icons">
        <InfoLogo setButtonPopup={setPopupTrigger} setChartIndex={setChartIndex} index={3} />
      </div>
    </div>
    <div className="chart-container">
      <RiskLineChart recovery={recovery}/>
    </div>
  </div>);
};