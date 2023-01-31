import React from 'react';
import 'antd/dist/antd.css';
import { Tooltip, Progress} from 'antd';
import './EstimatedRiskChart.css';


const risk = 80;
const width = 100;
const estimatedRiskText = 'High';
const estmatedRiskStrokeColor = '#D64242';
const riskColorClass = 'progress-text-red';


export const EstimatedRiskChart = () => {

    return (
        <div className={riskColorClass}>
        <Tooltip title={'Estimated Risk is ' + risk + '%'}>
          <Progress width={width}
            percent={risk}
            strokeColor={estmatedRiskStrokeColor}
            strokeWidth={12}
            status="active"
            format={() => estimatedRiskText}
            type="circle" />
        </Tooltip>
      </div>
    );
  };
  