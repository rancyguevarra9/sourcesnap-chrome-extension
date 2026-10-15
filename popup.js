const sourceList = document.querySelector("#source-list");
const emptyState = document.querySelector("#empty-state");
const search = document.querySelector("#search");
const resultCount = document.querySelector("#result-count");
const sourceCount = document.querySelector("#source-count");
const template = document.querySelector("#source-template");
const citationStyle = document.querySelector("#citation-style");
const selectVisible = document.querySelector("#select-visible");
const exportButton = document.querySelector("#export-button");
let sources = [];
let selectedIds = new Set();

function formatDate(iso) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

function filteredSources() {
  const query = search.value.trim().toLowerCase();
  if (!query) return sources;
  return sources.filter((source) => [source.quote, source.title, source.url].join(" ").toLowerCase().includes(query));
}

function citationFor(source, style) {
  const accessDate = formatDate(source.capturedAt);
  switch (style) {
    case "apa":
      return `${source.title}. (n.d.). Retrieved ${accessDate}, from ${source.url}`;
    case "mla":
      return `“${source.title}.” ${new URL(source.url).hostname.replace(/^www\\./, "")}, ${source.url}. Accessed ${accessDate}.`;
    case "chicago":
      return `${source.title}. Accessed ${accessDate}. ${source.url}.`;
    case "harvard":
      return `${source.title} (n.d.) Available at: ${source.url} (Accessed: ${accessDate}).`;
    case "ieee":
      return `“${source.title},” ${new URL(source.url).hostname.replace(/^www\\./, "")}. [Online]. Available: ${source.url}. [Accessed: ${accessDate}].`;
    case "vancouver":
      return `${source.title} [Internet]. [cited ${accessDate}]. Available from: ${source.url}`;
    default:
      return `${source.title} — ${source.url} (saved ${accessDate})`;
  }
}

function render() {
  const matches = filteredSources();
  sourceList.replaceChildren();
  emptyState.hidden = sources.length !== 0;
  selectVisible.checked = matches.length > 0 && matches.every((source) => selectedIds.has(source.id));
  selectVisible.indeterminate = matches.some((source) => selectedIds.has(source.id)) && !selectVisible.checked;
  selectVisible.disabled = matches.length === 0;
  exportButton.disabled = selectedIds.size === 0;
  exportButton.textContent = selectedIds.size ? `Copy ${selectedIds.size} citation${selectedIds.size === 1 ? "" : "s"}` : "Copy selected";
  sourceCount.textContent = `${sources.length} saved excerpt${sources.length === 1 ? "" : "s"}`;
  matches.forEach((source) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".quote").textContent = source.quote;
    const link = fragment.querySelector(".source-title");
    link.textContent = source.title; link.href = source.url;
    fragment.querySelector(".domain").textContent = new URL(source.url).hostname.replace(/^www\./, "");
    fragment.querySelector(".date").textContent = formatDate(source.capturedAt);
    const checkbox = fragment.querySelector(".source-checkbox");
    checkbox.checked = selectedIds.has(source.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selectedIds.add(source.id);
      else selectedIds.delete(source.id);
      render();
    });
    fragment.querySelector(".delete-button").addEventListener("click", () => remove(source.id));
    sourceList.append(fragment);
  });
}

function remove(id) {
  sources = sources.filter((source) => source.id !== id);
  selectedIds.delete(id);
  chrome.storage.local.set({ sources }, render);
}

search.addEventListener("input", render);
selectVisible.addEventListener("change", () => {
  filteredSources().forEach((source) => {
    if (selectVisible.checked) selectedIds.add(source.id);
    else selectedIds.delete(source.id);
  });
  render();
});
exportButton.addEventListener("click", async () => {
  const citations = sources.filter((source) => selectedIds.has(source.id)).map((source) => citationFor(source, citationStyle.value)).join("\n\n");
  if (!citations) return;
  await navigator.clipboard.writeText(citations);
  const originalText = exportButton.textContent;
  exportButton.textContent = "Copied!";
  setTimeout(() => { exportButton.textContent = originalText; }, 1300);
});

chrome.storage.local.get({ sources: [] }, (data) => { sources = data.sources; render(); });
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.sources) {
    sources = changes.sources.newValue || [];
    selectedIds = new Set([...selectedIds].filter((id) => sources.some((source) => source.id === id)));
    render();
  }
});
