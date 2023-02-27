import { useRef, useState } from 'react';
import React from 'react';
import { Scatter as ScatterJS } from 'chart.js/auto';
import { Scatter } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './ConfigCharts.css';



export const ConfigScatter = ({ y_values, x_values, outlierLimit }) => {

    let bgColor = [];

    for (let i = 0; i < y_values.length; i++) {
        if (y_values[i] > outlierLimit[1] || y_values[i] < outlierLimit[0]) {
            bgColor.push("#D64242");
        }
        else {
            bgColor.push("#1363DF");
        }
    };


    let data = {
        labels: x_values,
        datasets: [
            {
                label: 'Count',
                data: y_values,                          
                backgroundColor: bgColor,
            },
        ],
    };

    const options = {
        animation: false,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: false,
                displayColors: false,
            },
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                max: Math.max.apply(Math, x_values) * 1.2,
                min: 0,
            },
            y: {
                max: Math.max.apply(Math, y_values) * 1.2,
            },
        }
    };

    data.datasets[0].data = y_values;

    const chartRef = useRef();

    return (<div className="ScatterPlotContainer">
        <Scatter
            data={data}
            options={options}
            ref={chartRef}
            redraw={true}
            //onMouseDown={onDown}
            //onMouseUp={onUp}
            //plugins={[ChartDataLabels]}
        />
    </div>);
};