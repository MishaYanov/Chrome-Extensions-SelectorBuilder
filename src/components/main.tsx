import React, { useRef, useState } from "react";
import { parserLogic } from "../Logic/parserLogic";
import { globalConfigBuilder } from "../Logic/GlobalConfigLogic";
import "./main.css";
import { transitions } from "../Logic/transitionLogic";
import { SelectorTypes, Transitions } from "../models/enums";

export const Main = () => {
  const [selector, setSelector] = useState<any>("No Element Selected");
  const [attributesObjest, setAttributesObjest] = useState({});
  // const [];
  const [globalConfig, setGlobalConfig] = useState<any>({});

  function startSelectionProcess() {
    //send message to content js

    //recive message from content js

    const attrObj: any = parserLogic.getElementAttributes(selector);
    setAttributesObjest(attrObj);
  }

  function cahngeRelativeElement(newPos: string) {
    switch (newPos) {
      case "":
        transitions.moveToFirstChild(selector);
      case "":
        transitions.moveToLastChild(selector);
      case "":
        transitions.moveToNextSibling(selector);
      case "":
        transitions.moveToPreviousSibling(selector);
      case "":
        transitions.moveToParentElement(selector);
    }
  }

    const startCopyProcess = (selectorType: string) => {
      const finalizedConfig = globalConfigBuilder.buildGlobalConfigObject(globalConfig);

      if (selectorType === SelectorTypes.CSS) {

      };
      if (selectorType === SelectorTypes.XPATH) {

      };
    };

    function globalAction(newConfig: any, isToggled: any = null) {};


  return (
    <div className="container">
      <div className="header">
        <h2>Selector Builder</h2>
      </div>
      <div className="action-Panel">
        <div className="global-options">
          <h4>Global Options:</h4>
          <div className="option">
            <label>1.add include</label>
            <input type="checkbox" id="include" onClick={(el) => {}} />
            <label>2. loop every: </label>
            <input type="number" />
          </div>
        </div>
        <div className="traverse">
          <h4>change Element</h4>
          <input
            type="button"
            className="btn btn-secondary"
            value="Parent Element"
            onClick={() => {
              cahngeRelativeElement(Transitions.PARENT);
            }}
          />
          <input
            type="button"
            className="btn btn-secondary"
            value="Next Element"
            onClick={() => {
              cahngeRelativeElement(Transitions.NEXT);
            }}
          />
          <input
            type="button"
            className="btn btn-secondary"
            value="Previous Element"
            onClick={() => {
              cahngeRelativeElement(Transitions.PREVIOUS);
            }}
          />
          <input
            type="button"
            className="btn btn-secondary"
            value="First Element"
            onClick={() => {
              cahngeRelativeElement(Transitions.FIRST);
            }}
          />
          <input
            type="button"
            className="btn btn-secondary"
            value="Last Element"
            onClick={() => {
              cahngeRelativeElement(Transitions.LAST);
            }}
          />
        </div>
      </div>
      <div className="element-description">
        <h4>Element Chosen: {selector}</h4>
      </div>
      <div className="attributes-container">
        <table>
          <thead>
            <td>Attribute Name</td>
            <td>Attribute Value</td>
            <td>Select Value</td>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div className="bot-container">
        <div className="element-selector">
          <input
            type="button"
            className="btn btn-main"
            value="Start Selecting"
            id="select-element-button"
            onClick={() => {
              startSelectionProcess();
            }}
          />
        </div>
        <div className="finalize-Action">
          <input
            type="button"
            className="btn btn-success"
            value="Copy to ClipBoard As Xpath"
            id="copyBtn"
            onClick={() => {
              startCopyProcess(SelectorTypes.XPATH);
            }}
          />
          <input
            type="button"
            className="btn btn-success"
            value="Copy to ClipBoard As CSS"
            id="copyBtn"
            onClick={() => {
              startCopyProcess(SelectorTypes.CSS);
            }}
          />
          <input
            type="button"
            className="btn btn-secondary"
            value="Clear"
            id="clearBtn"
            onClick={() => {
              setSelector("No Element Selected");
            }}
          />
        </div>
      </div>
    </div>
  );
          }

