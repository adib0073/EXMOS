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
    chartColor: '#D64242',
    chartStatus: 'High',
}
const data = {
    datasets: [
        {
            label: 'Predicted Risk',
            data: [0, 100],
            backgroundColor: [
                options.chartColor,
                '#E5E5E5'
            ],
            borderColor: [
                options.chartColor,
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
        const fontHeight = 0.15 * height;
        ctx.font = `bolder ${fontHeight / 2}px Roboto`;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('Overall Risk', width / 2, 0.65 * height);

        ctx.font = `bolder ${fontHeight}px Roboto`;
        ctx.fillStyle = options.chartColor;
        ctx.textAlign = 'center';
        ctx.fillText(options.chartStatus, width / 2, height / 2);
        ctx.restore();
        chart.update();
    }
}
export const DoughnutChart = ({ estimatedRisk, chartRef }) => {
    estimatedRisk = Math.min(estimatedRisk, 100); // Setting Boundary Conditions for risk
    estimatedRisk = Math.max(0, estimatedRisk); // Setting Boundary Conditions for risk

    let statusColor = '#D64242';
    let status = 'High';
    let tooltipMessage = "Overall Risk is " + status + " at " + estimatedRisk + "%.";
    if (estimatedRisk > 75) {
        statusColor = '#D64242';
        status = 'High';
        tooltipMessage = tooltipMessage + "\n\nReduce risk by " + (estimatedRisk - 75) + "% to reach Moderate level.";
    }
    else if (estimatedRisk > 50) {
        statusColor = '#EA965A';
        status = 'Moderate';
        //setStatusColor('#D64242');
        tooltipMessage = tooltipMessage + "\nReduce risk by " + (estimatedRisk - 50) + "% to reach Low level.";
    }
    else {
        statusColor = '#449231';
        status = 'Low';
    }
    options.chartColor = statusColor;
    options.chartStatus = status;

    data.datasets[0].data = [estimatedRisk, 100 - estimatedRisk];
    data.datasets[0].backgroundColor = [statusColor, '#E5E5E5'];
    data.datasets[0].borderColor = [statusColor, '#E5E5E5'];

    if (chartRef.current) {
        chartRef.current.data.datasets[0].data = [estimatedRisk, 100 - estimatedRisk];
        chartRef.current.data.datasets[0].backgroundColor = [statusColor, '#E5E5E5'];
        chartRef.current.data.datasets[0].borderColor = [statusColor, '#E5E5E5'];
        chartRef.current.options.chartColor = statusColor;
        chartRef.current.options.chartStatus = status;
        chartRef.current.update();
    }

    return (
        <div className='RiskProgressChart'>
            <Tooltip placement="bottom" title={tooltipMessage}>
                <Doughnut ref={chartRef}
                    data={data}
                    options={options}
                    plugins={[centerText]}
                />
            </Tooltip>
        </div>
    );
};
