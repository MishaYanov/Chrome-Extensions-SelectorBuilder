import React, { useRef, useState, useEffect } from "react";
import { parserLogic } from "../Logic/parserLogic";
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
  const containerRef = useRef<HTMLDivElement>(null);
  //1. main view; 2. childern view; 3. history view
  const [isMainView, setIsMainView] = useState(true);

  //option uses
  const [isInclude, setIsInclude] = useState(false);
  const [isQuerySelector, setIsQuerySelector] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [nthConf, setNthConf] = useState({
    loop: "0",
    start: "0",
  });

  //init tag
  const [selector, setSelector] = useState<any>("No Element Selected");
  const [attributesObjest, setAttributesObjest] = useState({});
  const [tag, setTag] = useState("");
  //TODO: send this to childeren element parser.
  const [element, setElement] = useState("");

  //building all the variables for the xpath/css selector.
  const [chosenAttributes, setChosenAttributes] = useState({});
  const [globalConfig, setGlobalConfig] = useState<any>({
    include: false,
    querySelector: false,
    loop: { event: false, start: 0, loop: 0 },
  });

  const loopBtnRef = useRef<HTMLDivElement>(null);
  //TODO: history container having all the selectors previously selected in this session.
  const [selectorHistory, setSelectorHistory] = useState([]);

  function startSelectionProcess() {
    //send message to content js
    sendMessageToContentScript("selectAllElements", "AllElements");
    window.close();
  }

  useEffect(() => {
    //get all data from local storage and console log it.
    getDataAndLoad();
  }, []);

  useEffect(() => {
    if (isMainView) {
      containerRef.current?.classList.remove("container-tree_view");
      document.body.classList.remove("container-tree_view");
    }
    if (!isMainView) {
      containerRef.current?.classList.add("container-tree_view");
      document.body.classList.add("container-tree_view");
    }
  }, [isMainView]);

  function getDataAndLoad(): void {
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
  }

  function manageSelectorConstruction(action: any, key: string, value: any) {
    if (action === true) {
      const newState = { ...chosenAttributes, [key]: value };
      setChosenAttributes(newState);
    }
    if (action === false) {
      const newState = Object.fromEntries(
        Object.entries(chosenAttributes).filter(([k]) => k !== key)
      );
      setChosenAttributes(newState);
    }
  }

  function addGlobalConfig(type: string) {
    console.log(type);
    switch (type) {
      case "include":
        const curRenderValueInclude = !isInclude;
        setIsInclude(!isInclude);
        if (curRenderValueInclude === true) {
          const newGlobalConfig = {
            ...globalConfig,
            include: curRenderValueInclude,
          };
          setGlobalConfig(newGlobalConfig);
        }
        if (curRenderValueInclude === false) {
          const newGlobalConfig = {
            ...globalConfig,
            include: curRenderValueInclude,
          };
          setGlobalConfig(newGlobalConfig);
        }
        break;
      case "itiration":
        const curRenderValueLoop = !isLoop;
        setIsLoop(!isLoop);
        if (curRenderValueLoop === true) {
          const newGlobalConfig = {
            ...globalConfig,
            loop: { event: curRenderValueLoop, start: nthConf.start, loop: nthConf.loop },
          };
          setGlobalConfig(newGlobalConfig);
        }
        if (curRenderValueLoop === false) {
          const newGlobalConfig = { ...globalConfig, loop: { event: curRenderValueLoop } };
          setGlobalConfig(newGlobalConfig);
        }
        break;
      case "addQuerySelector":
        console.log(isQuerySelector);
        const curRenderValueSelector = !isQuerySelector;
        console.log(curRenderValueSelector)
        setIsQuerySelector(!isQuerySelector);
        if (curRenderValueSelector === true) {
          const newGlobalConfig = { ...globalConfig, querySelector: curRenderValueSelector };
          setGlobalConfig(newGlobalConfig);
        }
        if (curRenderValueSelector === false) {
          const newGlobalConfig = { ...globalConfig, querySelector: curRenderValueSelector };
          setGlobalConfig(newGlobalConfig);
        }
        break;
    }
  }

  const startCopyProcess = (selectorType: string) => {
    if (selectorType === SelectorTypes.CSS) {
      const builtSelector = parserLogic.createCssSelector(
        chosenAttributes,
        tag,
        globalConfig
      );
      copyToClipboard(builtSelector);
    }
    if (selectorType === SelectorTypes.XPATH) {
      const builtSelector = parserLogic.createXpathSelector(
        chosenAttributes,
        tag,
        globalConfig
      );
      copyToClipboard(builtSelector);
    }
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="header">
        <h2>Selector Builder</h2>
      </div>

      <div className="action-Panel">
        {isMainView && (
          <>
            <h4>Global Options:</h4>
            <div className="global-options">
              <div
                className={isInclude ? "option option-active" : "option"}
                onClick={() => {
                  addGlobalConfig("include");
                }}
              >
                <h4>Add contains</h4>{" "}
              </div>
              <div
                className={isQuerySelector ? "option option-active" : "option"}
                onClick={() => {
                  addGlobalConfig("addQuerySelector");
                }}
              >
                <h4>Add Query Selector</h4>{" "}
              </div>
              {/*  */}
              <div
                className={isLoop ? "option option-active" : "option"}
                onClick={(e: any) => {
                  console.log(nthConf);
                  if (parseInt(nthConf.loop) === 0 && parseInt(nthConf.start) === 0) {
                    e.target.classList.add("error-flash-red");
                    setTimeout(() => {
                      e.target.classList.remove("error-flash-red");
                    }, 500);
                  }else{
                    addGlobalConfig("itiration");
                  }
                }}
                ref={loopBtnRef}
              >
                <h4>
                  Loop Every:{" "}
                  <input
                    type="number"
                    min={0}
                    value={nthConf.loop}
                    className="nth-input"
                    name=""
                    id=""
                    onChange={(e) => {
                      e.stopPropagation();
                      setNthConf({ ...nthConf, loop: e.target.value });
                    }}
                  />{" "}
                  Starting with:{" "}
                  <input
                    type="number"
                    min={0}
                    value={nthConf.start}
                    onChange={(e) => {
                      e.stopPropagation();
                      setNthConf({ ...nthConf, start: e.target.value });
                    }}
                    className="nth-input"
                    name=""
                    id=""
                  />
                </h4>
              </div>
            </div>
          </>
        )}
        <div className="tabs">
          <div
            className={isMainView ? "tab tab-active" : "tab"}
            onClick={() => {
              setIsMainView(true);
            }}
          >
            <h4>Selector Options</h4>
          </div>
          <div
            className={!isMainView ? "tab tab-active" : "tab"}
            onClick={() => {
              setIsMainView(false);
            }}
          >
            <h4>View Children</h4>
          </div>
        </div>
      </div>
      <div className="element-description">
        <h4>Element Chosen: {selector}</h4>
      </div>
      {/* TODO: create the table in separate component */}
      {isMainView && (
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
      )}
      {/* TODO: build the element parser */}
      {!isMainView && <ElementParser htmlString={element}></ElementParser>}
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
              chrome.storage.local.set({ ContentData: "" });
            }}
          />
        </div>
      </div>
    </div>
  );
};


// document.querySelector('div[class="s-prose js-post-body"]')