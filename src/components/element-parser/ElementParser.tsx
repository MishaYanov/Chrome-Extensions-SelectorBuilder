import React, { useEffect, useState } from "react";
import { treeViewParser } from "../../Logic/parserLogic";
// import {Attr} from 'lib.dom.d.ts'


export const ElementParser = (props: any) => {
  const [htmlString, setHtmlString] = useState("");


  const [htmlDoc, setHtmlDoc] = useState<any>();
  const [selected, setSelected] = useState<Element | null>(null);
  const [attributes, setAttributes] = useState({});

  let htmlStringPreParse: string = props.htmlString;
  const parser = new DOMParser();

  useEffect(() => {
    debugger;
    htmlStringPreParse = props.htmlString;
    console.log(htmlStringPreParse);
    if (htmlStringPreParse.length > 0) {
      setHtmlDoc(parser.parseFromString(htmlStringPreParse, "text/html"));
    }
  }, [htmlStringPreParse]);

  const createTree = (element: Element, level: number = 0) => {
    return (
      <div>
        <button onClick={() => selectElement(element)}>
          {"  ".repeat(level) + element.tagName}
        </button>
        {Array.from(element.children).map((child: Element) =>
          createTree(child, level + 1)
        )}
      </div>
    );
  };

  const selectElement = (el: Element) => {
    setSelected(el);
    setAttributes(
      Array.from(el.attributes).reduce(
        (acc: object, { name, value }: Attr) => ({ ...acc, [name]: value }),
        {}
      )
    );
  };
  return <div className="element-praser__container">
    <textarea value={htmlString} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHtmlString(e.target.value)}/>
      <div>{createTree(htmlDoc.body)}</div>
      <div>Selected: {selected ? selected.tagName : 'None'}</div>
      <div>Attributes: {JSON.stringify(attributes)}</div>
  </div>;
};
