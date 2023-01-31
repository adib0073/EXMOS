import React, { useState } from 'react';
import { MoreInfoTemplate } from '../MoreInfo/MoreInfoTemplate.jsx';
import { InfoLogo } from '../Icons/InfoLogo';
import './FeatureImportance.css';
import 'antd/dist/antd.css';
import { Progress } from 'antd';

export const FeatureImportance = ({ setPopupTrigger, setChartIndex }) => {


  return (
    <div className="container-box-2-2-2">
      <div className="chart-title-box">
        <div className="chart-title">
          Important Risk Factors
        </div>
        <div className="chart-icons">
          <InfoLogo setButtonPopup={setPopupTrigger} setChartIndex={setChartIndex} index={2} />
        </div>
      </div>
      <div className="chart-container">
        <div className="fi-col-container-left">
          <div className="fi-col-text">
            Factors increasing risk
          </div>
          <div className="fi-col-val">
            <b>{"Blood Sugar"}:</b> {"7.5"} <span className='threshold-val'>{"(> 6.5)"}</span>
          </div>
          <div className="fi-col-ri">
            <Progress percent={60} status="active" strokeColor="#D64242" trailColor="#E5E5E5" />
          </div>
          <div className="fi-col-val">
            <b>{"Waist Measures"}:</b> {"120"} <span className='threshold-val'>{"(> 96)"}</span>
          </div>
          <div className="fi-col-ri">
            <Progress percent={20} status="active" strokeColor="#D64242" trailColor="#E5E5E5" />
          </div>
          <div className="fi-col-val">
            <b>{"BMI"}:</b> {"29.5"} <span className='threshold-val'>{"(> 25)"}</span>
          </div>
          <div className="fi-col-ri">
            <Progress percent={12} status="active" strokeColor="#D64242" trailColor="#E5E5E5" />
          </div>
          <div className="fi-col-val">
            <b>{"Drinking Status"}:</b> {"(Addicted)"}
          </div>
          <div className="fi-col-ri">
            <Progress percent={8} status="active" strokeColor="#D64242" trailColor="#E5E5E5" />
          </div>
        </div>
        <div className="fi-col-container-right">
          <div className="fi-col-text">
            Factors decreasing risk
          </div>
          <div className="fi-col-val">
            <b>{"Pulse"}:</b> {"80"} <span className='threshold-val'>{"(>= 60 and <= 100)"}</span>
          </div>
          <div className="fi-col-ri">
            <Progress percent={50} status="active" strokeColor="#449231" trailColor="#E5E5E5" />
          </div>
          <div className="fi-col-val">
            <b>{"Stress Level"}:</b> {"(Low)"}
          </div>
          <div className="fi-col-ri">
            <Progress percent={25} status="active" strokeColor="#449231" trailColor="#E5E5E5" />
          </div>
          <div className="fi-col-val">
            <b>{"Physical Activity Level"}:</b> {"(Moderate)"}
          </div>
          <div className="fi-col-ri">
            <Progress percent={20} status="active" strokeColor="#449231" trailColor="#E5E5E5" />
          </div>
          <div className="fi-col-val">
            <b>{"Cholestrol Level"}:</b> {"190"} <span className='threshold-val'>{"(>200)"}</span>
          </div>
          <div className="fi-col-ri">
            <Progress percent={5} status="active" strokeColor="#449231" trailColor="#E5E5E5" />
          </div>
        </div>
      </div>
    </div>);
};