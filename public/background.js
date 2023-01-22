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
chrome.runtime.onMessage.addListener(({ContentData, value})=>{
    debugger
    if(ContentData){
        debugger
        console.log(ContentData);
        chrome.storage.local.set({[data]: ContentData}).then((result) => {
            console.log("Value currently is " + result.data);
          });
    }
});
console.log("HPPEPPEEPEP");