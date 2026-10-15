document.addEventListener("copy", () => {
  const quote = window.getSelection()?.toString().trim();
  if (!quote || quote.length < 2) return;

  chrome.runtime.sendMessage({
    type: "SAVE_SOURCE",
    quote,
    title: document.title,
    url: window.location.href
  });
});
