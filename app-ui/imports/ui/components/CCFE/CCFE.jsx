import React, { useState } from 'react';
import './CCFE.css';
import { TickLogo } from '../Icons/TickLogo';
import { InfoLogo } from '../Icons/InfoLogo';
import 'antd/dist/antd.css';
import { Tooltip } from 'antd';


export const CCFE = (
  { counterFactuals,
    risk,
    setRisk,
    setPopupTrigger,
    setChartIndex,
    isSelected,
    updateIsSelected }) => {

  const handleSelection = (pos) => {
    updateIsSelected(isSelected.map((val, index) => {
      // toggle val       
      if (index == pos) {
        // Update Estimated Risk based on selection
        if (val) {
          setRisk(risk + counterFactuals[pos]["riskReduction"]);
        }
        else {
          setRisk(risk - counterFactuals[pos]["riskReduction"]);
        }
        val = !val
      }

      return val
    })
    );
  };

  return (
    <div className="container-box-2-2-1">
      <div className="chart-title-box">
        <div className="chart-title">
          <Tooltip
            placement="rightTop"
            title="This visual provides you system generated recommendations to reduce risk which is specific to the selected patient."
          >
            Recommendations to reduce risk
          </Tooltip>
        </div>
        <div className="chart-icons">
          <InfoLogo setButtonPopup={setPopupTrigger} setChartIndex={setChartIndex} index={1} />
        </div>
      </div>
      <div className="ccfe-container">
        <div className="ccfeItem-container">
          <div className="ccfeCheckLogo">
            <TickLogo isSelected={isSelected} itemPos={0} handleSelection={handleSelection} />
          </div>
          <div className="ccfeContent" style={{ borderColor: isSelected[0] ? '#449231' : '#C4C4C4' }} onClick={() => { handleSelection(0) }}>
            <div className="ccfe-currentVals">
              Current: <b>{counterFactuals[0]["variable"]}</b> = {counterFactuals[0]["currentVal"]} {counterFactuals[0]["unit"]}
            </div>
            <div className="ccfe-action">
              Action - {counterFactuals[0]["message"]}
            </div>
            <div className="ccfe-example">
              Other patients like <b> Patient - {counterFactuals[0]["similarPatient"]}</b> who have taken this action have <b>{counterFactuals[0]["similarPatientRisk"]}</b> risk.
            </div>
            <div className="ccfe-badge-container">
              <div className='ccfe-impact' style={{ borderColor: isSelected[0] ? '#449231' : '#C4C4C4', color: isSelected[0] ? '#449231' : '#C4C4C4' }}>
                <Tooltip title="This is an estimated reduction in risk. Please observe how the overall risk can change if you perform this action">
                  {counterFactuals[0]["riskReduction"]}% lower risk
                </Tooltip>
              </div>
              <div className='ccfe-feasibility' style={
                {
                  borderColor: isSelected[0] ?
                    (counterFactuals[0]["feasibility"] == "easy" ? '#449231' : '#D64242') : '#C4C4C4',
                  color: isSelected[0] ?
                    (counterFactuals[0]["feasibility"] == "easy" ? '#449231' : '#D64242') : '#C4C4C4'
                }}>
                <Tooltip title={"Changing from " + counterFactuals[0]["currentVal"] + "" + (counterFactuals[0]["unit"] == null ? "" : counterFactuals[0]["unit"]) + " to " + counterFactuals[0]["cfVal"] + "" + (counterFactuals[0]["unit"] == null ? "" : counterFactuals[0]["unit"]) + " is " + counterFactuals[0]["feasibility"]}>
                  {counterFactuals[0]["feasibility"]}
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div className="ccfeItem-container">
          <div className="ccfeCheckLogo">
            <TickLogo isSelected={isSelected} itemPos={1} handleSelection={handleSelection} />
          </div>
          <div className="ccfeContent" style={{ borderColor: isSelected[1] ? '#449231' : '#C4C4C4' }} onClick={() => { handleSelection(1) }}>
            <div className="ccfe-currentVals">
              Current: <b>{counterFactuals[1]["variable"]}</b> = {counterFactuals[1]["currentVal"]} {counterFactuals[1]["unit"]}
            </div>
            <div className="ccfe-action">
              Action - {counterFactuals[1]["message"]}
            </div>
            <div className="ccfe-example">
              Other patients like <b>Patient - {counterFactuals[1]["similarPatient"]}</b> who have taken this action have <b>{counterFactuals[1]["similarPatientRisk"]}</b> risk.
            </div>
            <div className="ccfe-badge-container">
              <div className='ccfe-impact' style={{ borderColor: isSelected[1] ? '#449231' : '#C4C4C4', color: isSelected[1] ? '#449231' : '#C4C4C4' }}>
                <Tooltip title="This is an estimated reduction in risk. Please observe how the overall risk can change if you perform this action">
                  {counterFactuals[1]["riskReduction"]}% lower risk
                </Tooltip>
              </div>
              <div className='ccfe-feasibility' style={
                {
                  borderColor: isSelected[1] ?
                    (counterFactuals[1]["feasibility"] == "easy" ? '#449231' : '#D64242') : '#C4C4C4',
                  color: isSelected[1] ?
                    (counterFactuals[1]["feasibility"] == "easy" ? '#449231' : '#D64242') : '#C4C4C4'
                }}>
                <Tooltip title={"Changing from " + counterFactuals[1]["currentVal"] + "" + (counterFactuals[1]["unit"] == null ? "" : counterFactuals[1]["unit"]) + " to " + counterFactuals[1]["cfVal"] + "" + (counterFactuals[1]["unit"] == null ? "" : counterFactuals[1]["unit"]) + " is " + counterFactuals[1]["feasibility"]}>
                  {counterFactuals[1]["feasibility"]}
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};