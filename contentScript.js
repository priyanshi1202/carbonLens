// Function to grab text from common product detail areas
function getProductDetails() {
    const bodyText = document.body.innerText;
    // We send a chunk of text to the popup/AI instead of the whole page to save tokens
    return bodyText.substring(0, 5000); 
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrape") {
        const details = document.body.innerText.substring(0, 5000);
        sendResponse({ data: details });
    }
    return true;
});