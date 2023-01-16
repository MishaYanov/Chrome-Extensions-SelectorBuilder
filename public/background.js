chrome.runtime.onInstalled.addListener(function (details) {
  chrome.storage.local.set({
    elements: [],
  })
  chrome.contextMenus.create({
    title: "Select Element",
    id: "contextMenu1",
    contexts: ["all"]
  })
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    console.log("clicked");
    console.log(info, tab);
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "select_element"}, function(response) {
    //     });
    //   });
  });
});
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(request)
//     if (request.message === "select-invoked") {
//       console.log("Received message: " + request.message);
//       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {message: "select_all_elements"}, function(response) {
//             console.log(response);
//         });
//     });
//     }
//   });