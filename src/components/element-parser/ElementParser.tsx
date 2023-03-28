import React, { useEffect, useState } from "react";
import "./elementparser.css";
import { log } from "console";
import { sendMessageToContentScript } from "../../services/Messaging";
import { parserLogic } from "../../Logic/parserLogic";
import { isDisabled } from "@testing-library/user-event/dist/utils";

/**
 * @param {string} htmlString
 * @returns {JSX.Element}
 * @constructor
 * @description
 * This component is responsible for parsing the html string and displaying it in a tree view.
 * It also allows the user to select an element and see its attributes.
 * */
export const ElementParser = (props: any) => {
  const parser = new DOMParser();
  //html sting from the innerHTML of the element
  const [htmlString, setHtmlString] = useState<string>("");
  const [parsedHtml, setParsedHtml] = useState<any>();

  const [newElementChosen, setNewElementCohsen] = useState<any>();

  console.log(props.htmlString);
  useEffect(() => {
    (() => {
      if (props.htmlString.length > 0) {
        setHtmlString(props.htmlString);
        setParsedHtml(parser.parseFromString(props.htmlString, "text/html"));
        console.log(parsedHtml);
      }
    })();
  }, [htmlString]);

  useEffect(() => {
    if (props.isClear) {
      setHtmlString("");
      setParsedHtml("");
      setNewElementCohsen("");
      const treeDiv = document.getElementById("tree-element");
      if (treeDiv) {
        treeDiv.parentNode?.removeChild(treeDiv);
      }
      props.onClearDone();
    }
  }, [props.isClear, props.onClearDone]);
  //TODO: copy the logic from contentjs to parse new html string
  const createTree = (
    element: Element | HTMLElement,
    level: number = 0,
    spacing: string = "--"
  ) => {
    if (!element) return;
    if (element.tagName === "SCRIPT") return;
    if (element.tagName === "STYLE") return;
    if (element.tagName === "HEAD") return;
    if (element.tagName === "HTML") return;
    if (element.tagName === "META") return;
    if (element.tagName === "LINK") return;
    if (element.tagName === "TITLE") return;
    if (element.tagName === "BASE") return;
    if (element.tagName === "NOSCRIPT") return;
    if (element.tagName === "TEMPLATE") return;
    if (element instanceof Element) {
      return (
        <div>
          {/* //check if dom element instance */}
          {"|"}
          {spacing}
          {element.tagName !== "BODY" && (
            <button
              className="btn btn-warning btn-bot-space special_tree_btn"
              onClick={() => selectElement(element)}
              onMouseEnter={() => {
                handleMouseEnter(element);
              }}
              onMouseLeave={() => {
                handleMouseLeave(element);
              }}
            >
              {" ".repeat(level) + element.tagName}
            </button>
          )}
          {Array.from(element.children).map((child: Element) =>
            createTree(child, level + 1, spacing + "--")
          )}
        </div>
      );
    }
  };
  function selectElement(elm: Element) {
    if (!elm) return;
    const position = elm!.getAttribute("ext-el-pos")!.replace(/\\|"/g, "");
    sendMessageToContentScript(
      { type: "selectElement", position: position },
      ""
    );
  }
  //TODO: add new solution for selecting element -> number all the elements with custom attribute and select by that
  function handleMouseEnter(elm: Element) {
    if (!elm) return;
    const position = elm!.getAttribute("ext-el-pos");
    console.log(position);
    const filteredPosition = position!.replace(/\\|"/g, "");
    console.log(filteredPosition);
    sendMessageToContentScript(
      { type: "highlightElement", position: filteredPosition },
      ""
    );
  }
  function handleMouseLeave(elm: Element) {
    if (!elm) return;
    const position = elm!.getAttribute("ext-el-pos")!.replace(/\\|"/g, "");
    sendMessageToContentScript(
      { type: "unhighlightElement", position: position },
      ""
    );
  }
  function updateMain(elm: Element) {
    if (!elm) return;
    const getPosition = elm!.getAttribute("ext-el-pos")!.replace(/\\|"/g, "");
    sendMessageToContentScript({ type: "updateMain", element: elm }, "");
  }

  return (
    <div className="">
      {htmlString.length === 0 && (
        <div className="element-praser__container">
          <h1>No Element Selected</h1>
        </div>
      )}
      {htmlString.length > 0 && (
        <>
          <div className="description">
            <h4>Child Element Chosen: {newElementChosen}</h4>
          </div>
          <div className="element-praser__new_element">
            <input
              type="button"
              className={newElementChosen ? "btn btn-main" : "btn btn-disabled"}
              value="Select Element"
              id="select-element-button"
              onClick={() => {
                if (newElementChosen) {
                  //TODO: exchange the logic of the saved element
                }
              }}
            />
          </div>
          <div className="element-praser__container">
            <div id="tree-element">{createTree(parsedHtml.body)}</div>
          </div>
        </>
      )}
    </div>
  );
};
