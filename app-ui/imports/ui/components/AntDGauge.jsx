import React from 'react';
import ReactDOM from 'react-dom';
import { Gauge } from '@ant-design/plots';

export const AntDGauge = ({ accuracy }) => {
  const config = {
    percent: accuracy,
    radius: 0.5,
    range: {
      color: ['#6929c4', '#E5E5E5'],
      width: 20,
    },
    indicator: {
      pointer: {
        style: {
          stroke: 'black',
        },
      },
      pin: {
        style: {
          stroke: 'black',
        },
      },
    },
    statistic: {
      /*
      content: {
        formatter: ({ percent }) => `Rate: ${(percent * 100).toFixed(0)}%`,
        style: {
        fontSize: 40,
        color:'black'
      },
      },          
      */
    },
    gaugeStyle: {
      lineCap: 'round',
    },
  };
  return (
    <>
      <div>
        <Gauge {...config} />
      </div>
    </>
  );
};