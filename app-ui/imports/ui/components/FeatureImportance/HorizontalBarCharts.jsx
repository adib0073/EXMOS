import { useRef, useState } from 'react';
import React from 'react';
import { Bar as BarJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './HorizontalBarCharts.css';
import 'antd/dist/antd.css';

export const HorizontalBarCharts = ({y_labels, x_values, isActionable, lang="ENG"}) => {

    let bdColor = [];
    let maxXval = Math.max.apply(Math, x_values);

    for (let i = 0; i < x_values.length; i++) {
        if (x_values[i] < maxXval/2) {
            if (isActionable){
                bdColor.push("#be95ff");
            }
            else{
                bdColor.push("#C5C4C4");
            }
        }
        else if (x_values[i] < maxXval) {
            if (isActionable){
                bdColor.push("#6929c4");
            }
            else{
                bdColor.push("#999999");
            }
        }
        else {
            if (isActionable){
                bdColor.push("#491d8b");
            }
            else{
                bdColor.push("#7B7B7B");
            }
        }
    };

    let data = {
        labels: y_labels,
        datasets: [
            {
                //label: 'Feature Imporance',
                data: x_values,
                backgroundColor: bdColor,
                borderColor: bdColor,
                borderRadius: 100,
                datalabels: {
                    anchor: 'end',
                    align: 'right',
                    offset: 8,
                }

            },
        ],
    };

    const options = {
        animation: true,
        maintainAspectRatio: false,
        responsive: true,
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            datalabels: {
                formatter: function (value, context) {
                    return value + "%";
                },
                textAlign: 'center',
                color: "black",
                font: function (context) {
                    var width = context.chart.width;
                    var size = Math.round(width / 36);
                    return {
                        size: size
                    };
                }
            },
            tooltip: {
                enabled: true,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        let label = lang == "ENG" ? "Importance " || '': "Pomembnost " || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.x + "%";
                        }
                        return label;
                    },
                    title: function (context) {
                        let label = lang == "ENG" ? "Risk Factor " || '': "Dejavnik tveganja " || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.label !== null) {
                            label += context[0].label;
                        }
                        return label.replaceAll(",", " ");
                    }
                }
            },
        },
        scales: {
            y: {
                display: true,
                beginAtZero: true,
                grid: {
                    display: false,
                    borderColor: 'black',
                    drawTicks: false,
                },
                ticks: {
                    padding: 10,
                    color: "black",
                    font: function (context) {
                        var width = context.chart.width;
                        var size = Math.round(width / 36);
                        return {
                            size: size
                        };
                    },
                },
                offset: true,
            },
            x: {
                display: false,
                offset: false,
                grid: {
                    display: false,
                    borderColor: 'black',
                    drawTicks: false,
                },
                min: 0,
                max: maxXval * 1.15,
                ticks: {
                    padding: 1,
                    color: "#000000",
                    font: {
                        size: 9
                    },
                    callback: (value, index, values) => {
                        return value;
                    }
                },
                //text: "Features",
            }
        },
    };

    data.labels = y_labels;
    data.datasets[0].data = x_values;

    const chartRef = useRef();

    return (
    <div className="HBarPlotContainer">
        <Bar
            data={data}
            options={options}
            ref={chartRef}
            redraw={true}
            plugins={[ChartDataLabels]}
        />
    </div>
    );

};