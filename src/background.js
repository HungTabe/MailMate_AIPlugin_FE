chrome.runtime.onInstalled.addListener(() => {
    console.log("MailMate Extension đã được cài đặt!");
});

// Duy trì phiên đăng nhập với backend
chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["http://localhost:3000/*"] },
    ["requestHeaders", "extraHeaders"]
);
