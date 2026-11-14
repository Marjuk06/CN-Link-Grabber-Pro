/**
 * CN Link Grabber Pro - Background Service Worker
 * Manages tab sidebars, batch download polling, HLS stream sniffing, and sidepanel studio.
 */

const downloadSessions = new Map();
let pollInterval = null;

// Tab-specific sniffed HLS (.m3u8) and DASH (.mpd) streams
const tabStreams = new Map();
// Tab-specific sniffed PDF documents
const tabPdfs = new Map();

function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 KB';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function toggleSidebar(tabId) {
    if (!tabId) return;
    chrome.tabs.sendMessage(tabId, { action: "toggle_sidebar" }).catch(() => {});
}

async function openTrimmerStudio(windowId, tabId) {
    try {
        if (chrome.sidePanel && chrome.sidePanel.open) {
            const options = windowId ? { windowId } : (tabId ? { tabId } : {});
            await chrome.sidePanel.open(options);
            return;
        }
        if (typeof browser !== 'undefined' && browser.sidebarAction && browser.sidebarAction.open) {
            await browser.sidebarAction.open();
            return;
        }
    } catch (err) {
        // Fall back to tab/window if sidepanel api is restricted
    }

    const studioUrl = chrome.runtime.getURL('sidepanel/index.html');
    chrome.windows.create({
        url: studioUrl,
        type: 'popup',
        width: 440,
        height: 740
    }).catch(() => {
        chrome.tabs.create({ url: studioUrl });
    });
}

function openDocsPage() {
    const docsUrl = chrome.runtime.getURL('docs.html');
    chrome.tabs.query({ url: docsUrl }, (tabs) => {
        if (tabs && tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, { active: true });
        } else {
            chrome.tabs.create({ url: docsUrl });
        }
    });
}

// Extension install / update lifecycle
chrome.runtime.onInstalled.addListener(async (details) => {
    try {
        if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
            await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
        }
    } catch (_) {}

    if (details.reason === 'install' || details.reason === 'update') {
        openDocsPage();
    }
});

chrome.action.onClicked.addListener((tab) => {
    toggleSidebar(tab.id);
});

// Passive HLS/DASH network stream sniffer & PDF document sniffer
if (chrome.webRequest && chrome.webRequest.onBeforeRequest) {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            const { url, tabId } = details;
            if (tabId < 0) return;

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
                tabStreams.get(tabId).add(url);
            }

            // Passive PDF document sniffer (catches hidden/tokenized/storage PDFs)
            const isPdf = clean.endsWith('.pdf') ||
                          url.includes('.pdf?') ||
                          url.includes('/pdf/') ||
                          clean.includes('storage-r2.udvash-unmesh.com');
            if (isPdf) {
                if (!tabPdfs.has(tabId)) {
                    tabPdfs.set(tabId, new Map());
                }
                const pdfMap = tabPdfs.get(tabId);
                if (!pdfMap.has(url)) {
                    let filename = 'Lecture_Note.pdf';
                    const parts = clean.split('/');
                    const lastPart = parts[parts.length - 1];
                    if (lastPart.endsWith('.pdf')) {
                        filename = decodeURIComponent(lastPart);
                    }
                    pdfMap.set(url, { url, filename });
                    chrome.tabs.sendMessage(tabId, {
                        action: "pdf_sniffed",
                        pdf: { url, filename }
                    }).catch(() => {});
                }
            }
        },
        { urls: ['<all_urls>'] }
    );
}

chrome.tabs.onRemoved.addListener((tabId) => {
    tabStreams.delete(tabId);
    tabPdfs.delete(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
        tabStreams.delete(tabId);
        tabPdfs.delete(tabId);
    }
});

function startPolling() {
    if (pollInterval) return;
    pollInterval = setInterval(checkDownloadProgress, 350);
}

