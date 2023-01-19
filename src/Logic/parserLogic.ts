export const parserLogic = {
  getElementAttributes: (element:any) => {
    const attributes:any = {};
    Object.keys(element).map(key=>{
      console.log(key);
      if(key != "style"){
        const values = element[key]?.split(" ");
        if(values.length > 1){
          for( let i = 0; i < values.length; i++ ){
            const newkey = key + "-" + i;
            attributes[newkey] = values[i];
          }
        }else if(values.length === 1){
          attributes[key] = values;
        }else{
          attributes[key] = '';
        }
      }
    });   
    return attributes;
  },
  concatSameAttributes: (attributes:any) => {
    const sameAttributes:any = {};
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
  createCssSelector: (attributes:any, attributeName:any, tag:any) => {
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
  createXpathSelector: (attributes:any, attributeName:any, tag:any) => {
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
  copyToClipboard: (text:any) => {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  },
};
