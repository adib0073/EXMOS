import { useRef, useState } from 'react';
import React from 'react';
import { Bar as BarJS } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import './PatientSummaryPlot.css'
import { records } from '../../records/records';

//https://www.chartjs.org/chartjs-plugin-annotation/master/

let x_values = [0];
let y_values = [0];
let factorChange = 0;
let color = "#E5E5E5";

const labelColor = (type) => {

    if (type == "Good") {
        return "#449231";
    }
    else if (type == "Medium") {
        return "#EA965A";
    }
    else if (type == "Bad") {
        return "#D64242";
    }
};

const labelWrapper = (value) => {
    let wrappedArray = []
    for (let i = 0; i < value.length; i++) {
        wrappedArray.push(value[i].split(" "));
    }
    return wrappedArray;
};

const bgColorMapper = (index, valueTypes) => {
    let bgColor = []
    for (let i = 0; i < valueTypes.length; i++) {
        if (i == index) {
            bgColor.push(labelColor(valueTypes[i]));
        }
        else {
            bgColor.push("#E5E5E5");
        }
    }
    return bgColor;
}

// only active function for mouse down event
function handleMouseDown(chart,
    data,
    eventParams,
    press) {

    const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
    const xPos = x.getValueForPixel(press.offsetX);

    if (eventParams.valueTypes[eventParams.x_val.indexOf(eventParams.patientValue[eventParams.index])] == "Good") {
        if (eventParams.valueTypes[xPos] == "Medium") {
            newRisk = eventParams.risk.currentRisk + (5 * eventParams.risk.importanceFactor);
            factorChange = newRisk - eventParams.risk.currentRisk;
            eventParams.stateUpdates.setRisk(Math.round(newRisk));
        }
        else if (eventParams.valueTypes[xPos] == "Bad") {
            newRisk = eventParams.risk.currentRisk + (15 * eventParams.risk.importanceFactor);
            factorChange = newRisk - eventParams.risk.currentRisk;
            eventParams.stateUpdates.setRisk(Math.round(newRisk));
        }
        else if (eventParams.valueTypes[xPos] == "Good") {
            newRisk = eventParams.risk.currentRisk;
            factorChange = newRisk - eventParams.risk.currentRisk;
            eventParams.stateUpdates.setRisk(newRisk);
        }
    }
    else if (eventParams.valueTypes[eventParams.x_val.indexOf(eventParams.patientValue[eventParams.index])] == "Medium") {
        if (eventParams.valueTypes[xPos] == "Bad") {
            newRisk = eventParams.risk.currentRisk + (5 * eventParams.risk.importanceFactor);
            factorChange = newRisk - eventParams.risk.currentRisk;
            eventParams.stateUpdates.setRisk(Math.round(newRisk));
        }
        else if (eventParams.valueTypes[xPos] == "Good") {
            newRisk = eventParams.risk.currentRisk - (5 * eventParams.risk.importanceFactor);
            factorChange = newRisk - eventParams.risk.currentRisk;
            eventParams.stateUpdates.setRisk(Math.round(newRisk));
        }
        else if (eventParams.valueTypes[xPos] == "Medium") {
            newRisk = eventParams.risk.currentRisk;
            factorChange = newRisk - eventParams.risk.currentRisk;
            eventParams.stateUpdates.setRisk(newRisk);
        }
    }
    else if (eventParams.valueTypes[eventParams.x_val.indexOf(eventParams.patientValue[eventParams.index])] == "Bad") {
        if (eventParams.valueTypes[xPos] == "Good") {
            newRisk = eventParams.risk.currentRisk - (15 * eventParams.risk.importanceFactor);
            factorChange = newRisk - eventParams.risk.currentRisk;
            eventParams.stateUpdates.setRisk(Math.round(newRisk));
        }
        else if (eventParams.valueTypes[xPos] == "Medium") {
            newRisk = eventParams.risk.currentRisk - (5 * eventParams.risk.importanceFactor);
            factorChange = newRisk - eventParams.risk.currentRisk;
            eventParams.stateUpdates.setRisk(Math.round(newRisk));
        }
        else if (eventParams.valueTypes[xPos] == "Bad") {
            newRisk = eventParams.risk.currentRisk;
            factorChange = newRisk - eventParams.risk.currentRisk;
            eventParams.stateUpdates.setRisk(newRisk);
        }
    }

    eventParams.stateUpdates.setMeasureValue(
        eventParams.patientValue.map((val, ind) => {
            // update only specific       
            if (ind == eventParams.index) {
                val = eventParams.x_val[xPos]
            }
            return val;
        }));
}

