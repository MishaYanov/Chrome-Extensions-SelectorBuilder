import React, { useEffect, useState } from "react";

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
console.log(props.htmlString);
  useEffect(() => {
    (() => {
      debugger
      if(props.htmlString.length > 0){
        setHtmlString(props.htmlString);
        setParsedHtml(parser.parseFromString(props.htmlString, "text/html"));
        console.log(parsedHtml);
      }
    })()
  }, [htmlString]);
  //TODO: copy the logic from contentjs to parse new html string
  const createTree = (element: Element, level: number = 0, spacing:string="--") => {
    return (
      <div>
        {"|"}{spacing}<button className="btn btn-warning btn-bot-space" onClick={() => selectElement(element)}>
          {" ".repeat(level) + element.tagName}
        </button>
        {Array.from(element.children).map((child: Element) =>
          createTree(child, level + 1, spacing+"--")
        )}
      </div>
    );
  };
  function selectElement(el: Element) {
    console.log(el);
    
  }
  return (
    <div className="">
      {htmlString.length === 0 && (
        <div className="element-praser__container">
          <h1>No Element Selected</h1>
        </div>
      )}
      {htmlString.length > 0 && (
        <div className="element-praser__container">
          <p>{htmlString}</p>
          <br /><br />
          <textarea value={htmlString} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHtmlString(e.target.value)}/>
          <div>{createTree(parsedHtml.body)}</div>
        </div>
      )}
    </div>
  );
};
