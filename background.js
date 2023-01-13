// let color = '#3aa757';

// chrome.runtime.onInstalled.addListener(() => {
// chrome.storage.sync.set({ color });
// console.log('Default background color set to %cgreen', `color: ${color}`);
// });

// chrome.action.onClicked.addListener(function(tab) {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         console.log("clicked");
//       chrome.tabs.sendMessage(tabs[0].id, {greeting: "select_element"}, function(response) {
//       });
//     });
//   });

  chrome.runtime.onInstalled.addListener(function(details) {
    chrome.storage.local.set({
        shows: [],
    })
    chrome.contextMenus.create({
        title: "Select Element",
        id: "contextMenu1",
        contexts: ["all"]
    })
    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        console.log("clicked");
        console.log(info, tab);
        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //     chrome.tabs.sendMessage(tabs[0].id, {greeting: "select_element"}, function(response) {
        //     });
        //   });
    });
  });