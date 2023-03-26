import { SelectorTypes } from "../models/enums";
//TODO: make it more efficent and readable
export const parserLogic = {
  getElementAttributes: (element: any) => {
    const attributes: any = {};
    console.log("%cElements: " + element, "font-size:18");
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
    const uniqueKeys = parserLogic.getUniqueKeys(attributes);
    const allSelectedAttributes: any = {};
    
    uniqueKeys.map((key: any) => {
      //get all attribute values for the current key and sort by the suffix
      let values = Object.keys(attributes).filter((attr) => attr.includes(key));
      if (values.length > 1) {
        // is only one, no need to sort
        values = values.sort((a, b) => {
          const aSuffix: any = a.split(" ")[1];
          const bSuffix: any = b.split(" ")[1];
          return aSuffix - bSuffix;
        });
        //concat all values with the sorted vallues and that value in atttributes object
        let concatedValues: string = "";
        values.forEach((value) => {
          if (concatedValues) {
            concatedValues += " " + attributes[value];
          } else {
            concatedValues = attributes[value];
          }
        });

        allSelectedAttributes[key] = concatedValues;
      } else {
        allSelectedAttributes[key] = attributes[values[0]];
      }
    });
    return allSelectedAttributes;
  },
  getUniqueKeys: (attributes: any) => {
    const uniqueKeys: any = [];
    for (const key in attributes) {
      const realKey: any = key.split(" ")[0];
      if (!uniqueKeys.includes(realKey)) {
        uniqueKeys.push(realKey);
      }
    }
    return uniqueKeys;
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
      if (globalConfig?.has?.event) {
        if (key === globalConfig?.has?.connectAttribute) {
          selector += `:has(${globalConfig?.has?.selector})`;
        }
        if (globalConfig?.has?.connectAttribute.length === 0) {
          selector += `:has(${globalConfig?.has?.selector})`;
        }
      }
      if (globalConfig?.not?.event) {
        if (key === globalConfig?.not?.connectAttribute) {
          selector += `:not(${globalConfig?.not?.selector})`;
        }
        if (globalConfig?.not?.connectAttribute.length === 0) {
          selector += `:not(${globalConfig?.not?.selector})`;
        }
      }
    }
    if (globalConfig?.loop.event === true) {
      const loopOperator = `:nth-of-type(${globalConfig.loop.loop}n + ${globalConfig.loop.start})`;
      selector += loopOperator;
    }
    if (globalConfig?.querySelector === true ||  globalConfig?.querySelectorAll === true) {
      globalConfig?.querySelectorAll === true
        ? (QuerySelectorOperator[0] = "document.querySelectorAll('")
        : (QuerySelectorOperator[0] = "document.querySelector('");
      QuerySelectorOperator[1] = "')";
      return `${QuerySelectorOperator[0]}${selector}${QuerySelectorOperator[1]}`;
    }
    console.log(selector);
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
      if (globalConfig?.not?.event) {
        if (key === globalConfig?.not?.connectAttribute) {
          selector += `[not(${globalConfig?.not?.selector})]`;
        }
        if (globalConfig?.not?.connectAttribute.length === 0) {
          selector += `[not(${globalConfig?.not?.selector})]`;
        }
      }
      if (globalConfig?.has?.event) {
        if (key === globalConfig?.has?.connectAttribute) {
          selector += `[${globalConfig?.has?.selector}]`;
        }
        if (globalConfig?.has?.connectAttribute.length === 0) {
          selector += `[${globalConfig?.has?.selector}]`;
        }
      }
    }
    if (globalConfig?.loop.event === true) {
      const loopOperator = `[position() - ${globalConfig.loop.start} mod ${globalConfig.loop.loop} = 0 and position() >= ${globalConfig.loop.start}]`;
      selector += loopOperator;
    }
    if (globalConfig?.querySelector === true ||  globalConfig?.querySelectorAll === true) {
      QuerySelectorOperator[0] = 'document.evaluate("';
      globalConfig.querySelectorAll === true
        ? (QuerySelectorOperator[1] =
            '", document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null).singleNodeValue;')
        : (QuerySelectorOperator[1] =
            '", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;');
      return `${QuerySelectorOperator[0]}${selector}${QuerySelectorOperator[1]}`;
    }
    return selector;
  },
  getAllAttributesAndValues: (element: any) => {
    const attrKV: any | string[] = {};
    for (let i = 0; i < element.attributes.length; i++) {
      const curEl = element.attributes[i];
      const attrValues = curEl.value.replace(/\\&quot;|\\/g, "");
      attrKV[curEl.name] = attrValues;
    }
    return attrKV;
  },
};

export const treeViewParser = {
createTree: (element: any, level = 0) => {
    if (element instanceof HTMLElement) {
        const button = document.createElement("button");
        button.textContent = element.tagName;
        document.body.appendChild(button);
        const children = Array.from(element.childNodes); // Convert HTMLCollection to an array
        for (const child of children) {
            if (child instanceof HTMLElement) {
                treeViewParser.createTree(child, level + 1);
            }
        }
    }
},
  parseNewView: (htmlString: string) => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlString, "text/html");
    treeViewParser.createTree(htmlDoc.body);
  },
};
