import { useRef, useState } from 'react';
import React from 'react';
import { Line as LineJS } from 'chart.js/auto';
import { Line, getElementsAtEvent } from 'react-chartjs-2';
import './PatientSummaryPlot.css';
import { Tooltip } from 'antd';

// ** All Mouse Event Functions ** //
// only active function for mouse move
function handleMouseMove(chart, eventParams, mousemove) {
    chart.update('none');

    const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;

    let xVal = x.getValueForPixel(mousemove.offsetX);
    const yVal = y.getValueForPixel(mousemove.offsetY);
    // modify existing marker
    ctx.strokeStyle = 'maroon';
    //ctx.setLineDash([0, 0]);
    //ctx.lineDashOffset = 0;

    const markerLength = 0.3 * height;
    const startingPoint = top + (height - markerLength);
    if (xVal <= 0) {
        xVal = 0;
    }
    if (xVal >= eventParams.x_val.length) {
        xVal = eventParams.x_val.length - 1
    }

    let markerPosition = x.getPixelForValue(xVal);

    //ctx.strokeRect(markerPosition, startingPoint, 0, markerLength);

    const angle = Math.PI / 180;
    /*
    ctx.beginPath();
    ctx.fillStyle = 'maroon';
    ctx.arc(markerPosition, startingPoint, 3, angle * 0, angle * 360, false);
    ctx.fill();
    ctx.closePath();
    */
}

const calculateRisk = (newValue, oldValue, lowVal, upVal, importanceFactor = 5) => {
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
            //eventParams.risk.importanceFactor
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
    chart.update();
}

// only active function for mouse up element
function handleMouseUp(chart,
    data,
    initialMeasureValue,
    eventParams,
    event) {

    chart.update('none');
    chart.update();
}

// ** All Mouse Event Functions ** //
//handle factor change
let factorChange = 0;

