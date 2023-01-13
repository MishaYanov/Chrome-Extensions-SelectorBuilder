chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "hello") {
            console.log("hello");
            chrome.storage.local.get(['shows'], function(result) {
                console.log(result.shows);
                sendResponse({shows: result.shows});
            });
        }
    }
);
