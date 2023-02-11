import { SelectorTypes } from "../models/enums";
//TODO: make it more efficent and readable
export const parserLogic = {
  getElementAttributes: (element: any) => {
    const attributes: any = {};
    Object.keys(element).map((key) => {
      console.log(key);
      if (key != "style") {
        const values = element[key]?.split(" ");
        if (values.length > 1) {
          for (let i = 0; i < values.length; i++) {
            //add postfix for multiple amount of classes
            const newkey = key + " " + i;
            attributes[newkey] = values[i];
          }
        } else if (values.length === 1) {
          attributes[key] = values;
        } else {
          attributes[key] = "";
        }
      }
    });
    return attributes;
  },
  concatSimilarValues: (attributes: any) => {
    const allSelectedAttributes: any = {};
    for (const key in attributes) {
      const realKey: any = key.split(" ")[0];
      if (allSelectedAttributes.hasOwnProperty(realKey)) {
        //if there is class for example add value to it
        allSelectedAttributes[realKey] += " " + attributes[key];
      } else {
        allSelectedAttributes[realKey] = attributes[key];
      }
    }
    return allSelectedAttributes;
  },
  createCssSelector: (attributes: any, tag: any, globalConfig: any) => {
    console.log(globalConfig);
    let inculdeOperator: string = "";
    let QuerySelectorOperator: string[] = ["", ""];

    if (globalConfig?.include === true) {
      inculdeOperator = "*";
    }
    let selector = tag?.toLowerCase();
    const concatedValues = parserLogic.concatSimilarValues(attributes);
    for (const key in concatedValues) {
      if (concatedValues.hasOwnProperty(key)) {
        selector += `[${key}${inculdeOperator}="${concatedValues[key]}"]`;
      } else if (
        concatedValues.hasOwnProperty(key) &&
        concatedValues[key].length === 0
      ) {
        selector += `[${key}]`;
      }
    }
    console.log(selector);
    if (globalConfig?.querySelector === true) {
      QuerySelectorOperator[0] = "document.querySelector('";
      QuerySelectorOperator[1] = "')";
      return `${QuerySelectorOperator[0]}${selector}${QuerySelectorOperator[1]}`;
    }
    if(globalConfig?.loop.event===true){
      const loopOperator = `:nth-of-type(${globalConfig.loop.loop}n + ${globalConfig.loop.start})`
      selector += loopOperator;
    }
    return selector;
  },
  createXpathSelector: (attributes: any, tag: string, globalConfig: any) => {
    let QuerySelectorOperator: string[] = ["", ""];
    let selector = `//${tag?.toLowerCase()}`;
    const concatedValues = parserLogic.concatSimilarValues(attributes);
    for (const key in concatedValues) {
      if (
        concatedValues.hasOwnProperty(key) &&
        concatedValues[key].length !== 0
      ) {
        if (globalConfig.include === true) {
          selector += `[contains(@${key}, '${concatedValues[key]}')]`;
        } else if (globalConfig.include === false) {
          selector += `[@${key}='${concatedValues[key]}']`;
        }
      } else {
        selector += `[@${key}=']`;
      }
    }
    if (globalConfig?.querySelector === true) {
      QuerySelectorOperator[0] = 'document.evaluate("';
      QuerySelectorOperator[1] =
        '", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;';
      return `${QuerySelectorOperator[0]}${selector}${QuerySelectorOperator[1]}`;
    }
    if(globalConfig?.loop.event===true){
      const loopOperator = `[position() - ${globalConfig.loop.start} mod ${globalConfig.loop.loop} = 0 and position() >= ${globalConfig.loop.start}]`;
      selector += loopOperator;
    }
    return selector;
  },
  getAllAttributesAndValues:(element: any)=>{
    const attrKV:any | string[] = {}
    for(let i = 0; i < element.attributes.length; i++){
      const curEl = element.attributes[i];
      const attrValues = curEl.value.replace(/\\&quot;|\\/g, "");;
      attrKV[curEl.name] = attrValues;
    }
    return attrKV;
  }
};

export const treeViewParser = {
  createTree: (element: any, level = 0) => {
    const button = document.createElement("button");
    button.textContent = element.tagName;
    document.body.appendChild(button);
    for (const child of element.children) {
      treeViewParser.createTree(child, level + 1);
    }
  },
  parseNewView: (htmlString: string) => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, "text/html");
    treeViewParser.createTree(htmlDoc.body);
  },
};
