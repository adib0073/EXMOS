import React, { useState } from 'react';
import { InfoLogo } from '../components/Icons/InfoLogo';
import { Collapse } from 'antd';
const { Panel } = Collapse;

export const DataIssueConfig = () => {
    return (
        <>
            <div className='config-display-fc-r1'>
                <div className='config-display-fc-r1-text'>
                    {"The following data quality issues have been observed in the training data:"}

                </div>
                <div className='config-display-fc-r1-icon'>
                    <InfoLogo setButtonPopup={false} setChartIndex={0} index={3} />
                </div>
            </div>
            <div>
                <Collapse accordion>
                    <Panel header="Data Outliers" key="1">
                        <p>{"Your data has many outliers."}</p>
                    </Panel>
                    <Panel header="Data Correlation" key="2">
                        <p>{"Your data has high correlation"}</p>
                    </Panel>
                    <Panel header="Skewed Data" key="3">
                        <p>{"Your dataset is skewed"}</p>
                    </Panel>
                </Collapse>
            </div>
            <div className='config-display-fc-r3'>
                <div className='config-display-fc-r3-text'>
                    * You can auto correct the selected issues and re-train the model
                </div>
                <div className='config-display-fc-r3-item'>
                    <button
                        className="cancel-button"
                        type="submit"
                    >
                        Cancel changes
                    </button>
                    <button
                        className="train-button"
                        type="submit"
                    >
                        {"Autocorrect and Re-train"}
                    </button>
                </div>
            </div>
        </>
    );
};