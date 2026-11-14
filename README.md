<div align="center">
  <img src=".github/assets/logo.png" alt="CN Link Grabber Pro Logo" width="110" />
  <h1>CN Link Grabber Pro</h1>
  <p>
    <strong>Cross-browser Manifest V3 extension for extracting course media, batch-downloading lecture PDFs, and trimming MP4/HLS streams locally in the browser.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Version-4.1.0-9b1136?style=flat-square" alt="Version 4.1.0" />
    <img src="https://img.shields.io/badge/Manifest-V3-2563eb?style=flat-square" alt="Manifest V3" />
    <img src="https://img.shields.io/badge/Browsers-Chrome%20%7C%20Edge%20%7C%20Firefox-1f2937?style=flat-square" alt="Supported Browsers" />
    <img src="https://img.shields.io/badge/License-MIT-10b981?style=flat-square" alt="MIT License" />
  </p>

  <p>
    <a href="https://microsoftedge.microsoft.com/addons/detail/cn-link-grabber-pro/eobggdfbehldfegkhebhcecaknblgipj">Microsoft Edge Add-ons</a>
    &nbsp;•&nbsp;
    <a href="https://addons.mozilla.org/en-US/firefox/addon/cn-link-grabber-pro/">Firefox Add-ons</a>
    &nbsp;•&nbsp;
    <a href="https://marjuk06.gumroad.com/coffee">Buy Me a Coffee</a>
    &nbsp;•&nbsp;
    <a href="https://marjukamin.com">marjukamin.com</a>
  </p>
</div>

---

## Overview

**CN Link Grabber Pro** is built for students, researchers, and educators who work across learning management systems and online course portals. Instead of inspecting page source or manually saving lecture files one by one, it scans the active tab and organizes embedded videos, adaptive streams, Google Drive resources, and PDFs inside a compact Burgundy sidebar.

All extraction, batch downloading, and video trimming run locally on the client—no media files are uploaded to external servers.

---

## Core Capabilities

| Module | What It Does |
| :--- | :--- |
| **Multi-Platform Link Extractor** | Detects YouTube embeds (`youtube.com`, `youtu.be`, `youtube-nocookie.com`, Plyr course players with oEmbed title lookup), Vimeo, Loom, Zoom recordings, and direct video links (`.mp4`, `.mkv`, `.webm`, `.avi`, `.mov`). |
| **Document & Canvas PDF Detection** | Captures Google Drive files and folders, direct/embedded PDFs, audio files, and Canvas-rendered PDF viewers (`pdf.js`, `vue-pdf-embed`, `pdfp`) alongside passive network PDF sniffing. |
| **In-Browser Video Trimmer Studio** | Keyframe-aligned MP4 remuxing using `mp4box` and `mp4-muxer` plus parallel HLS (`.m3u8`) segment fetching and remuxing via `mux.js`. Exports trimmed clips directly from browser memory without re-encoding. |
| **Batch PDF Downloader** | Downloads selected lecture notes into organized subdirectories (`Downloads/CN_Grabber/<Category>/`) with real-time byte tracking via a Material 3 wavy progress bar. |
| **Cross-Tab Global Vault** | Saves and pins starred items in `chrome.storage.local` across tabs and browsing sessions, paired with an auto-scroll scanner for lazy-loaded course lists. |
| **Multi-Format Academic Exporter** | Copies or exports selected resources as **Raw Text**, **Markdown**, **Obsidian Notes**, **Notion Tables**, **HTML Links**, **YouTube Playlists**, or **CSV**. |
| **Cross-Browser UI** | Supports both an in-page floating Burgundy sidebar (Light and Dark themes) and the native Side Panel (Chrome/Edge) or Sidebar Action (Firefox). |

---

## Project Structure

```text
CN-Link-Grabber-Pro/
├── manifest.json             # Chrome & Microsoft Edge Manifest V3
├── manifest.firefox.json     # Mozilla Firefox Manifest V3 (sidebar_action + gecko settings)
├── background.js             # Service worker / event page: webRequest sniffer, downloads, messaging
├── content.js                # DOM scanner, in-page Burgundy sidebar, vault, CSV/Notion/Obsidian export
├── style.css                 # In-page sidebar themes (Dark/Light Burgundy) and frosted modals
├── docs.html / docs.js       # Built-in documentation hub, changelog, and contact form
├── m3-loading-indicator.js   # Material 3 expressive loading indicator component
├── m3-wavy-progress.js       # Material 3 wavy progress bar for batch downloads
├── sidepanel/                # Compiled sidepanel entry (HTML)
├── assets/                   # Compiled sidepanel JS/CSS bundle
├── icons/                    # Extension icons (16, 48, 128) & author avatar
├── src/                      # TypeScript / React 19 source for the Video Trimmer Studio
├── cloudflare-worker.js      # Cloudflare Worker mail router for in-extension bug/feature inquiries
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Local Development

### Prerequisites
- Node.js `v20+` (tested on `v24.16.0`)
- npm `v10+`

### 1. Build the Video Trimmer Studio Sidepanel
```bash
npm install
npx vite build
```
This compiles `src/sidepanel/index.html` into `dist/` and syncs the bundle into `sidepanel/` and `assets/`.

### 2. Load in Chrome or Microsoft Edge
1. Open `chrome://extensions` or `edge://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the repository root directory.

### 3. Load in Mozilla Firefox
1. Copy `manifest.firefox.json` to `manifest.json` in a staging folder (alongside `background.js`, `content.js`, `style.css`, `docs.html`, `docs.js`, `m3-loading-indicator.js`, `m3-wavy-progress.js`, `icons/`, `sidepanel/`, and `assets/`).
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...** and select the staged `manifest.json`.

---

## Privacy

- Link parsing, PDF grouping, and MP4/HLS video trimming execute strictly inside the browser.
- No browsing history, user credentials, or extracted links are collected or transmitted to analytics servers.
- Voluntary submissions sent through the **Contact & Feature Request** modal are routed via `cloudflare-worker.js` to the developer solely for support and portal-compatibility requests.

---

## Author & Support

**Marjuk Amin**  
- Portfolio: [marjukamin.com](https://marjukamin.com)
- GitHub: [@Marjuk06](https://github.com/Marjuk06)
- Contact: `contact@marjukamin.com`

If this tool saves you time during your coursework, you can support ongoing maintenance on [Gumroad](https://marjuk06.gumroad.com/coffee).

---

Released under the [MIT License](LICENSE).
