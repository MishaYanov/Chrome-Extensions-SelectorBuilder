import React, { useRef, useState, useEffect } from "react";
import { parserLogic } from "../Logic/parserLogic";
import { globalConfigBuilder } from "../Logic/GlobalConfigLogic";
import "./main.css";
import { SelectorTypes, Transitions } from "../models/enums";
import {
  ListenToMessagesFromContentJs,
  sendMessageToContentScript,
} from "../services/Messaging";
import { ElementParser } from "./element-parser/ElementParser";
import { copyToClipboard } from "../Logic/SelectorLogic";

export const Main = () => {
  //TODO: make it a case type state to go through all the windows
  //1. main view; 2. childern view; 3. history view
  const [isMainView, setIsMainView] = useState(true);

  //init tag
  const [selector, setSelector] = useState<any>("No Element Selected");
  const [attributesObjest, setAttributesObjest] = useState({});
  const [tag, setTag] = useState("");
  //TODO: send this to childeren element parser.
  const [element, setElement] = useState("");

  //building all the variables for the xpath/css selector.
  const [chosenAttributes, setChosenAttributes] = useState({});
  const [globalConfig, setGlobalConfig] = useState<any>({include: false, querySelector:false});

  //TODO: history container having all the selectors previously selected in this session.
  const [selectorHistory, setSelectorHistory] = useState([]);


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
        const elementConfig = JSON.parse(result.ContentData);
        setSelector(elementConfig.completeTag);
        const attributes = parserLogic.getElementAttributes(
          elementConfig.attributes
        );
        setAttributesObjest(attributes);
        setTag(elementConfig.tag);
        setElement(elementConfig.element);
      }
    });
  }, []);

  function manageSelectorConstruction(action: any, key: string, value: any) {
    if (action === true) {
      const newState = { ...chosenAttributes, [key]: value }
      setChosenAttributes(newState);
    }
    if (action === false) {
      const newState = Object.fromEntries(
        Object.entries(chosenAttributes).filter(([k]) => k !== key)
      );
      setChosenAttributes(newState);
    }
    console.log(chosenAttributes);
  }

  function addGlobalConfig(event: any, type: string) {
    switch (type) {
      case "include":
        if (event === true) {
          const newGlobalConfig = {...globalConfig, include: true};
          setGlobalConfig(newGlobalConfig);
        }
        if (event === false) {
          const newGlobalConfig = {...globalConfig, include: false};
          setGlobalConfig(newGlobalConfig);
        }
        break;
      case "itiration":
        if (event == 0) {
          break;
        } else {

        }
        break;
      case "addQuerySelector":
        if (event === true) {
          const newGlobalConfig = {...globalConfig, querySelector: true};
          setGlobalConfig(newGlobalConfig);
        }
        if (event === false) {
          const newGlobalConfig = {...globalConfig, querySelector: false};
          setGlobalConfig(newGlobalConfig);
        }
        break;
    }
  }

  const startCopyProcess = (selectorType: string) => {
    if (selectorType === SelectorTypes.CSS) {
      const builtSelector = parserLogic.createCssSelector(chosenAttributes, tag, globalConfig);
      copyToClipboard(builtSelector);
    }
    if (selectorType === SelectorTypes.XPATH) {
      const builtSelector = parserLogic.createXpathSelector(chosenAttributes, tag, globalConfig);
      copyToClipboard(builtSelector);
    }
  };






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
              onClick={(el:any) => {
                addGlobalConfig(el.target.checked, "include");
              }}
            />
          <div className="option">
            <label>2.Add Query Selector: </label>
            <input
              type="checkbox"
              id="include"
              onClick={(el:any) => {
                addGlobalConfig(el.target.checked, "addQuerySelector");
              }}
            />
            </div>
            <div className="option">
            <label>3.Loop:</label>
            <span>Every  <input className="selector-input" type="number" min={0}/> Times.</span>
            <span>Start From  <input className="selector-input" type="number" min={0} /> Element.</span>
            </div>
          </div>
        </div>
        <div className="traverse">
          <h4>change Element</h4>
          <input type="button" value={isMainView?"Parse Children":"Back to Selector"} className="btn btn-main" onClick={()=>{
            setIsMainView(!isMainView);
          }}/>
        </div>
      </div>
      <div className="element-description">
        <h4>Element Chosen: {selector}</h4>
      </div>
      {/* TODO: create the table in separate component */}
      {isMainView && 
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
                            //@ts-ignore
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
          }
          {/* TODO: build the element parser */}
      {!isMainView &&
        <ElementParser htmlString={element} ></ElementParser>
      }
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
              setTag("");
              //TODO: set storage to empty string
            }}
          />
        </div>
      </div>
    </div>
  );
};
