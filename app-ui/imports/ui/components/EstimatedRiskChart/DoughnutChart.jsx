import React from 'react';
import { Doughnut as DoughnutJS } from 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import './DoughnutChart.css';
import 'antd/dist/antd.css';
import { Tooltip } from 'antd';

const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
    },
    accuracy: 0
}
const data = {
    datasets: [
        {
            label: 'Overall Prediction Accuracy',
            data: [0, 100],
            backgroundColor: [
                '#6929c4',
                '#E5E5E5'
            ],
            borderColor: [
                '#6929c4',
                '#E5E5E5'
            ],
            borderWidth: 1,
            cutout: '80%',
            borderRadius: 10,
            spacing: 2,
            borderJoinStyle: 'round'
        },
    ],
};

// center text plugin
const centerText = {
    id: 'centerText',
    afterDatasetsDraw(chart, args, option) {
        chart.update('none');
        const { ctx, chartArea: { left, right, top, bottom, width, height } } = chart;
        
        ctx.save();
        const fontHeight = 0.2 * height;
        ctx.font = `bolder ${fontHeight / 2}px Open Sans`;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        // For Overall text
        ctx.fillText('Overall', width / 2, 0.65 * height);

        ctx.font = `bolder ${fontHeight * 1.2}px Open Sans`;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        
        // For Accuracy Value
        ctx.fillText(options.accuracy, 0.5 * width, height / 2);
        //console.log(ctx.measureText(options.accuracy));
        ctx.restore();
        
        // For % symbol
        var pOffset = (options.accuracy === 100 ? (fontHeight * 0.9) : (options.accuracy >= 10 ? (fontHeight * 0.6) : (fontHeight * 0.3)))
        ctx.font = `bolder ${fontHeight * 0.6}px Open Sans`;
        ctx.fillText("%", width/2 + pOffset, height / 2);
        ctx.restore();
        chart.update();
    }
}
export const DoughnutChart = ({ accuracy, chartRef, language = "ENG" }) => {
    accuracy = Math.min(accuracy, 100); // Setting Boundary Conditions for accuracy
    accuracy = Math.max(0, accuracy); // Setting Boundary Conditions for accuracy

    let tooltipMessage = language == "ENG" ? 
    "Overall Prediction Accuracy is " + accuracy + "%"
    :
    "Skupna natančnost napovedi je " + accuracy + "%";

    options.accuracy=accuracy;

    data.datasets[0].data = [accuracy, 100 - accuracy];
    data.datasets[0].backgroundColor = ['#6929c4', '#E5E5E5'];
    data.datasets[0].borderColor = ['#6929c4', '#E5E5E5'];

    if (chartRef.current) {
        chartRef.current.data.datasets[0].data = [accuracy, 100 - accuracy];
        chartRef.current.update();
    }

    return (
        <div className='AccuracyChart'>
            <Tooltip placement="top" title={tooltipMessage}>
                <Doughnut ref={chartRef}
                    data={data}
                    options={options}
                    plugins={[centerText]}
                />
            </Tooltip>
        </div>
    );
};
