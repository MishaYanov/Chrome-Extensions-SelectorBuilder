
/**
 * TODO:
 * 1. Add actions:
 *   - button event 
 *   - select element event.
 *   - parse Element
 *   - set css or xpath selector
 */

const element = document.querySelector("div.element-description");
const selectButton = document.getElementById("select-element-button");
console.log(selectButton)
selectButton.addEventListener("click", () => {
    sendMessage("select-invoked");
});
function sendMessage(command) {
    console.log("invoked: ", command)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: command }, function (response) {
        });
    });
}