export const ContinuousDistribution = (
    {
        average,
        yVal,
        xVal,
        uLimit,
        lLimit,
        isActive,
        q1,
        q3,
        name,
        unit,
        lang = "ENG"
    }) => {

    let x_values = [0];
    let y_values = [0];
    let boundary_val1 = 0;
    let boundary_val2 = 0;

    let boundary_ind1 = 0;
    let boundary_ind2 = 0;

    x_values = xVal;
    y_values = yVal;

    boundary_val1 = Math.max(lLimit, Math.min(...x_values));
    boundary_val2 = Math.min(uLimit, Math.max(...x_values));

    if (q1 < 0) {
        q1 = boundary_val1;
    }
    if (q3 < 0) {
        q3 = boundary_val2;
    }
    // Finding q1 index
    var estVal_q1 = x_values.reduce((prev, curr) => Math.abs(curr - q1) < Math.abs(prev - q1) ? curr : prev);
    var q1_ind = x_values.indexOf(estVal_q1);
    // Finding q3 index
    var estVal_q3 = x_values.reduce((prev, curr) => Math.abs(curr - q3) < Math.abs(prev - q3) ? curr : prev);
    var q3_ind = x_values.indexOf(estVal_q3);

    boundary_ind1 = x_values.indexOf(boundary_val1);
    boundary_ind2 = x_values.indexOf(boundary_val2);

    let alpha = 1.0;

    const chartColor = isActive ? `rgb(190, 149, 255, ${alpha})` : "#E5E5E5";
    const cardColor = isActive ? "#6929c4" : "#E5E5E5";

    const highlightRegion = (ctx) => {
        if (x_values[ctx.p0DataIndex] >= q1 && x_values[ctx.p0DataIndex] <= q3) {
            alpha = 1.0;
            return chartColor;
        }
        else {
            return isActive ? "#FFB1C1" : "#E5E5E5";
        }
    };
    // background color function
    const bgColor = ctx => highlightRegion(ctx);

    
    let bdrColor = [];
    for (let i = 0; i < x_values.length; i++) {
        if (x_values[i] >= q1 && x_values[i] <= q3) {
            bdrColor.push(cardColor);
        }
        else {
            bdrColor.push(isActive ? "#FF0000" : "#E5E5E5");
        }
    };

    let data = {
        labels: x_values,
        datasets: [
            {
                label: 'Count',
                data: y_values,
                pointRadius: 2,
                backgroundColor: bdrColor,
                borderColor: bdrColor,
                pointBorderWidth: 1,
                hoverBackgroundColor: 'white',
                pointHoverRadius: 5,
                pointHoverBorderWidth: 3,
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
        animation: true,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        let label = lang == "ENG" ? "Patient Counts " || '' : "Pacient šteje " || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += Math.round((context.parsed.y + Number.EPSILON) * 100) / 100;
                        }
                        return label;
                    },
                    title: function (context) {
                        let label = name + " " || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.label !== null) {
                            label += parseFloat(context[0].label).toFixed(2);
                        }
                        return label + " " + unit;
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
                min: boundary_val1,
                max: boundary_val2,
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
                    //stepSize: 5,
                    callback: (value, index, ticks) => {
                        if (index == boundary_ind1 || index == boundary_ind2 || index == q1_ind || index == q3_ind) {
                            return Math.round((x_values[index] + Number.EPSILON) * 100) / 100;
                        }
                    }
                },
                text: "Measures",
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

        const markerLength = height - y.getPixelForValue(y_values[value_marker]) + 5;
        //const startingPoint = top + (height - markerLength);
        const startingPoint = y.getPixelForValue(y_values[value_marker]);

        let markerPosition = x.getPixelForValue(value_marker);
        //let markerPosition = x.getPixelForValue(average);
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
            ctx.strokeStyle = '#491d8b';
            ctx.setLineDash([5, 10]);
            ctx.lineDashOffset = 2;
            //ctx.strokeRect(x.getPixelForValue(boundary_ind1), top, 0, height);
            //ctx.strokeRect(x.getPixelForValue(q1), top, 0, height);

            // Higher Boundary Line
            ctx.strokeStyle = '#491d8b';
            //ctx.strokeRect(x.getPixelForValue(boundary_ind2), top, 0, height);
            //ctx.strokeRect(x.getPixelForValue(q3), top, 0, height);

            // Current Marker
            var markerVal = x_values.reduce((prev, curr) => Math.abs(curr - average) < Math.abs(prev - average) ? curr : prev);
            var markerIndx = x_values.indexOf(markerVal);
            drawMarker(ctx, top, height, x, y, isActive ? "black" : "#E5E5E5", markerIndx);
        }
    }

    const chartRef = useRef();

    const eventParams = {
        //stateUpdates: { setRisk, setMeasureValue, setCardColor },
        boundary: { boundary_val1, boundary_val2 },
        markerFunction: drawMarker,
        //risk: { currentRisk, factorChange, importanceFactor },
        risk: { factorChange },
        x_val: x_values,
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
            average,
            eventParams,
            event.nativeEvent);
    }

    const onDown = (event) => {

        //resetRiskFactors();
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        //setWhatIf(true);
        //updateVizSelected([true, false]);
        handleMouseDown(chart,
            data,
            eventParams,
            event.nativeEvent);
    };

    return (
        <div className="SummaryCard" style={{ background: cardColor }}>
            <div className="SummaryValue">
                <Tooltip
                    placement="bottom"
                    title={
                        (lang == "ENG")
                            ? "As indicated by the black marker the average value of this factor is " + average
                            : "Kot je prikazano s črnim markerjem, je povprečna vrednost tega faktorja " + average
                    }
                    overlayStyle={{ maxWidth: '200px' }}
                >
                    {average}
                    <div className="SummaryAvg">
                        {
                            (lang == "ENG")
                                ? "AVERAGE"
                                : "Povprečje"
                        }
                    </div>
                </Tooltip>
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