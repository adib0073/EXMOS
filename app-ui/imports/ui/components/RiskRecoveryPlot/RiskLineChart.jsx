import { useRef, useState } from 'react';
import React from 'react';
import { Line as LineJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import './RiskRecoveryPlot.css'

// only active function for mouse move
function handleMouseMove(chart, mousemove) {
    chart.update('none');

    const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;

    let xVal = x.getValueForPixel(mousemove.offsetX);
    let yVal = y.getValueForPixel(mousemove.offsetY);

    const fontHeight = 0.25 * height;
    ctx.font = `bolder ${fontHeight / 2}px Roboto`;

    if (yVal >= 75) {
        chart.update('none');
        ctx.fillStyle = '#D64242';
        ctx.fillText('High Risk Zone', width / 9, y.getPixelForValue(75) - top)

        ctx.fillStyle = 'rgba(200, 0, 0, 0.2)';
        ctx.fillRect(left, top, width, y.getPixelForValue(75) - top)
        ctx.restore();
    }
    else if (yVal >= 50) {
        chart.update('none');
        ctx.fillStyle = '#FFA666';
        ctx.fillText('Moderate Risk Zone', width / 9, y.getPixelForValue(50) - top)

        ctx.fillStyle = 'rgba(234, 150, 90, 0.3)';
        ctx.fillRect(left, y.getPixelForValue(75), width, height / 4)
        ctx.restore();
    }
    else {
        chart.update('none');
        ctx.fillStyle = '#449231';
        ctx.fillText('Low Risk Zone', width / 9, y.getPixelForValue(0) - top)

        ctx.fillStyle = 'rgba(0, 200, 0, 0.2)';
        ctx.fillRect(left, y.getPixelForValue(50), width, height / 2)
        ctx.restore();
    }

}

// only active function for mouse leave element
function handleMouseOut(chart, event) {
    chart.update('none');
    chart.update();
}

// plugin block
const riskLines = {
    id: 'riskLines',
    beforeDatasetDraw(chart, args, option) {
        const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
        ctx.save();
        // Higher Risk Line   
        ctx.strokeStyle = "#D64242";
        ctx.setLineDash([5, 10]);
        ctx.strokeRect(left, y.getPixelForValue(75), width, 0);
        // Lower Risk Line
        ctx.strokeStyle = "#FFA666";
        ctx.strokeRect(left, y.getPixelForValue(50), width, 0);
        ctx.restore();
    },
    afterDraw(chart, args, option) {
        const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
        ctx.save();

        const arrowWidth = 3;
        //Arrow heads - top
        ctx.beginPath();
        ctx.moveTo(left, top - 5);
        ctx.lineTo(left - arrowWidth, top);
        ctx.lineTo(left + arrowWidth, top);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        //Arrow heads - right
        ctx.beginPath();
        ctx.moveTo(right, bottom - arrowWidth);
        ctx.lineTo(right, bottom + arrowWidth);
        ctx.lineTo(right + 5, bottom);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

export const RiskLineChart = ({recovery}) => {

    let x_values = recovery.dates;
    let data_val = recovery.risk;
    let bdColor = [];

    for (let i = 0; i < data_val.length; i++) {
        if (data_val[i] < 50) {
            bdColor.push("#449231");
        }
        else if (data_val[i] < 75) {
            bdColor.push("#EA965A");
        }
        else {
            bdColor.push("#D64242");
        }
    };


    const data = {
        labels: x_values,
        datasets: [
            {
                label: 'Estimated Risk',
                data: data_val,
                pointRadius: 5,
                tension: 0.0,
                backgroundColor: bdColor,
                pointBorderColor: bdColor,
                borderColor: "#000000",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + "%";
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                offset: true,
                grid: {
                    display: false,
                    borderColor: 'black',
                    drawTicks: false,
                },
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 5,
                    color: 'black',
                    font: function (context) {
                        var width = context.chart.width;
                        var size = Math.round(width / 48);
                        return {
                            size: size
                        };
                    },
                    callback: (value, index, values) => {
                        return value;
                    }
                },
                title: {
                    display: true,
                    text: "Estimated Risk",
                    color: 'black',
                    font: function (context) {
                        var width = context.chart.width;
                        var size = Math.round(width / 42);
                        return {
                            size: size,
                        };
                    }
                }
            },
            x: {
                offset: true,
                grid: {
                    display: false,
                    borderColor: 'black',
                    drawTicks: false,
                },
                ticks: {
                    color: 'black',
                    font: function (context) {
                        var width = context.chart.width;
                        var size = Math.round(width / 48);
                        return {
                            size: size,
                        };
                    }
                },
                title: {
                    display: true,
                    text: "Year 2022",
                    color: 'black',
                    font: function (context) {
                        var width = context.chart.width;
                        var size = Math.round(width / 42);
                        return {
                            size: size,
                        };
                    }
                }
            }
        }
    };
    const chartRef = useRef();

    const onMove = (event) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        handleMouseMove(chart, event.nativeEvent);
    }
    const onOut = (event) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        handleMouseOut(
            chart,
            event.nativeEvent);
    }

    return (
        <div className='RecoveryLineChart'>
            <Line
                data={data}
                options={options}
                plugins={[riskLines]}
                ref={chartRef}
                //redraw={true}
                onMouseMove={onMove}
                onMouseLeave={onOut}
                onMouseOut={onOut}
            />
        </div>

    );
};