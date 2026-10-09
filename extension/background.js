// KAVACH Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("KAVACH Shield Browser Extension installed.");
});

// Listener for content script verification requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHECK_URL') {
    // Queries KAVACH API endpoint
    fetch('http://localhost:3000/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: request.url })
    })
    .then(res => res.json())
    .then(data => sendResponse({ success: true, data }))
    .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep message channel open for async response
  }
});
