(async () => {
  const src = chrome.runtime.getURL('registration/byui_rmp.js');
  const contentScript = await import(src);
})();
