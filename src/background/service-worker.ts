/**
 * ClipForge Background Service Worker (Manifest V3)
 * Manages side panel behavior, extension icon triggers, and clip downloads.
 */

// Enable side panel to open on action icon click
chrome.runtime.onInstalled.addListener(async () => {
  try {
    if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    }
  } catch (err) {
    console.error('Failed to set side panel behavior:', err);
  }
});

// Fallback action click handler in case browser requires explicit open
chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (tab.windowId && chrome.sidePanel && chrome.sidePanel.open) {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    }
  } catch (err) {
    console.warn('Action click open side panel fallback:', err);
  }
});

// Tab-specific detected HLS/DASH streams cache
const tabStreams = new Map<number, Set<string>>();

// Passive stream sniffer for HLS (.m3u8) and DASH (.mpd)
if (chrome.webRequest && chrome.webRequest.onBeforeRequest) {
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      const { url, tabId } = details;
      if (tabId < 0) return undefined;

      const clean = url.split('?')[0].toLowerCase();
      if (
        clean.endsWith('.m3u8') ||
        clean.endsWith('.mpd') ||
        url.includes('.m3u8?') ||
        url.includes('.mpd?') ||
        url.includes('/master.m3u8') ||
        url.includes('/playlist.m3u8') ||
        url.includes('/manifest.mpd')
      ) {
        if (!tabStreams.has(tabId)) {
          tabStreams.set(tabId, new Set());
        }
        tabStreams.get(tabId)!.add(url);
      }
      return undefined;
    },
    { urls: ['<all_urls>'] }
  );
}

// Clean up tab stream cache
chrome.tabs.onRemoved.addListener((tabId) => {
  tabStreams.delete(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    tabStreams.delete(tabId);
  }
});

// Listen for messages from side panel or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return false;

  if (message.type === 'GET_DETECTED_STREAMS') {
    const { tabId } = message.payload || {};
    const queryTabId = tabId || sender.tab?.id;
    const streams = queryTabId && tabStreams.has(queryTabId) ? Array.from(tabStreams.get(queryTabId)!) : [];
    sendResponse({ success: true, streams });
    return true;
  }

  if (message.type === 'DOWNLOAD_CLIP') {
    (async () => {
      try {
        const { blobUrl, filename } = message.payload || {};
        if (!blobUrl || !filename) {
          sendResponse({ success: false, error: 'Invalid download parameters.' });
          return;
        }

        const downloadId = await chrome.downloads.download({
          url: blobUrl,
          filename: filename,
          saveAs: true,
        });

        sendResponse({ success: true, downloadId });
      } catch (err: any) {
        console.error('Download error:', err);
        sendResponse({ success: false, error: err?.message || 'Download failed' });
      }
    })();
    return true; // Keep channel open for async response
  }

  return false;
});
