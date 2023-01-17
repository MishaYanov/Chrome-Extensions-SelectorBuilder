


function DOMElemnetSelector(){
    const elements = document.querySelectorAll("*");
    for (const element of elements) {
        element.addEventListener("mouseover", (event) => {
            event.target.style.backgroundColor = "yellow";
        });
        element.addEventListener("mouseout", (event) => {
            event.target.style.backgroundColor = "";
        });
        element.addEventListener("click", endSelecting(ev, elements));
    }
}

function endSelecting(ev, allElements) {
    console.log(ev);
    for (const el of allElements){
        
    }
}
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.action === "select-invoked") {
            console.log("done");
        }
    }

);