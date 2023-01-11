
    function createCssSelector(attributes, attributeName, tag) {
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
    }
    
    function createXpathSelector(attributes, attributeName, tag) {
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
    }

  

    function copyToClipboard(text) {
        var textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
    }
