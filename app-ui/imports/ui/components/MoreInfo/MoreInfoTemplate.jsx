import React, { useState } from 'react';
import './MoreInfoTemplate.css';
import { VizDescription } from './VizDescription';

export const MoreInfoTemplate = ({ trigger, setPopupTrigger, index }) => {
    return ((trigger) ? (<div className="popup">
        <div className="popup-inner">
            <div className='InfoHeader'>
                <div className='ChartName'>
                    {VizDescription[index]["title"]}
                </div>
                <div className='close-btn' onClick={() => setPopupTrigger(false)}>
                    <i className='fas fa-times'></i>
                </div>
            </div>
            <div className='InfoDesc'>
                <div className='Desc'>
                    <br />
                    <b> Description: </b>
                    <br />
                    {VizDescription[index]["longDesc"]}
                </div>
                <div className='Info-Part1'>
                    <br />
                    <b> {VizDescription[index]["info1"]["title"]}: </b>
                    <br />
                    {VizDescription[index]["info1"]["message"]}
                </div>
                <div className='Info-Part2'>
                    <br />
                    <b> {VizDescription[index]["info2"]["title"]}: </b>
                    <br />
                    {VizDescription[index]["info2"]["message"]}
                </div>
                <div className='Chart-Note'>
                    <br />
                    {VizDescription[index]["note"]}
                </div>
            </div>
        </div>
    </div>) : (<div></div>));
};