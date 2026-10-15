const MAX_SOURCES = 250;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "SAVE_SOURCE") return;

  const entry = {
    id: crypto.randomUUID(),
    quote: message.quote.trim(),
    title: message.title || "Untitled page",
    url: message.url,
    capturedAt: new Date().toISOString()
  };

  chrome.storage.local.get({ sources: [] }, ({ sources }) => {
    const duplicate = sources.some(
      (source) => source.quote === entry.quote && source.url === entry.url
    );

    if (!duplicate) {
      sources.unshift(entry);
      sources = sources.slice(0, MAX_SOURCES);
      chrome.storage.local.set({ sources });
    }
    sendResponse({ saved: !duplicate });
  });

  return true;
});
