document.getElementById("select-element-button").addEventListener("click", function() {
    chrome.tabs.executeScript({
      file: 'content_script.js'
    });
  });



let selectedElement;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.method == "getSelectedElement") {
      sendResponse({data: selectedElement});
    }
    else if (request.method == "setSelectedElement") {
      selectedElement = request.data;
      sendResponse({status: "success"});
    }
  });

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    file: 'content_script.js'
  });
});