// only active function for mouse up element
function handleMouseUp(chart,
    data,
    initialMeasureValue,
    eventParams,
    event) {

    chart.update('none');
    eventParams.stateUpdates.setMeasureValue(
        [
            records[eventParams.patient]["PatientInfo"].bloodSugar.value,
            records[eventParams.patient]["PatientInfo"].waistMeasure.value,
            records[eventParams.patient]["PatientInfo"].bmi.value,
            records[eventParams.patient]["PatientInfo"].drinkingStatus.value,
            records[eventParams.patient]["PatientInfo"].smokingStatus.value,
            records[eventParams.patient]["PatientInfo"].physicalActivityLevel.value,
        ]);


    eventParams.stateUpdates.setRisk(eventParams.risk.currentRisk - factorChange);
    chart.update();
}

export const DiscreteDistribution = ({
    patient,
    currentRisk,
    setRisk,
    measure,
    index,
    patientValue,
    setMeasureValue,
    setWhatIf,
    setPRecords,
    updateIsSelectedCCFE,
    importanceFactor,
    updateVizSelected
}) => {

    x_values = measure["data"];
    y_values = measure["count"];

    let data = {
        labels: labelWrapper(x_values),
        datasets: [
            {
                label: 'Count',
                data: y_values,
                pointRadius: 0,
                fill: true,
                backgroundColor: bgColorMapper(
                    x_values.indexOf(patientValue[index]),
                    measure["valueType"]
                ),
                borderColor: bgColorMapper(
                    x_values.indexOf(patientValue[index]),
                    measure["valueType"]
                ),
                barPercentage: 1,
                categoryPercentage: 1,
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
                formatter: function (value, context) {
                    return context.chart.data.labels[context.dataIndex];
                },
                textAlign: 'center',
                font: function (context) {
                    var width = context.chart.width;
                    var size = Math.round(width / 24);
                    return {
                        size: size
                    };
                }
            },
            tooltip: {
                enabled: false,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        let label = "Patient Counts " || '';

                        if (label) {
                            label += '- ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    },
                    title: function (context) {
                        let label = "Behavior " || '';

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
                text: "Blood Sugar Measures",
            }
        },
    };

    data.labels = labelWrapper(x_values);

    data.datasets[0].data = y_values;
    color = labelColor(measure["valueType"][x_values.indexOf(patientValue[index])]);

    const chartRef = useRef();

    const eventParams = {
        stateUpdates: { setRisk, setMeasureValue },
        risk: { currentRisk, factorChange, importanceFactor },
        x_val: x_values,
        valueTypes: measure["valueType"],
        index: index,
        patient: patient,
        patientValue: patientValue,
    };

    const resetRiskFactors = () => {
        setPRecords([
            records[patient]["PatientInfo"].bloodSugar.value,
            records[patient]["PatientInfo"].waistMeasure.value,
            records[patient]["PatientInfo"].bmi.value,
            records[patient]["PatientInfo"].drinkingStatus.value,
            records[patient]["PatientInfo"].smokingStatus.value,
            records[patient]["PatientInfo"].physicalActivityLevel.value
        ]);
        setRisk(records[patient]["Risk"]);
        updateIsSelectedCCFE([false, false]);
    }
    const onDown = (event) => {
        resetRiskFactors();
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        setWhatIf(true);
        updateVizSelected([true, false]);
        handleMouseDown(chart,
            data,
            eventParams,
            event.nativeEvent);
    };

    const onUp = (event) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        handleMouseUp(chart,
            data,
            patientValue[index],
            eventParams,
            event.nativeEvent);
    }

    return (
        <div className="SummaryCard" style={{ background: color }}>
            <div className="SummaryValue" style={{ fontSize: '0.9vw' }}>
                {patientValue[index]}
            </div>
            <div className="DiscreteDistPlot">
                <Bar
                    data={data}
                    options={options}
                    ref={chartRef}
                    redraw={true}
                    onMouseDown={onDown}
                    //onMouseUp={onUp}
                    plugins={[ChartDataLabels]}
                />
            </div>
        </div>);
};