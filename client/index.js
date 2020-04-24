(async () => {
  const src = chrome.runtime.getURL("byui_rmp.js");
  const contentScript = await import(src);
})();
