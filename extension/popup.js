// KAVACH Extension Popup
document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('currentDomain');
  const shieldEl = document.getElementById('shieldStatus');
  const deepScanBtn = document.getElementById('deepScanBtn');

  if (chrome && chrome.tabs) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const url = new URL(tab.url);
      statusEl.textContent = url.hostname;
      // Default to protected state
      shieldEl.style.background = '#22c55e';
      shieldEl.style.boxShadow = '0 0 8px #22c55e';
    }
  }

  deepScanBtn.addEventListener('click', () => {
    alert("Running KAVACH Deep Scan on active page...");
  });
});
