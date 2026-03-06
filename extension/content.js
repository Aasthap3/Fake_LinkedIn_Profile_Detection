function extractProfileText() {

    let about = document.body.innerText;

    return {
        text: about.slice(0, 2000)
    };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "getProfileText") {
        let data = extractProfileText();
        sendResponse(data);
    }

});