function stopPollingIfEmpty() {
    if (downloadSessions.size === 0 && pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

function checkDownloadProgress() {
    if (downloadSessions.size === 0) {
        stopPollingIfEmpty();
        return;
    }

    for (const [tabId, session] of downloadSessions.entries()) {
        const ids = Array.from(session.downloadIds.keys());
        if (ids.length === 0) continue;

        const queryPromises = ids.map(downloadId => {
            return new Promise(resolve => {
                chrome.downloads.search({ id: downloadId }, (results) => {
                    if (chrome.runtime.lastError || !results || !results[0]) {
                        resolve(null);
                    } else {
                        resolve(results[0]);
                    }
                });
            });
        });

        Promise.all(queryPromises).then(items => {
            const validItems = items.filter(Boolean);
            if (validItems.length === 0) return;

            let totalBytes = 0;
            let receivedBytes = 0;
            let currentFileName = '';
            let activeCount = 0;

            for (const item of validItems) {
                const info = session.downloadIds.get(item.id);
                if (!info) continue;

                if (item.state === 'in_progress') {
                    activeCount++;
                    currentFileName = info.filename;
                    if (item.totalBytes > 0) {
                        totalBytes += item.totalBytes;
                        receivedBytes += Math.min(item.bytesReceived, item.totalBytes);
                    } else if (item.bytesReceived > 0) {
                        receivedBytes += item.bytesReceived;
                        totalBytes += item.bytesReceived * 1.15;
                    }
                } else if (item.state === 'complete') {
                    const size = item.fileSize || item.totalBytes || 1024 * 1024;
                    totalBytes += size;
                    receivedBytes += size;
                }
            }

            let pct = 0;
            if (totalBytes > 0 && receivedBytes > 0) {
                pct = Math.min(99, Math.round((receivedBytes / totalBytes) * 100));
            } else {
                pct = Math.min(99, Math.round((session.completed / session.total) * 100));
            }
            if (pct < 6) pct = 6;

            let bytesText = '';
            if (totalBytes > 0 && receivedBytes > 0) {
                bytesText = `${formatBytes(receivedBytes)} / ${formatBytes(totalBytes)}`;
            } else if (receivedBytes > 0) {
                bytesText = `${formatBytes(receivedBytes)}`;
            }

            chrome.tabs.sendMessage(tabId, {
                action: "download_progress",
                percent: pct,
                completed: session.completed,
                total: session.total,
                currentFile: currentFileName || (infoForFirstActive(session)?.filename || ''),
                bytesText: bytesText
            }).catch(() => {});
        }).catch(() => {});
    }
}

function infoForFirstActive(session) {
    for (const [, info] of session.downloadIds.entries()) {
        return info;
    }
    return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const tabId = sender.tab ? sender.tab.id : null;
    const windowId = sender.tab ? sender.tab.windowId : null;

    if (request.action === "download_files") {
        const files = request.files || (request.urls ? request.urls.map(url => ({ url, filename: '', category: '' })) : []);
        if (!files || files.length === 0) {
            sendResponse({ status: "empty" });
            return;
        }

        const total = files.length;
        const session = {
            tabId,
            total,
            completed: 0,
            failed: 0,
            downloadIds: new Map()
        };

        if (tabId) {
            downloadSessions.set(tabId, session);
            startPolling();

            chrome.tabs.sendMessage(tabId, {
                action: "download_started",
                total: total
            }).catch(() => {});
        }

        let i = 0;
        const triggerNext = () => {
            if (i >= total) return;
            const file = files[i];
            const options = { url: file.url };

            if (file.filename) {
                const cleanCategory = (file.category && file.category !== 'Uncategorized')
                    ? file.category.replace(/[^a-zA-Z0-9_\-\ ]/g, '_').trim()
                    : 'Downloads';
                options.filename = `CN_Grabber/${cleanCategory}/${file.filename}`;
            }

            chrome.downloads.download(options, (downloadId) => {
                if (chrome.runtime.lastError || !downloadId) {
                    session.failed++;
                    if (tabId) {
                        chrome.tabs.sendMessage(tabId, {
                            action: "download_item_failed",
                            filename: file.filename || `File ${i + 1}`,
                            completed: session.completed,
                            total: session.total
                        }).catch(() => {});
                    }
                } else {
                    session.downloadIds.set(downloadId, {
                        filename: file.filename || `File ${i + 1}`,
                        category: file.category || 'Downloads'
                    });
                }

                i++;
                if (i < total) {
                    setTimeout(triggerNext, 400);
                }
            });
        };

        triggerNext();
        sendResponse({ status: "started", total });
        return true;
    }

    if (request.action === "open_trimmer") {
        const targetTabId = tabId || sender.tab?.id;
        if (targetTabId) {
            chrome.tabs.sendMessage(targetTabId, {
                action: "open_in_sidebar_trimmer",
                videoUrl: request.videoUrl,
                videoTitle: request.videoTitle
            }).catch(() => {});
        }
        sendResponse({ status: "ok" });
        return true;
    }

    if (request.action === "open_docs") {
        openDocsPage();
        sendResponse({ status: "ok" });
        return true;
    }

    if (request.action === "open_tab" && request.url) {
        chrome.tabs.create({ url: request.url, active: true }, () => {
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.action === "get_vault") {
        chrome.storage.local.get(['cnVault', 'linkGrabberVault'], (result) => {
            const vault = result.cnVault || result.linkGrabberVault || { videos: [], drives: [] };
            sendResponse({ vault });
        });
        return true;
    }

    if (request.action === "save_vault") {
        chrome.storage.local.set({ cnVault: request.vault, linkGrabberVault: request.vault }, () => {
            sendResponse({ status: "saved" });
        });
        return true;
    }

    if (request.action === "get_sniffed_pdfs") {
        const targetTabId = tabId || sender.tab?.id;
        const pdfs = (targetTabId && tabPdfs.has(targetTabId))
            ? Array.from(tabPdfs.get(targetTabId).values())
            : [];
        sendResponse({ success: true, pdfs });
        return true;
    }

    // ClipForge Studio Bridge Messages
    if (request.type === 'GET_DETECTED_STREAMS') {
        const queryTabId = request.payload?.tabId || tabId;
        const streams = queryTabId && tabStreams.has(queryTabId) ? Array.from(tabStreams.get(queryTabId)) : [];
        sendResponse({ success: true, streams });
        return true;
    }

    if (request.action === "send_contact_feedback") {
        (async () => {
            try {
                const payload = request.payload || {};
                const devEmail = "contact@marjukamin.com";
                
                // Persist inquiry locally in browser storage
                const stored = await new Promise((resolve) => {
                    chrome.storage.local.get(['developer_inquiries'], (res) => {
                        resolve(res.developer_inquiries || []);
                    });
                });
                stored.unshift({ ...payload, devEmail, timestamp: new Date().toISOString() });
                await new Promise((resolve) => {
                    chrome.storage.local.set({ developer_inquiries: stored.slice(0, 50) }, resolve);
                });

                // Cloudflare Edge Mail Service URL (Set this to your Cloudflare Worker URL)
                const CLOUDFLARE_WORKER_URL = "https://marjuk-mail-router.eap-fcm-worker.workers.dev"; 

                // Dispatch Endpoints (Priority: Cloudflare Worker 24/7 Edge > Control Plane API)
                const ENDPOINTS = [
                    CLOUDFLARE_WORKER_URL,
                    "https://cnadmindash.marjukamin.com/api/contact",
                    "http://localhost:3004/api/contact"
                ].filter(Boolean);

                const GOOGLE_SCRIPT_WEBAPP_URL = ""; // Optional: Paste Google Apps Script Web App URL here if preferred

                let dispatched = false;

                // 1. Try Control Plane Contact API (Native Google SMTP + Custom UI auto-confirmation)
                for (const endpoint of ENDPOINTS) {
                    if (dispatched) break;
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 8000);
                        const res = await fetch(endpoint, {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Accept": "application/json" },
                            body: JSON.stringify({
                                name: payload.name || 'Anonymous User',
                                email: payload.email || '',
                                category: payload.category || 'New Feature Request',
                                message: payload.message || '',
                                pageUrl: payload.pageUrl || 'Browser Tab',
                                version: payload.version || '4.1.0 Pro'
                            }),
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);
                        if (res.ok) {
                            const data = await res.json().catch(() => ({}));
                            if (data.success) {
                                dispatched = true;
                                console.log("[CN Mailer] Dispatched successfully via", endpoint);
                                break;
                            }
                        }
                    } catch (_) {
                        // Try next endpoint
                    }
                }

                // 2. Try Google Apps Script if URL provided
                if (!dispatched && GOOGLE_SCRIPT_WEBAPP_URL) {
                    try {
                        const gRes = await fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ...payload, devEmail })
                        });
                        if (gRes.ok) dispatched = true;
                    } catch (_) {}
                }

                // 3. Fallback direct dispatch if remote endpoints are offline
                if (!dispatched) {
                    try {
                        await fetch(`https://formsubmit.co/ajax/${devEmail}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Accept": "application/json" },
                            body: JSON.stringify({
                                name: payload.name || 'Anonymous User',
                                email: payload.email || 'noreply@user.com',
                                _replyto: payload.email || devEmail,
                                category: payload.category || 'Feature Request',
                                message: payload.message || '',
                                pageUrl: payload.pageUrl || 'Browser Tab',
                                version: payload.version || '4.1.0 Pro',
                                _subject: `[CN Link Grabber Pro] ${payload.category || 'Feedback'} from ${payload.name || 'User'}`
                            })
                        }).catch(() => {});
                    } catch (netErr) {
                        console.warn("[CN Mailer] Fallback offline:", netErr);
                    }
                }

                sendResponse({ success: true, message: "Feedback delivered to contact@marjukamin.com" });
            } catch (err) {
                console.error("send_contact_feedback error:", err);
                sendResponse({ success: true, error: err?.message });
            }
        })();
        return true;
    }

    if (request.type === 'DOWNLOAD_CLIP') {
        (async () => {
            try {
                const { blobUrl, filename } = request.payload || {};
                if (!blobUrl || !filename) {
                    sendResponse({ success: false, error: 'Missing clip parameters' });
                    return;
                }
                const downloadId = await chrome.downloads.download({
                    url: blobUrl,
                    filename: filename,
                    saveAs: true
                });
                sendResponse({ success: true, downloadId });
            } catch (err) {
                sendResponse({ success: false, error: err?.message || 'Download failed' });
            }
        })();
        return true;
    }
});

chrome.downloads.onChanged.addListener((delta) => {
    if (delta.bytesReceived) {
        checkDownloadProgress();
    }
    for (const [tabId, session] of downloadSessions.entries()) {
        if (session.downloadIds.has(delta.id)) {
            const fileInfo = session.downloadIds.get(delta.id);

            if (delta.state && delta.state.current === 'complete') {
                session.completed++;
                
                if (session.completed + session.failed >= session.total) {
                    chrome.tabs.sendMessage(tabId, {
                        action: "download_complete",
                        total: session.total,
                        completed: session.completed
                    }).catch(() => {});
                    downloadSessions.delete(tabId);
                    stopPollingIfEmpty();
                } else {
                    const pct = Math.min(99, Math.round((session.completed / session.total) * 100));
                    chrome.tabs.sendMessage(tabId, {
                        action: "download_progress",
                        percent: pct,
                        completed: session.completed,
                        total: session.total,
                        currentFile: fileInfo.filename,
                        bytesText: 'Completed'
                    }).catch(() => {});
                }
            } else if (delta.state && delta.state.current === 'interrupted') {
                session.failed++;
                chrome.tabs.sendMessage(tabId, {
                    action: "download_item_failed",
                    filename: fileInfo.filename,
                    completed: session.completed,
                    total: session.total
                }).catch(() => {});

                if (session.completed + session.failed >= session.total) {
                    chrome.tabs.sendMessage(tabId, {
                        action: "download_complete",
                        total: session.total,
                        completed: session.completed
                    }).catch(() => {});
                    downloadSessions.delete(tabId);
                    stopPollingIfEmpty();
                }
            }
            break;
        }
    }
});
