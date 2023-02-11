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
 * @todo
 * 1. Add a button to the element that allows the user to select it.
 * 2. Add a button to the element that allows the user to deselect it.
 * 3. Add a button to the element that allows the user to select all its children.
 * 4. Add a button to the element that allows the user to deselect all its children.
 */
export const ElementParser = (props: any) => {
  const parser = new DOMParser();
  //html sting from the innerHTML of the element
  const [htmlString, setHtmlString] = useState<string>("");
  const [parsedHtml, setParsedHtml] = useState<any>();

  const [newElementChosen, setNewElementCohsen] = useState<any>();

  console.log(props.htmlString);
  useEffect(() => {
    (() => {
      debugger;
      if (props.htmlString.length > 0) {
        setHtmlString(props.htmlString);
        setParsedHtml(parser.parseFromString(props.htmlString, "text/html"));
        console.log(parsedHtml);
      }
    })();
  }, [htmlString]);
  //TODO: copy the logic from contentjs to parse new html string
  const createTree = (
    element: Element,
    level: number = 0,
    spacing: string = "--"
  ) => {
    return (
      <div>
        {"|"}
        {spacing}
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
        {Array.from(element.children).map((child: Element) =>
          createTree(child, level + 1, spacing + "--")
        )}
      </div>
    );
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
                }
              }}
            />
          </div>
          <div className="element-praser__container">
            <div>{createTree(parsedHtml.body)}</div>
          </div>
        </>
      )}
    </div>
  );
};

/** old solution
 *     debugger
    if(!el) return;
    console.log(el);
    const filter = /<(.*?)>/;
    // @ts-ignore
    const elementAttr = filter.exec(el.outerHTML)[1];
    //remove \"
    const elementAttr2 = elementAttr.replace(/\\&quot;|\\/g, "");
    const outer = el.outerHTML.replace(/<([a-zA-Z][a-zA-Z0-9]*)(?=[^>]*?>)(?![^<]*?<\/\1>)[^>]*?>|\\&quot;|&lt;|&gt;\\/g, "");
    console.log(elementAttr ,elementAttr2);
    const ElementMap = parserLogic.getAllAttributesAndValues(el);
    const ElementMapClean = ElementMap;
    setNewElementCohsen(`<${elementAttr2}>`);
    const elementInfo = {
      element: JSON.stringify(outer),
      completeTag: `<${elementAttr2}>`,
      tag: el.tagName,
      attributes: ElementMapClean,
    }
    console.log(elementInfo);
 */
