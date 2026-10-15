# SourceSnap

A Chrome extension that automatically keeps the source for text you copy from the web. It saves the copied excerpt, page title, URL, and capture date locally in the browser.

**Developed by [rancyguevarra9](https://github.com/rancyguevarra9).**

## Features

- Capture copied text on normal `http` and `https` webpages
- Keep the page title, source URL, and capture date
- Search saved quotes, titles, and websites
- Select one or more saved entries, then copy only those citations in APA, MLA, Chicago, Harvard, IEEE, Vancouver, or simple-link format
- All data stays in Chrome's local extension storage

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Choose **Load unpacked**.
4. Select this `sourcesnap` folder.
5. Open a webpage, highlight text, and copy it. Click the SourceSnap extension icon to see your saved source.

## Portfolio talking points

SourceSnap is a privacy-first research helper. It tackles a common issue: copied text loses its origin and becomes difficult to cite later. The project uses Manifest V3, content scripts, message passing, Chrome local storage, and a searchable popup UI.
