const style = document.createElement("style");

style.innerHTML = `
*[ext-el-main ='selected-element-ext-m']{
  background-color: #00c8502f !important;
}
`;
const head = document.head || document.getElementsByTagName("head")[0];
head.appendChild(style);

chrome.runtime.onMessage.addListener((request, sender, response) => {
  if (request.action === "selectAllElements") {
    startSelectionProcess();
  }
  if (request.action === "stopSelecting") {
    endSelectionProcess(null);
  }
  if (request.action.type === "selectElement") {
    selctChildElement(request.action.position);
  }
  if (request.action.type === "highlightElement") {
    highlightChildElement(request.action.position);
  }
  if (request.action.type === "unhighlightElement") {
    unhighlightChildElement(request.action.position);
  }
});
//send message to popup
function sendToExtension(messageContent) {
  console.log(messageContent);
  debugger;
  if (messageContent)
    chrome.runtime.sendMessage(
      null,
      { ContentData: messageContent },
      (response) => {
        //console.log("I'm from the send response function: " + response);
      }
    );
}

//send message to backgrong
function getAllElements() {
  return document.querySelectorAll("*");
}

function addOnHover(event) {
  event.target.style.backgroundColor = "yellow";
}
function removeOnOut(event) {
  event.target.style.backgroundColor = "";
}


//TODO: change logic to use chrome debugger API
async function onSelect(event, flag = false) {
  debugger
  clearOldChoiceFromDOM();
  if (flag) {
    //if flag event turns into target.
    event.style.backgroundColor = "";
    event.setAttribute("ext-el-main", "selected-element-ext-m");
    await applyAttributeToChildren(event);
    endSelectionProcess(event);
  } else {
    event.stopPropagation();
    await applyAttributeToChildren(event.target);
    event.target.style.backgroundColor = "";
    event.target.setAttribute("ext-el-main", "selected-element-ext-m");
    endSelectionProcess(event.target);
  }
}
async function applyAttributeToChildren(el) {
  const allChildren = el.querySelectorAll("*");
  await allChildren.forEach((child, index) => {
    child.setAttribute("ext-el-pos", index);
  });
}
function getAllAttributesAndValues(element) {
  const attrKV = {};
  for (let i = 0; i < element.attributes.length; i++) {
    const curEl = element.attributes[i];
    const attrValues = curEl.value;
    attrKV[curEl.name] = attrValues;
  }
  return attrKV;
}
function startSelectionProcess() {
  const allElements = getAllElements();
  for (const element of allElements) {
    element.addEventListener("mouseover", addOnHover);
    element.addEventListener("mouseout", removeOnOut);
    element.addEventListener("click", onSelect);
  }
}

function endSelectionProcess(selectedElement) {
  if (selectedElement != null) {
    const filter = /<(.*?)>/;
    const elementAttr = filter.exec(selectedElement.outerHTML)[1];
    const ElementMap = getAllAttributesAndValues(selectedElement);
    const elementInfo = {
      element: JSON.stringify(selectedElement.outerHTML),
      completeTag: `<${elementAttr}>`,
      tag: selectedElement.tagName,
      attributes: ElementMap,
    };
    const jsonElement = JSON.stringify(elementInfo);
    sendToExtension(jsonElement);
  }
  const allElements = getAllElements();
  for (const element of allElements) {
    element.removeEventListener("click", onSelect);
    element.removeEventListener("mouseover", addOnHover);
    element.removeEventListener("mouseout", removeOnOut);
  }
}
function clearOldChoiceFromDOM(){
  const oldSlector = document.querySelector("*[ext-el-main='selected-element-ext-m']");
  if (oldSlector) {
    oldSlector.removeAttribute("ext-el-main");
    oldSlector.querySelectorAll("*").forEach((child) => {
      child.removeAttribute("ext-el-pos");
    });
  }
}
//Tree parser functions
function highlightChildElement(pos) {
  const elementToHighLight = document.querySelector(`*[ext-el-pos="${pos}"]`);
  elementToHighLight.style.backgroundColor = "yellow";
}
function unhighlightChildElement(pos) {
  const elementToUnhighlight = document.querySelector(`*[ext-el-pos="${pos}"]`);
  elementToUnhighlight.style.backgroundColor = "";
}
function selctChildElement(pos) {
  const newMainEl = document.querySelector(`*[ext-el-pos="${pos}"]`);
  onSelect(newMainEl, true);
}
