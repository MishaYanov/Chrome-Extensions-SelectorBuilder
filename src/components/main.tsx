import React, { useRef, useState, useEffect } from "react";
import { parserLogic } from "../Logic/parserLogic";
import { globalConfigBuilder } from "../Logic/GlobalConfigLogic";
import "./main.css";
import { transitions } from "../Logic/transitionLogic";
import { SelectorTypes, Transitions } from "../models/enums";
import {
  ListenToMessagesFromContentJs,
  sendMessageToContentScript,
} from "../services/global";

export const Main = () => {
  const [selector, setSelector] = useState<any>("No Element Selected");
  const [selectorHistory, setSelectorHistory] = useState([]);
  const [attributesObjest, setAttributesObjest] = useState({});

  //building all the variables for the xpath/css selector.
  const [chosenAttributes, setChosenAttributes] = useState({});
  const [globalConfig, setGlobalConfig] = useState<any>({});

  function startSelectionProcess() {
    //send message to content js
    sendMessageToContentScript("selectAllElements", "AllElements");
    window.close();
  }

  useEffect(() => {
    //get all data from local storage and console log it.
    chrome.storage.session.get(["ContentData"], function (result) {
      if (result.ContentData === undefined) {
        console.log("no data");
      } else {
        console.log(result.ContentData);
        const elementConfig = JSON.parse(result.ContentData);
        debugger
        setSelector(elementConfig.completeTag);
        const attributes = parserLogic.getElementAttributes(
          elementConfig.attributes
        );
        setAttributesObjest(attributes);
      }
    });
  }, []);


  function manageSelectorConstruction(action: any, key: string, value: any) {
    console.log(action);
    if (action === true) {
      setChosenAttributes({ ...attributesObjest, [key]: value });
    }
    if (action === false) {
      const newState = Object.fromEntries(
        Object.entries(attributesObjest).filter(([k]) => k !== key)
      );
      setChosenAttributes(newState);
    }
    console.log(chosenAttributes);
  }

  function addGlobalConfig(event: any, type: string) {
    switch (type) {
      case "include":
        if (event === true) {
        }
        if (event === false) {
        }
        break;
      case "itiration":
        if (event == 0) {
        } else {
        }
        break;
      case "addQuerySelector":
        if (event === true) {
        }
        if (event === false) {
        }
        break;
    }
  }

  const startCopyProcess = (selectorType: string) => {
    if (selectorType === SelectorTypes.CSS) {
    }
    if (selectorType === SelectorTypes.XPATH) {
    }
  };

  function globalAction(newConfig: any, isToggled: any = null) {}

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
            <input
              type="checkbox"
              id="include"
              onClick={(el) => {
                //@ts-ignore
                addGlobalConfig(el.target.checked, "include");
              }}
            />
            <label>2. loop every: </label>
            <input type="number" />
          </div>
        </div>
        <div className="traverse">
          <h4>change Element</h4>
          <div className="show-children">
            show children
          </div>
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
          <tbody>
            {Object.keys(attributesObjest).map((key) => {
              return (
                <tr key={key}>
                  <td>{key}</td>
                  {/* @ts-ignore */}
                  <td>{attributesObjest[key]}</td>
                  <td>
                    <input
                      className="attr-checkbox"
                      type="checkbox"
                      onClick={(el: any) => {
                        manageSelectorConstruction(
                          el.target.checked,
                          key,
                          //@ts-ignore
                          attributesObjest[key]
                        );
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
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
            className="btn btn-success btn-wide"
            value="Copy to ClipBoard As Xpath"
            id="copyBtn"
            onClick={() => {
              startCopyProcess(SelectorTypes.XPATH);
            }}
          />
          <input
            type="button"
            className="btn btn-success btn-wide"
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
              setAttributesObjest({});
              setChosenAttributes({});
            }}
          />
        </div>
      </div>
    </div>
  );
};
