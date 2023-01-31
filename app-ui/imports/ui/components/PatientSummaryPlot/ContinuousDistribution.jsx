import { useRef, useState } from 'react';
import React from 'react';
import { Line as LineJS } from 'chart.js/auto';
import { Line, getElementsAtEvent } from 'react-chartjs-2';
import './PatientSummaryPlot.css';
import { records } from '../../records/records';

// ** All Mouse Event Functions ** //
// only active function for mouse move
function handleMouseMove(chart, eventParams, mousemove) {
    chart.update('none');

    const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;

    let xVal = x.getValueForPixel(mousemove.offsetX);
    const yVal = y.getValueForPixel(mousemove.offsetY);
    // modify existing marker
    ctx.strokeStyle = 'maroon';
    ctx.setLineDash([0, 0]);
    ctx.lineDashOffset = 0;

    const markerLength = 0.3 * height;
    const startingPoint = top + (height - markerLength);
    if (xVal <= 0) {
        xVal = 0;
    }
    if (xVal >= eventParams.x_val.length) {
        xVal = eventParams.x_val.length - 1
    }

    let markerPosition = x.getPixelForValue(xVal);

    ctx.strokeRect(markerPosition, startingPoint, 0, markerLength);

    const angle = Math.PI / 180;
    ctx.beginPath();
    ctx.fillStyle = 'maroon';
    ctx.arc(markerPosition, startingPoint, 3, angle * 0, angle * 360, false);
    ctx.fill();
    ctx.closePath();

}

const calculateRisk = (newValue, oldValue, lowVal, upVal, importanceFactor) => {
    let change = 0;
    if (oldValue >= lowVal && oldValue <= upVal) {
        if (newValue >= lowVal && newValue <= upVal) {
            change = 0;
        }
        else if (newValue > upVal) {
            change = (newValue - upVal) / upVal * 40;
        }
        else if (newValue < lowVal) {
            change = -(newValue - lowVal) / lowVal * 40;
        }
    }
    else if (oldValue > upVal) {
        if (newValue > oldValue) {
            change = (newValue - oldValue) / oldValue * 40;
        }
        else if (newValue <= oldValue && newValue >= lowVal) {
            change = (newValue - oldValue) / oldValue * 40;
        }
        else if (newValue < lowVal) {
            change = - (newValue - lowVal) / lowVal * 40;
        }
    }
    else if (oldValue < lowVal) {
        if (newValue > oldValue && newValue <= upVal) {
            change = - (newValue - oldValue) / oldValue * 40;
        }
        else if (newValue < oldValue) {
            change = - (newValue - oldValue) / oldValue * 40;
        }
        else if (newValue > upVal) {
            change = (newValue - upVal) / upVal * 40;
        }
    }

    return Math.round(change * importanceFactor);
};

// only active function for mouse down event
function handleMouseDown(chart,
    data,
    eventParams,
    press) {

    //chart.update('none');
    const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
    const xPos = x.getValueForPixel(press.offsetX);

    eventParams.stateUpdates.setRisk(
        eventParams.risk.currentRisk +
        calculateRisk(
            eventParams.x_val[xPos],
            eventParams.patientValue[eventParams.index],
            eventParams.boundary.boundary_val1,
            eventParams.boundary.boundary_val2,
            eventParams.risk.importanceFactor
        ));

    eventParams.stateUpdates.setMeasureValue(
        eventParams.patientValue.map((val, ind) => {
            // update only specific       
            if (ind == eventParams.index) {
                val = eventParams.x_val[xPos]
            }
            return val;
        }));

    // call resetRiskFactors = (patient, setPRecords); pass patientID and setRecords    
}

