const parserLogic = {
  getElementAttributes: (element) => {
    const attributes = {};
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      const values = attr.value.split(" ");
      attributes[attr.name] = values.length > 1 ? values : attr.value;
    }
    return attributes;
  },
  concatSameAttributes: (attributes) => {
    const sameAttributes = {};
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        const value = attributes[key];
        if (sameAttributes.hasOwnProperty(value)) {
          sameAttributes[value].push(key);
        } else {
          sameAttributes[value] = [key];
        }
      }
    }
    return sameAttributes;
  },
  createCssSelector: (attributes, attributeName, tag) => {
    let selector = tag;
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (key === attributeName) {
          selector += `[${key}="${attributes[key]}"]`;
        } else {
          selector += `[${key}=${attributes[key]}]`;
        }
      }
    }
    return selector;
  },
  createXpathSelector: (attributes, attributeName, tag) => {
    let selector = `//${tag}`;
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (key === attributeName) {
          selector += `[@${key}="${attributes[key]}"]`;
        } else {
          selector += `[@${key}="${attributes[key]}"]`;
        }
      }
    }
    return selector;
  },
  copyToClipboard: (text) => {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  },
};
