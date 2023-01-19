// chrome.runtime.onInstalled.addListener(function (details) {
//   chrome.storage.local.set({
//     elements: [],
//   })
//   chrome.contextMenus.create({
//     title: "Select Element",
//     id: "contextMenu1",
//     contexts: ["all"]
//   })
//   chrome.contextMenus.onClicked.addListener(function (info, tab) {
//     console.log("clicked");
//     console.log(info, tab);
//     // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "select_element"}, function(response) {
//     //     });
//     //   });
//   });
// });


// chrome.runtime.onStartup.addListener(function() {
//   chrome.debugger.attach({tabId:tab.id}, "1.2", chrome.debugger.DetachReason.REASON_CONNECTED, function () {
//       chrome.debugger.sendCommand({tabId:tab.id}, "Debugger.enable", {}, function () {
//           chrome.debugger.sendCommand({tabId:tab.id}, "Runtime.enable", {}, function () {
//               console.log("Debugger attached and enabled.");
//           });
//       });
//   });
// });