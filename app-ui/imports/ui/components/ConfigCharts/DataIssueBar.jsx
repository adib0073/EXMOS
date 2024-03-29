import { useRef, useState } from 'react';
import React from 'react';
import { Bar as BarJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './ConfigCharts.css';


const labelWrapper = (value) => {
    let wrappedArray = []
    for (let i = 0; i < value.length; i++) {
        wrappedArray.push(value[i].split(" "));
    }
    return wrappedArray;
};


export const DataIssueBar = ({ y_values, x_values}) => {

    let data = {
        labels: labelWrapper(x_values),
        datasets: [
            {
                label: 'Count',
                data: y_values,
                pointRadius: 0,
                fill: true,
                backgroundColor: ["#C5C4C4", "#be95ff"],
                borderColor: ["#C5C4C4", "#be95ff"],
                barPercentage: 0.9,
                categoryPercentage: 0.9,
                //maxBarThickness: 20,
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    offset: 8,
                }
            },
        ],
    };

    const options = {
        animation: false,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { display: false },
            datalabels: {
                color: "#000",
                formatter: function (value, context) {
                    return context.chart.data.labels[context.dataIndex];
                },
                textAlign: 'center',
                font: function (context) {
                    var width = context.chart.width;
                    var size = Math.round(width / 12);
                    return {
                        size: size,
                    };
                }
            },
            tooltip: {
                enabled: true,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        let label = "Proportion " || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label + "%";
                    },
                    title: function (context) {
                        let label = "";
                        if (context.label !== null) {
                            label += context[0].label;
                        }
                        return label.replaceAll(",", " ");
                    }
                }
            },
        },
        layout:{
            padding: {
                left: 10,
                right: 10,
            }
        },
        scales: {
            y: {
                display: false,
                beginAtZero: true,
                grid: {
                    display: false,
                    borderColor: 'black',
                    drawTicks: false,
                },
                min: 0,
                max: Math.max.apply(Math, y_values) * 2,
                ticks: {
                    padding: 0,
                    color: "#000000",
                    font: {
                        size: 8
                    }
                },
                text: "Count of patients",
            },
            x: {
                display: false,
                offset: true,
                grid: {
                    display: false,
                    borderColor: 'black',
                    drawTicks: false,
                },
                ticks: {
                    padding: 1,
                    color: "#000000",
                    font: {
                        size: 9
                    },
                    callback: (value, index, values) => {
                        return ""
                    }
                },
                text: "Features",
            }
        },
    };

    data.labels = labelWrapper(x_values);

    data.datasets[0].data = y_values;

    const chartRef = useRef();

    return (<div className="DataIssueBarContainer">
        <Bar
            data={data}
            options={options}
            ref={chartRef}
            redraw={true}
            //onMouseDown={onDown}
            //onMouseUp={onUp}
            plugins={[ChartDataLabels]}
        />
    </div>);
};