import { useRef, useState } from 'react';
import React from 'react';
import { Bar as BarJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './HorizontalBarCharts.css';
import 'antd/dist/antd.css';

export const HorizontalBarCharts = () => {
    let data = {
        labels: ["feat1", "feat2", "feat3"],
        datasets: [
            {
                label: 'Feature Imporance',
                data: [40, 20, 15],
                backgroundColor: ["#244CB1", "#1363DF", "#67A3FF"],
                borderColor: ["#244CB1", "#1363DF", "#67A3FF"],
                borderRadius: 100,

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
            tooltip: {
                enabled: true,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        let label = "Importance " || '';

                        if (label) {
                            label += '- ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    },
                    title: function (context) {
                        let label = "Feature " || '';

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
    };

    //data.labels = labelWrapper(x_values);

    //data.datasets[0].data = y_values;

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