// only active function for mouse leave element
function handleMouseOut(chart, eventParams, event) {
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

// ** All Mouse Event Functions ** //
//handle factor change
let factorChange = 0;

export const ContinuousDistribution = (
    {
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
    let x_values = [0];
    let y_values = [0];
    let boundary_val1 = 0;
    let boundary_val2 = 0;

    let boundary_ind1 = 0;
    let boundary_ind2 = 0;

    x_values = measure["data"];
    y_values = measure["count"];
    boundary_val1 = measure["boundaryVal"][0];
    boundary_val2 = measure["boundaryVal"][1];

    for (i = 0; i < x_values.length; i++) {
        if (x_values[i] < boundary_val1) {
            boundary_ind1 = i;
        }
        if (x_values[i] > boundary_val2) {
            boundary_ind2 = i - 1
            break;
        }
    }
    let initialCardColor = "#449231";

    if (patientValue[index] >= boundary_val1 && patientValue[index] <= boundary_val2) {
        initialCardColor = "#449231";
    }
    else {
        initialCardColor = "#D64242";
    }

    const [cardColor, setCardColor] = useState(initialCardColor);

    const highlightRegion = (ctx) => {
        if (x_values.indexOf(patientValue[index]) > boundary_ind1 && x_values.indexOf(patientValue[index]) <= boundary_ind2) {
            setCardColor("#449231");
            if (ctx.p0DataIndex > boundary_ind1 && ctx.p0DataIndex < boundary_ind2) {
                return "#B4EDB3";
            }
            return "#E5E5E5";
        }
        else if (x_values.indexOf(patientValue[index]) <= boundary_ind1) {
            setCardColor("#D64242");
            if (ctx.p0DataIndex <= boundary_ind1) {
                return "#FD8787";
            }
            return "#E5E5E5";
        }
        else {
            setCardColor("#D64242");
            if (ctx.p0DataIndex >= boundary_ind2) {
                return "#FD8787";
            }
            return "#E5E5E5";
        }
    };
    // background color function
    const bgColor = ctx => highlightRegion(ctx);

    let data = {
        labels: x_values,
        datasets: [
            {
                label: 'Count',
                data: y_values,
                pointRadius: 0,
                pointHitRadius: 0,
                pointHoverRadius: 0,
                fill: true,
                tension: 0.4,
                segment: {
                    backgroundColor: bgColor,
                    borderColor: bgColor,
                },
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
                        let label = "BPM " || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.label !== null) {
                            label += context[0].label;
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            y: {
                display: false,
                beginAtZero: false,
                grid: {
                    display: false
                },
                min: 0,
                max: Math.max.apply(Math, y_values) * 1.2,
                ticks: {
                    labelOffset: 0,
                    padding: 0,
                    color: "#000000",
                    font: {
                        size: 8
                    }
                },
                text: "Count of patients",
            },
            x: {
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
                        size: 11
                    },
                    callback: (value, index, values) => {
                        if (index == boundary_ind1 + 1 || index == boundary_ind2) {
                            return x_values[index];
                        }
                    }
                },
                text: "Blood Sugar Measures",
            }
        },
    };

    data.datasets[0].data = y_values;
    data.labels = x_values;
    options.scales.y.max = Math.max.apply(Math, y_values) * 1.2;

    // marker point
    function drawMarker(ctx, top, height, x, y, color, value_marker) {
        ctx.strokeStyle = color;
        ctx.setLineDash([0, 0]);
        ctx.lineDashOffset = 0;

        const markerLength = 0.3 * height;
        const startingPoint = top + (height - markerLength);

        let markerPosition = x.getPixelForValue(value_marker);
        ctx.strokeRect(markerPosition, startingPoint, 0, markerLength);

        const angle = Math.PI / 180;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(markerPosition, startingPoint, 3, angle * 0, angle * 360, false);
        ctx.fill();
        ctx.closePath();
    }

    // plugin block
    const boundaryLines = {
        id: 'boundaryLines',
        afterDatasetDraw(chart, args, option) {
            const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
            ctx.save();

            // Lower Boundary Line   
            ctx.strokeStyle = '#244CB1';
            ctx.setLineDash([5, 10]);
            ctx.lineDashOffset = 2;
            ctx.strokeRect(x.getPixelForValue(boundary_ind1 + 1), top, 0, height);

            // Higher Boundary Line
            ctx.strokeStyle = '#244CB1';
            ctx.strokeRect(x.getPixelForValue(boundary_ind2), top, 0, height);

            // Current Marker
            const value_marker = x_values.indexOf(patientValue[index]);
            drawMarker(ctx, top, height, x, y, '#244CB1', value_marker);
        }
    }

    const chartRef = useRef();

    const eventParams = {
        stateUpdates: { setRisk, setMeasureValue, setCardColor },
        boundary: { boundary_val1, boundary_val2 },
        markerFunction: drawMarker,
        risk: { currentRisk, factorChange, importanceFactor },
        x_val: x_values,
        index: index,
        patient: patient,
        patientValue: patientValue,
    };

    const onMove = (event) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        handleMouseMove(chart, eventParams, event.nativeEvent);
    }
    const onOut = (event) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        handleMouseOut(
            chart,
            eventParams,
            event.nativeEvent);
    }
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

    return (
        <div className="SummaryCard" style={{ background: cardColor }}>
            <div className="SummaryValue">
                {patientValue[index]}
            </div>
            <div className="ContDistPlot">
                <Line data={data}
                    options={options}
                    plugins={[boundaryLines]}
                    ref={chartRef}
                    redraw={true}
                    onMouseMove={onMove}
                    //onMouseOut={onOut}
                    //onMouseLeave={onOut}
                    //onMouseUp={onUp}
                    onMouseDown={onDown}
                />
            </div>
        </div>);
};