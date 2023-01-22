chrome.runtime.onMessage.addListener((request, sender, response) => {
  if (request.action === "selectAllElements") {
    startSelectionProcess();
  }
  if(request.action === "stopSelecting"){
    endSelectionProcess(null);
  }
});
//send message to popup
function sendToExtension(messageContent){
  console.log(messageContent)
  debugger
  if(messageContent) chrome.runtime.sendMessage(null, {ContentData: messageContent},(response)=>{
    //console.log("I'm from the send response function: " + response);
  })
}
//send message to backgrong
function getAllElements(){
  return document.querySelectorAll('*');
};

function addOnHover(event){
  event.target.style.backgroundColor = "yellow";
}
function removeOnOut(event){
  event.target.style.backgroundColor = "";
}
function onSelect(event){
  endSelectionProcess(event.target);
  event.target.style.backgroundColor = "#00c8502f";
}
function getAllAttributesAndValues(element){
  const attrKV = {}
  for(let i = 0; i < element.attributes.length; i++){
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
  if(selectedElement != null){
    const filter = /<(.*?)>/;
    const elementAttr = filter.exec(selectedElement.outerHTML)[1];
    const ElementMap = getAllAttributesAndValues(selectedElement);
    console.log()
    const elementInfo = {
      element: JSON.stringify(selectedElement.outerHTML),
      completeTag: `<${elementAttr}>`,
      tag: selectedElement.tagName,
      attributes: ElementMap,
    }
    const jsonElement = JSON.stringify(elementInfo);
    sendToExtension(jsonElement)
  }
  const allElements = getAllElements();
  for (const element of allElements) {
    element.removeEventListener("click", onSelect);
    element.removeEventListener("mouseover", addOnHover)
    element.removeEventListener("mouseout", removeOnOut)
  }
}

