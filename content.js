// ─── HIGH-PRECISION VECTOR SVG ICONS ───
const ICONS = {
    cross: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    trash: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
    search: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    youtube: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`,
    vimeo: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.2 7.3c-.1 2.4-1.8 5.7-5.1 9.9-3.4 4.3-6.2 6.5-8.5 6.5-1.4 0-2.6-1.3-3.6-3.9-.7-2.6-1.4-5.2-2.1-7.8C2.2 9.4 1.5 8.1 1 8.1c-.2 0-.8.4-1.8 1.1L0 8.1c1.1-1 2.3-2 3.5-3 1.7-1.4 2.9-2.2 3.7-2.2 1.9 0 3 1.2 3.5 3.7.5 3 .9 4.9 1.1 5.7.5 2.1 1.1 3.1 1.7 3.1.5 0 1.2-.8 2.2-2.3 1-1.6 1.5-2.7 1.6-3.4.2-1.1-.3-1.7-1.5-1.7-.6 0-1.1.1-1.7.3 1.1-3.7 3.3-5.5 6.5-5.3 2.4.1 3.5 1.6 3.3 4.4z"></path></svg>`,
    loom: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`,
    drive: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l-8 14h16z"></path><path d="M12 22l8-14H4z"></path></svg>`,
    folder: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
    file: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`,
    audio: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
    copy: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    download: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    database: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
    page: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
    category: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
    zoom: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
    refresh: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
    check: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
    zap: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    stop: `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>`,
    play: `<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    info: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    warning: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    starOutline: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    starFilled: `<svg viewBox="0 0 24 24" width="13" height="13" fill="#FFB800" stroke="#FFB800" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    fileText: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
    table: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path></svg>`,
    checkSquare: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
    code: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    sun: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    scissors: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>`,
    book: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    help: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    mail: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    send: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
    globe: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    github: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
    xTwitter: `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    arrowLeft: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
    pause: `<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
    skipBack: `<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5" stroke-width="2.5"></line></svg>`,
    skipForward: `<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19" stroke-width="2.5"></line></svg>`,
    clock: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
};

// ─── INTERACTIVE ATHENA MASCOT ART SVG ───
function getMascotSVG(state = 'normal', size = 28) {
    const isBig = size > 30;
    return `<div class="cn-mascot-box cn-mascot-${state} ${isBig ? 'cn-mascot-large' : ''}" id="${isBig ? '' : 'cn-interactive-mascot'}" title="Athena: Click for study tips & quick insights!">
        <svg viewBox="0 0 36 36" width="${size}" height="${size}" class="cn-mascot-svg-art">
            <defs>
                <linearGradient id="owlBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#D81E5B"/>
                    <stop offset="100%" stop-color="#4A0520"/>
                </linearGradient>
                <linearGradient id="owlBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFF0F5"/>
                    <stop offset="100%" stop-color="#F8BBD0"/>
                </linearGradient>
            </defs>
            <!-- Owl Tufts/Ears -->
            <polygon points="9,9 13,12 8,17" fill="#B8184C"/>
            <polygon points="27,9 23,12 28,17" fill="#B8184C"/>
            <!-- Owl Body -->
            <ellipse cx="18" cy="20" rx="12" ry="11" fill="url(#owlBodyGrad)"/>
            <!-- Belly -->
            <ellipse cx="18" cy="22" rx="7.5" ry="7" fill="url(#owlBellyGrad)"/>
            <!-- Chest Details -->
            <path d="M15 20c1 1 2 1 3 0c1 1 2 1 3 0" stroke="#C2185B" stroke-width="1.2" stroke-linecap="round" fill="none"/>
            <path d="M16 23c0.7 0.8 1.3 0.8 2 0c0.7 0.8 1.3 0.8 2 0" stroke="#C2185B" stroke-width="1.2" stroke-linecap="round" fill="none"/>
            <!-- Eyes / Golden Spectacles -->
            <circle cx="12.5" cy="14" r="4.8" fill="#170311" stroke="#FFB800" stroke-width="1.5"/>
            <circle cx="23.5" cy="14" r="4.8" fill="#170311" stroke="#FFB800" stroke-width="1.5"/>
            <line x1="16.5" y1="14" x2="19.5" y2="14" stroke="#FFB800" stroke-width="1.5"/>
            <!-- Pupils with Blinking & Moods -->
            <g class="cn-owl-pupils">
                <circle cx="12.5" cy="14" r="2.5" fill="#FFC107"/>
                <circle cx="23.5" cy="14" r="2.5" fill="#FFC107"/>
                <circle cx="11.5" cy="13" r="1" fill="#FFFFFF"/>
                <circle cx="22.5" cy="13" r="1" fill="#FFFFFF"/>
            </g>
            <!-- Beak -->
            <polygon points="18,15.5 15.8,18.5 20.2,18.5" fill="#FF9800"/>
            <!-- Feet -->
            <ellipse cx="14" cy="30.5" rx="2.5" ry="1" fill="#FFA726"/>
            <ellipse cx="22" cy="30.5" rx="2.5" ry="1" fill="#FFA726"/>
        </svg>
        <span class="cn-mascot-pulse-ring"></span>
    </div>`;
}

const EXPORT_OPTIONS = [
    { id: 'raw', label: 'Raw Text', iconSvg: ICONS.fileText },
    { id: 'md', label: 'Markdown List', iconSvg: ICONS.fileText },
    { id: 'obsidian', label: 'Obsidian Notes', iconSvg: ICONS.checkSquare },
    { id: 'notion', label: 'Notion Table', iconSvg: ICONS.table },
    { id: 'html', label: 'HTML Links', iconSvg: ICONS.code },
    { id: 'yt_playlist', label: 'YouTube Playlist', iconSvg: ICONS.youtube }
];

let isSidebarOpen = false;
let isVaultMode = false;
let searchQuery = '';
let exportFormat = 'raw';
let isFormatDropdownOpen = false;
let activePreviewId = null;
let isAutoScrolling = false;
let autoScrollTimer = null;
let mascotMood = 'normal'; // 'normal', 'scanning', 'downloading', 'cheer'
let currentTheme = 'dark'; // 'dark' | 'light'

// In-Sidebar Video Trimmer State
let activeView = 'links'; // 'links' | 'trimmer'
let trimmerVideo = null;
let trimmerStartTime = 0;
let trimmerEndTime = 60;
let trimmerDuration = 300;
let trimmerMode = 'fast'; // 'fast' | 'accurate'
let isTrimmerPreviewPlaying = false;

function formatTimecode(seconds) {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function parseTimecode(str) {
    if (!str) return 0;
    const parts = str.trim().split(':').map(Number);
    if (parts.length === 3) {
        return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    } else if (parts.length === 2) {
        return (parts[0] * 60) + parts[1];
    } else if (parts.length === 1 && !isNaN(parts[0])) {
        return parts[0];
    }
    return 0;
}

function isYouTubeUrl(url) {
    if (!url) return false;
    return /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)/i.test(url);
}

function getYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
}

function sanitizeFilename(str) {
    if (!str) return 'clip';
    return str.replace(/[^a-zA-Z0-9_\-\.\ ]/g, '_').replace(/\s+/g, '_').trim();
}

// ─── EXTENSION RESILIENCE & CONTEXT INVALIDATION SHIELD ───
function isExtensionValid() {
    try {
        return !!(window.chrome && chrome.runtime && chrome.runtime.id);
    } catch {
        return false;
    }
}

function safeSendMessage(message, callback) {
    if (!isExtensionValid()) {
        if (callback) callback(null);
        return;
    }
    try {
        chrome.runtime.sendMessage(message, (response) => {
            const err = chrome.runtime.lastError;
            if (err) {
                if (callback) callback(null);
                return;
            }
            if (callback) callback(response);
        });
    } catch (e) {
        if (callback) callback(null);
    }
}

function safeGetURL(path) {
    if (!isExtensionValid()) return '';
    try {
        return chrome.runtime.getURL(path);
    } catch {
        return '';
    }
}

// Load saved theme safely
if (isExtensionValid() && chrome.storage && chrome.storage.local) {
    try {
        chrome.storage.local.get(['cnTheme'], (result) => {
            if (result && result.cnTheme) {
                currentTheme = result.cnTheme;
                if (sidebar) applyTheme(currentTheme);
            }
        });
    } catch (_) {}
}

// State
let pageState = { videos: [], drives: [] };
let vaultState = { videos: [], drives: [] };
let sidebar = null;
const ignoredIds = new Set();
let sniffedPdfs = [];

function fetchSniffedPdfs() {
    safeSendMessage({ action: "get_sniffed_pdfs" }, (res) => {
        if (res && res.success && Array.isArray(res.pdfs) && res.pdfs.length > 0) {
            let changed = false;
            res.pdfs.forEach(p => {
                if (!sniffedPdfs.some(sp => sp.url === p.url)) {
                    sniffedPdfs.push(p);
                    changed = true;
                }
            });
            if (changed) {
                scanPage();
                syncToVault();
                renderSidebar();
            }
        }
    });
}

// ─── PURE JAVASCRIPT MASTER CANVAS-TO-PDF COMPILER ───
function createPdfFromJpegs(jpegArrays, widths, heights) {
    const chunks = [];
    const offsets = [];
    let currentOffset = 0;

    function addChunk(chunk) {
        let buf;
        if (typeof chunk === 'string') {
            buf = new TextEncoder().encode(chunk);
        } else {
            buf = chunk;
        }
        chunks.push(buf);
        currentOffset += buf.length;
    }

    addChunk("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");

    const pageCount = jpegArrays.length;
    const pageObjIds = [];
    for (let i = 0; i < pageCount; i++) {
        pageObjIds.push(3 + i * 3);
    }

    // Obj 1: Catalog
    offsets[1] = currentOffset;
    addChunk(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);

    // Obj 2: Pages
    offsets[2] = currentOffset;
    const kidsStr = pageObjIds.map(id => `${id} 0 R`).join(" ");
    addChunk(`2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${pageCount} >>\nendobj\n`);

    for (let i = 0; i < pageCount; i++) {
        const pageId = 3 + i * 3;
        const imgId = 4 + i * 3;
        const contentId = 5 + i * 3;
        const w = widths[i];
        const h = heights[i];
        const jpegBuf = jpegArrays[i];

        // Page obj
        offsets[pageId] = currentOffset;
        addChunk(`${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im${i} ${imgId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`);

        // Image obj (DCTDecode draws raw JPEG directly with zero recompression)
        offsets[imgId] = currentOffset;
        addChunk(`${imgId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBuf.length} >>\nstream\n`);
        addChunk(jpegBuf);
        addChunk(`\nendstream\nendobj\n`);

        // Content stream obj
        const streamData = `q ${w} 0 0 ${h} 0 0 cm /Im${i} Do Q\n`;
        const streamBytes = new TextEncoder().encode(streamData);
        offsets[contentId] = currentOffset;
        addChunk(`${contentId} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n`);
        addChunk(streamBytes);
        addChunk(`endstream\nendobj\n`);
    }

    const totalObjs = 2 + pageCount * 3;
    const xrefOffset = currentOffset;
    addChunk(`xref\n0 ${totalObjs + 1}\n0000000000 65535 f \n`);
    for (let i = 1; i <= totalObjs; i++) {
        const off = String(offsets[i]).padStart(10, "0");
        addChunk(`${off} 00000 n \n`);
    }

    addChunk(`trailer\n<< /Size ${totalObjs + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);
    return new Blob(chunks, { type: 'application/pdf' });
}

async function compileCanvasPdf(filename, progressCallback) {
    try {
        if (progressCallback) progressCallback(10, 'Locating rendered PDF canvas pages...');

        let canvases = Array.from(document.querySelectorAll('.pdfp-page canvas, .vue-pdf-embed canvas, .pdfViewer .page canvas, canvas[data-page-number]'));
        if (canvases.length === 0) {
            const containers = document.querySelectorAll('.vue-pdf-embed, .pdfp, [class*="pdf"]');
            containers.forEach(c => {
                canvases.push(...Array.from(c.querySelectorAll('canvas')));
            });
        }

        if (canvases.length === 0) {
            showToast("No rendered canvas pages detected in document viewer.", "warning");
            return false;
        }

        if (progressCallback) progressCallback(20, `Processing ${canvases.length} lecture note page(s)...`);

        const jpegs = [];
        const widths = [];
        const heights = [];

        for (let i = 0; i < canvases.length; i++) {
            const cvs = canvases[i];
            if (cvs.width === 0 || cvs.height === 0) continue;

            const pct = 20 + Math.round(((i + 1) / canvases.length) * 65);
            if (progressCallback) progressCallback(pct, `Capturing page ${i + 1} of ${canvases.length}...`);

            widths.push(cvs.width);
            heights.push(cvs.height);

            const dataUrl = cvs.toDataURL('image/jpeg', 0.92);
            const base64 = dataUrl.split(',')[1];
            const binaryStr = atob(base64);
            const len = binaryStr.length;
            const bytes = new Uint8Array(len);
            for (let b = 0; b < len; b++) {
                bytes[b] = binaryStr.charCodeAt(b);
            }
            jpegs.push(bytes);
        }

        if (jpegs.length === 0) {
            showToast("Could not extract canvas graphics from the viewer.", "error");
            return false;
        }

        if (progressCallback) progressCallback(88, `Assembling ${jpegs.length}-page Master PDF...`);
        await new Promise(r => setTimeout(r, 60));

        const pdfBlob = createPdfFromJpegs(jpegs, widths, heights);

        if (progressCallback) progressCallback(98, 'Finalizing download...');

        const cleanName = (filename || 'Lecture_Notes.pdf').replace(/[^a-zA-Z0-9_\-\.\ ]/g, '_').trim();
        const safeName = cleanName.toLowerCase().endsWith('.pdf') ? cleanName : `${cleanName}.pdf`;

        const blobUrl = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = safeName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        }, 3000);

        if (progressCallback) progressCallback(100, `Done! Saved ${safeName}`);
        showToast(`Compiled & saved ${safeName} (${jpegs.length} pages)!`, "success");
        return true;
    } catch (err) {
        console.error("Canvas PDF compile error:", err);
        showToast("Failed to compile canvas PDF: " + err.message, "error");
        return false;
    }
}

const driveFileRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|folders\/)([a-zA-Z0-9_-]+)/i;
const ytRegex = /(?:(?:www\.)?(?:youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/i;
const loomRegex = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/i;
const zoomRegex = /zoom\.us\/rec\/(?:share\/|play\/)?([a-zA-Z0-9_-]+)/i;
const meetRegex = /meet\.google\.com\/([a-z0-9-]+)/i;
const audioRegex = /\.(mp3|wav|m4a|aac|ogg)(?:[\?#]|$)/i;

function cleanString(str) {
    if (!str) return '';
    return str.replace(/['"]+/g, '').replace(/(\.mp4|\.mkv|\.pdf|\.zip)$/i, '').trim();
}

function findCategory(element) {
    let current = element;
    while (current && current !== document.body) {
        let prev = current.previousElementSibling;
        while (prev) {
            if (['H1', 'H2', 'H3', 'H4', 'H5'].includes(prev.tagName)) {
                return prev.textContent.trim();
            }
            prev = prev.previousElementSibling;
        }
        current = current.parentElement;
    }
    return 'Uncategorized';
}

function resolveDOMName(el, fallbackName) {
    let name = '';
    if (el.tagName && el.tagName.toLowerCase() !== 'video' && el.tagName.toLowerCase() !== 'audio') {
        name = (el.textContent || '').trim();
    }
    
    const isGeneric = /^(download|click here|open|link|view|pdf|file|play|watch|video)$/i.test(name);
    
    if (isGeneric || !name || name.length < 2) {
        let betterName = el.getAttribute('title') || el.getAttribute('aria-label') || '';
        if (!betterName) {
            let current = el.parentElement;
            let depth = 0;
            while (current && depth < 6) {
                const headings = current.querySelectorAll('h1, h2, h3, h4, h5, h6, .text-lg, .text-xl, .font-bold, .font-semibold, [class*="title"], [class*="name"]');
                for (let h of headings) {
                    let hText = h.textContent.trim();
                    if (hText && hText.length > 3 && !/^(download|open|view|play)$/i.test(hText)) {
                        betterName = hText;
                        break;
                    }
                }
                if (betterName) break;
                
                let text = current.textContent.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
                text = text.replace(/To view this please enable JavaScript.*?HTML5/gi, '')
                           .replace(/\b(Open|Download|View|Play|Watch|drive\.google\.com|youtube\.com|vimeo\.com)\b/gi, '').trim();
                text = text.replace(/\s+(PDF|MP4|Video|Document|LIVE)\b/gi, '').replace(/•/g, '').trim();
                
                if (text && text.length > 3 && text.length < 300) {
                    betterName = text;
                    break;
                }
                current = current.parentElement;
                depth++;
            }
        }
        if (betterName) name = betterName;
    }
    
    name = name.replace(/\b(drive\.google\.com|youtube\.com|vimeo\.com)\b/gi, '')
               .replace(/\s+(PDF|MP4|Video|Document|LIVE)\b/gi, '')
               .replace(/•/g, '')
               .replace(/\s{2,}/g, ' ')
               .trim();
               
    if (/^(download|click here|open|link|view|pdf|file|play|watch|video)$/i.test(name) || !name || name.length < 2) {
        return fallbackName;
    }
    return name;
}

function scanPage() {
    const videos = [];
    const drives = [];
    const seen = new Set();
    let hasChanges = false;

    // 0. Current page YouTube
    const currentYtMatch = window.location.href.match(ytRegex);
    if (currentYtMatch) {
        const id = currentYtMatch[1];
        if (!seen.has(id) && !ignoredIds.has(id)) {
            seen.add(id);
            videos.push({
                id,
                category: 'Current Page',
                name: cleanString(document.title.replace(' - YouTube', '')),
                url: `https://www.youtube.com/embed/${id}`,
                cleanUrl: `https://youtu.be/${id}`,
                icon: ICONS.youtube,
                type: 'youtube',
                selected: false,
                starred: false
            });
        }
    }

    // 1. YouTube, Vimeo, Loom & Zoom Iframes
    document.querySelectorAll('iframe[src]').forEach(iframe => {
        if (iframe.closest('#cn-link-grabber-sidebar')) return;
        const src = iframe.src;

        const ytMatch = src.match(ytRegex);
        if (ytMatch) {
            const id = ytMatch[1];
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            const category = findCategory(iframe);
            const titleAttr = (iframe.getAttribute('title') || '').trim();
            videos.push({
                id,
                category,
                name: titleAttr || `YouTube Video (${id})`,
                url: `https://www.youtube.com/embed/${id}`,
                cleanUrl: `https://youtu.be/${id}`,
                icon: ICONS.youtube,
                type: 'youtube',
                selected: false,
                starred: false
            });
            return;
        }

        const vimeoMatch = src.match(vimeoRegex);
        if (vimeoMatch) {
            const id = vimeoMatch[1];
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            const category = findCategory(iframe);
            const titleAttr = (iframe.getAttribute('title') || '').trim();
            videos.push({
                id,
                category,
                name: titleAttr || `Vimeo Video (${id})`,
                url: `https://vimeo.com/${id}`,
                cleanUrl: `https://vimeo.com/${id}`,
                icon: ICONS.vimeo,
                type: 'vimeo',
                selected: false,
                starred: false
            });
            return;
        }

        const loomMatch = src.match(loomRegex);
        if (loomMatch) {
            const id = loomMatch[1];
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            const category = findCategory(iframe);
            const titleAttr = (iframe.getAttribute('title') || '').trim();
            videos.push({
                id,
                category,
                name: titleAttr || `Loom Recording (${id.slice(0, 8)})`,
                url: `https://www.loom.com/share/${id}`,
                cleanUrl: `https://www.loom.com/share/${id}`,
                icon: ICONS.loom,
                type: 'loom',
                selected: false,
                starred: false
            });
            return;
        }
    });

    // 1b. Plyr & Custom Educational Players (Bondi Pathshala, Nuxt 3, etc.)
    document.querySelectorAll('[data-player-engine="plyr"], .bp-plyr, .plyr, [data-provider="youtube"], [data-video-id]').forEach(el => {
        if (el.closest('#cn-link-grabber-sidebar')) return;
        const videoId = el.getAttribute('data-video-id') || el.getAttribute('data-plyr-embed-id');
        if (videoId && videoId.length === 11) {
            if (seen.has(videoId) || ignoredIds.has(videoId)) return;
            seen.add(videoId);
            const category = findCategory(el);
            const heading = el.closest('.edu-main--player, .mc-shell, main, body')?.querySelector('h1, h2, h3, .lesson-title, [class*="title"]');
            let name = heading ? cleanString(heading.textContent) : cleanString(document.title.replace(' - YouTube', ''));
            if (!name || name.length < 2) name = `Lecture Video (${videoId})`;
            videos.push({
                id: videoId,
                category,
                name,
                url: `https://www.youtube.com/embed/${videoId}`,
                cleanUrl: `https://youtu.be/${videoId}`,
                icon: ICONS.youtube,
                type: 'youtube',
                selected: false,
                starred: false
            });
        }
    });

    // 2. Links
    document.querySelectorAll('a[href]').forEach(a => {
        if (a.closest('#cn-link-grabber-sidebar')) return;
        const href = a.href;
        const category = findCategory(a);
        
        // Drive Match
        const driveMatch = href.match(driveFileRegex);
        if (driveMatch) {
            const id = driveMatch[1];
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            const isFolder = href.includes('/folders/');
            let name = cleanString(resolveDOMName(a, `Drive File (${id.slice(0, 8)}…)`));
            drives.push({ id, category, name, url: href, cleanUrl: href, icon: isFolder ? ICONS.folder : ICONS.drive, selected: false, starred: false });
            return;
        }

        // PDF Match
        if (href.toLowerCase().includes('.pdf')) {
            const id = href;
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            const matchName = href.match(/([^\/]+?\.pdf)/i);
            const fileName = matchName ? decodeURIComponent(matchName[1].split('?')[0]) : 'Document.pdf';
            let name = cleanString(resolveDOMName(a, fileName));
            drives.push({ id, category, name, url: href, cleanUrl: href, icon: ICONS.file, selected: false, starred: false });
            return;
        }

        // YouTube Link
        const ytMatch = href.match(ytRegex);
        if (ytMatch) {
            const id = ytMatch[1];
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            let name = cleanString(resolveDOMName(a, `YouTube Video (${id})`));
            videos.push({
                id,
                category,
                name,
                url: `https://www.youtube.com/embed/${id}`,
                cleanUrl: `https://youtu.be/${id}`,
                icon: ICONS.youtube,
                type: 'youtube',
                selected: false,
                starred: false
            });
            return;
        }

        // Audio Match
        if (href.match(audioRegex)) {
            const id = href;
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            let name = cleanString(resolveDOMName(a, 'Audio File'));
            drives.push({ id, category, name, url: href, cleanUrl: href, icon: ICONS.audio, selected: false, starred: false });
            return;
        }
        
        // Generic Video Link
        if (href.match(/\.(mp4|mkv|webm|avi|mov|m3u8)(\?|$)/i)) {
            const id = href;
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            let name = cleanString(resolveDOMName(a, 'Video Link'));
            videos.push({ id, category, name, url: href, cleanUrl: href, icon: ICONS.page, type: 'generic_video', selected: false, starred: false });
            return;
        }

        // Zoom Match
        const zoomMatch = href.match(zoomRegex);
        if (zoomMatch) {
            const id = zoomMatch[1];
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            let name = cleanString(resolveDOMName(a, `Zoom Recording`));
            videos.push({ id, category, name, url: href, cleanUrl: href, icon: ICONS.zoom, type: 'zoom', selected: false, starred: false });
            return;
        }
    });

    // 3. Document Embeds & Iframes
    document.querySelectorAll('iframe[src], embed[src], object[data]').forEach(el => {
        if (el.closest('#cn-link-grabber-sidebar')) return;
        const src = el.src || el.data;
        if (!src) return;
        
        const category = findCategory(el);
        const driveMatch = src.match(driveFileRegex);
        if (driveMatch) {
            const id = driveMatch[1];
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            let name = cleanString(el.getAttribute('title') || `Embedded Drive File (${id.slice(0, 8)}…)`);
            const url = `https://drive.google.com/file/d/${id}/view`;
            drives.push({ id, category, name, url: url, cleanUrl: url, icon: ICONS.drive, selected: false, starred: false });
        } else if (src.toLowerCase().includes('.pdf') || el.type === 'application/pdf') {
            const id = src;
            if (seen.has(id) || ignoredIds.has(id)) return;
            seen.add(id);
            const matchName = src.match(/([^\/]+?\.pdf)/i);
            const fileName = matchName ? decodeURIComponent(matchName[1].split('?')[0]) : 'Embedded Document';
            let name = cleanString(el.getAttribute('title') || fileName);
            drives.push({ id, category, name, url: src, cleanUrl: src, icon: ICONS.file, selected: false, starred: false });
        }
    });

    // 3b. Modern Web & Vue Canvas PDF Readers (vue-pdf-embed, pdfp, pdf.js, Bondi Pathshala, etc.)
    // A. Direct Sniffed Network PDFs
    if (sniffedPdfs.length > 0) {
        sniffedPdfs.forEach(sp => {
            if (seen.has(sp.url) || ignoredIds.has(sp.url)) return;
            seen.add(sp.url);
            const category = findCategory(document.querySelector('.vue-pdf-embed, .pdfp, button.cpdf-btn--dl') || document.body);
            drives.push({
                id: sp.url,
                category,
                name: sp.filename || 'Lecture Notes (Original PDF)',
                url: sp.url,
                cleanUrl: sp.url,
                icon: ICONS.file,
                selected: false,
                starred: false
            });
        });
    }

    // B. Canvas PDF Reader Elements & Native Download Triggers
    const pdfCanvasContainers = document.querySelectorAll('.vue-pdf-embed, .pdfp, .pdfp-page, .pdfViewer, [data-pdf-container]');
    const pdfDlBtn = document.querySelector('button.cpdf-btn--dl, button[aria-label*="ডাউনলোড" i], button[aria-label*="download" i], .pdf-download-btn, a[download*=".pdf" i]');
    
    if (pdfCanvasContainers.length > 0 || pdfDlBtn) {
        const pages = document.querySelectorAll('.pdfp-page canvas, .vue-pdf-embed canvas, .pdfViewer .page canvas');
        const pageCount = pages.length || pdfCanvasContainers.length || 1;
        const canvasPdfId = 'canvas-pdf::' + window.location.pathname;

        if (!seen.has(canvasPdfId) && !ignoredIds.has(canvasPdfId)) {
            seen.add(canvasPdfId);
            const category = findCategory(pdfDlBtn || pdfCanvasContainers[0] || document.body);
            
            let docName = '';
            if (pdfDlBtn) {
                docName = (pdfDlBtn.getAttribute('aria-label') || '').replace(/ডাউনলোড|download/gi, '').trim();
            }
            if (!docName) {
                const heading = document.querySelector('h1, h2, .lesson-title, [class*="lesson-title"]');
                docName = heading ? cleanString(heading.textContent) : 'Lecture Notes';
            }
            if (!docName.toLowerCase().endsWith('.pdf')) {
                docName += '.pdf';
            }

            drives.push({
                id: canvasPdfId,
                category,
                name: `${docName} (${pageCount} Pages)`,
                url: '#canvas-pdf',
                cleanUrl: window.location.href,
                icon: ICONS.file,
                isCanvasPdf: true,
                canvasCount: pageCount,
                selected: false,
                starred: false
            });
        }
    }

    // 4. HTML5 Video and Audio Elements (DOM & Open Shadow Roots)
    const mediaElements = Array.from(document.querySelectorAll('video, audio'));
    document.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) {
            mediaElements.push(...Array.from(el.shadowRoot.querySelectorAll('video, audio')));
        }
    });

    mediaElements.forEach(el => {
        if (el.closest && el.closest('#cn-link-grabber-sidebar')) return;
        let src = el.currentSrc || el.src;
        if (!src) {
            const source = el.querySelector('source[src]');
            if (source) src = source.src || source.getAttribute('src');
        }
        if (!src || src.startsWith('data:')) return;

        const isAudioTag = el.tagName.toLowerCase() === 'audio';
        const id = src;
        if (seen.has(id) || ignoredIds.has(id)) return;
        seen.add(id);

        const category = findCategory(el);
        if (isAudioTag) {
            let name = cleanString(resolveDOMName(el, 'Audio Track'));
            drives.push({ id, category, name, url: src, cleanUrl: src, icon: ICONS.audio, selected: false, starred: false });
        } else {
            let durStr = (!isNaN(el.duration) && el.duration > 0) ? ` (${Math.round(el.duration)}s)` : '';
            let name = cleanString(resolveDOMName(el, `Lecture Video${durStr}`));
            videos.push({ id, category, name, url: src, cleanUrl: src, icon: ICONS.page, type: 'html5_video', selected: false, starred: false });
        }
    });

    if (pageState.videos.length !== videos.length || pageState.drives.length !== drives.length) {
        hasChanges = true;
    } else {
        const oldIds = new Set([...pageState.videos.map(v => v.id), ...pageState.drives.map(d => d.id)]);
        for (let item of [...videos, ...drives]) {
            if (!oldIds.has(item.id)) {
                hasChanges = true;
                break;
            }
        }
    }

    if (hasChanges) {
        const starredMap = new Map();
        const selectedMap = new Map();
        [...pageState.videos, ...pageState.drives].forEach(i => {
            if (i.starred) starredMap.set(i.id, true);
            if (i.selected) selectedMap.set(i.id, true);
        });

        videos.forEach(v => {
            if (starredMap.has(v.id)) v.starred = true;
            if (selectedMap.has(v.id)) v.selected = true;
        });
        drives.forEach(d => {
            if (starredMap.has(d.id)) d.starred = true;
            if (selectedMap.has(d.id)) d.selected = true;
        });

        pageState.videos = videos;
        pageState.drives = drives;
        fetchYT(pageState.videos);
    }
    
    return hasChanges;
}

function fetchYT(videoList) {
    let pending = 0;
    videoList.forEach(v => {
        if (v.type === 'youtube' && (v.name.includes('YouTube Video (') || v.name.toLowerCase() === 'youtube video player')) {
            pending++;
            const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.id}&format=json`;
            fetch(oembedUrl)
                .then(res => res.json())
                .then(data => {
                    if (data && data.title) {
                        v.name = cleanString(data.title);
                    }
                })
                .catch(() => {})
                .finally(() => {
                    pending--;
                    if (pending === 0 && !isVaultMode) {
                        renderSidebar();
                    }
                });
        }
    });
}

function syncToVault() {
    if (!isExtensionValid()) return;
    safeSendMessage({ action: "get_vault" }, (response) => {
        if (response && response.vault) {
            vaultState = response.vault;
            let changed = false;
            pageState.videos.forEach(pv => {
                const existing = vaultState.videos.find(v => v.id === pv.id);
                if (!existing) {
                    vaultState.videos.push({ ...pv, selected: false });
                    changed = true;
                } else if (existing.starred !== undefined) {
                    pv.starred = existing.starred;
                }
            });
            pageState.drives.forEach(pd => {
                const existing = vaultState.drives.find(d => d.id === pd.id);
                if (!existing) {
                    vaultState.drives.push({ ...pd, selected: false });
                    changed = true;
                } else if (existing.starred !== undefined) {
                    pd.starred = existing.starred;
                }
            });

            if (changed) {
                safeSendMessage({ action: "save_vault", vault: vaultState });
            }
        }
    });
}

// ─── IN-SIDEBAR CUSTOM TOAST NOTIFICATION SYSTEM ───
let _toastTimer = null;
function showToast(message, type = 'info', title = null) {
    // Suppress routine info notices completely to maintain a clean interface
    if (type === 'info') return;

    const toast = document.getElementById('cn-toast');
    if (!toast) return;
    
    const iconEl = toast.querySelector('.cn-toast-icon');
    const msgEl = toast.querySelector('.cn-toast-msg');
    
    if (iconEl) iconEl.innerHTML = type === 'warning' ? ICONS.warning : ICONS.check;
    if (msgEl) msgEl.textContent = message;
    
    toast.className = `cn-toast cn-toast-${type}`;
    
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 2800);
}

// ─── AUTO-SCROLL ENGINE ───
function stopAutoScroll() {
    if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
    }
    isAutoScrolling = false;
    mascotMood = 'normal';
    updateMascotMood('normal');
    
    const btn = document.getElementById('btn-autoscroll');
    if (btn) {
        btn.innerHTML = `${ICONS.zap} Auto-Scroll`;
        btn.classList.remove('btn-danger', 'pulse-anim');
        btn.classList.add('btn-secondary');
    }
}

function startAutoScroll() {
    isAutoScrolling = true;
    mascotMood = 'scanning';
    updateMascotMood('scanning');

    const btn = document.getElementById('btn-autoscroll');
    if (btn) {
        btn.innerHTML = `${ICONS.stop} Stop`;
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-danger', 'pulse-anim');
    }
    
    autoScrollTimer = setInterval(() => {
        window.scrollBy({ top: 650, behavior: 'smooth' });
        if (scanPage()) {
            syncToVault();
            renderSidebar();
        }
        
        if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
            stopAutoScroll();
            showMascotSpeech("Scan completed! All lectures uncovered.");
        }
    }, 550);
}

let _speechTimeout = null;
function showMascotSpeech(text) {
    const bubble = document.getElementById('cn-mascot-speech');
    const textEl = document.getElementById('cn-speech-text');
    if (!bubble || !textEl) return;
    
    textEl.textContent = text;
    bubble.classList.remove('hidden');
    
    if (_speechTimeout) clearTimeout(_speechTimeout);
    _speechTimeout = setTimeout(() => {
        bubble.classList.add('hidden');
    }, 4500);
}

function updateMascotMood(mood) {
    const mascot = document.getElementById('cn-interactive-mascot');
    if (!mascot) return;
    mascot.className = `cn-mascot-box cn-mascot-${mood}`;
}

// ─── THEME ENGINE (LIGHT & DARK) ───
function applyTheme(theme) {
    currentTheme = theme;
    if (sidebar) {
        if (theme === 'light') {
            sidebar.classList.add('cn-theme-light');
        } else {
            sidebar.classList.remove('cn-theme-light');
        }
    }
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
        btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
        btn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`;
    }
    if (m3WavyProgressInstance) {
        const waveColor = theme === 'light' ? '#B8184C' : '#E91E63';
        m3WavyProgressInstance.setColor(waveColor);
    }
}

// ─── MATERIAL 3 (M3) EXPRESSIVE WAVY PROGRESS ENGINE ───
let m3ProgressBarIndicator = null;
let m3WavyProgressInstance = null;
function updateProgressIndicator(pct, label) {
    const progressBar = document.getElementById('cn-progress-bar');
    const statusEl = document.getElementById('cn-progress-status');
    const pctEl = document.getElementById('cn-progress-pct');
    const spinnerMount = document.getElementById('m3-progress-spinner-mount');
    const wavyMount = document.getElementById('m3-wavy-progress-mount');

    if (!progressBar) return;
    progressBar.classList.remove('hidden');

    if (spinnerMount && window.M3LoadingIndicator && (!m3ProgressBarIndicator || !spinnerMount.hasChildNodes())) {
        if (m3ProgressBarIndicator) m3ProgressBarIndicator.destroy();
        spinnerMount.innerHTML = '';
        m3ProgressBarIndicator = window.M3LoadingIndicator.mount(spinnerMount, {
            size: 16,
            color: '#BE185D',
            contained: false
        });
    }

    const cleanPct = Math.min(100, Math.max(0, Math.round(pct)));
    if (pctEl) pctEl.textContent = `${cleanPct}%`;
    if (statusEl && label) statusEl.textContent = label;

    if (wavyMount && window.M3WavyProgress && (!m3WavyProgressInstance || !wavyMount.hasChildNodes())) {
        if (m3WavyProgressInstance) m3WavyProgressInstance.destroy();
        wavyMount.innerHTML = '';
        const waveColor = currentTheme === 'light' ? '#B8184C' : '#E91E63';
        const trackColor = currentTheme === 'light' ? 'rgba(184, 24, 76, 0.18)' : 'rgba(255, 255, 255, 0.14)';
        m3WavyProgressInstance = window.M3WavyProgress.createLinear(wavyMount, {
            color: waveColor,
            trackColor: trackColor,
            stopDotColor: currentTheme === 'light' ? '#B8184C' : '#FAF2F5',
            value: cleanPct
        });
    } else if (m3WavyProgressInstance) {
        m3WavyProgressInstance.setProgress(cleanPct);
    }
}

// ─── UI HELPERS ───
function getActiveState() {
    return isVaultMode ? vaultState : pageState;
}

function filterItems(items) {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(i => (i.name || '').toLowerCase().includes(q) || (i.url || '').toLowerCase().includes(q) || (i.category || '').toLowerCase().includes(q));
}

function groupByCategory(items) {
    const groups = {};
    items.forEach(item => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
    });
    return groups;
}

function formatCopyText(item) {
    const link = item.cleanUrl || item.url;
    const cat = (item.category && item.category !== 'Uncategorized') ? `Group: ${item.category}\n` : '';
    
    if (exportFormat === 'md') {
        return `* [${item.name}](${link})`;
    } else if (exportFormat === 'obsidian') {
        const tag = (item.category && item.category !== 'Uncategorized')
            ? ` #${item.category.replace(/[^a-zA-Z0-9]/g, '_')}`
            : '';
        return `- [ ] [${item.name}](${link}) #cn-grabber${tag}`;
    } else if (exportFormat === 'notion') {
        return `| ${item.type || 'document'} | ${item.name} | [Open Link](${link}) | ${item.category || 'General'} |`;
    } else if (exportFormat === 'html') {
        return `<a href="${link}">${item.name}</a>`;
    }
    return `${cat}Title: ${item.name}\nLink: ${link}`;
}

function generateHTMLForItem(item, type) {
    const checkedStr = item.selected ? 'checked' : '';
    const isStarred = !!item.starred;
    const isPlaying = activePreviewId === item.id;
    
    let linksHtml = '';
    if (item.type === 'youtube') {
        linksHtml = `
            <div class="input-group">
                <span class="input-label">CLEAN</span>
                <input class="link-input" type="text" value="${item.cleanUrl}" readonly>
                <button class="btn-icon copy-url-btn" data-copy="${item.cleanUrl}" title="Copy Clean URL">${ICONS.copy}</button>
            </div>
            <div class="input-group">
                <span class="input-label">EMBED</span>
                <input class="link-input" type="text" value="${item.url}" readonly>
                <button class="btn-icon copy-url-btn" data-copy="${item.url}" title="Copy Embed URL">${ICONS.copy}</button>
            </div>`;
    } else {
        linksHtml = `
            <div class="input-group">
                <span class="input-label">LINK</span>
                <input class="link-input" type="text" value="${item.url}" readonly>
                <button class="btn-icon copy-url-btn" data-copy="${item.url}" title="Copy Link">${ICONS.copy}</button>
            </div>`;
    }

    let previewHtml = '';
    if (isPlaying) {
        if (item.type === 'youtube') {
            previewHtml = `
                <div class="cn-mini-player-wrapper">
                    <iframe class="cn-mini-player" src="https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1" allow="autoplay; fullscreen"></iframe>
                </div>`;
        } else if (item.type === 'vimeo') {
            previewHtml = `
                <div class="cn-mini-player-wrapper">
                    <iframe class="cn-mini-player" src="https://player.vimeo.com/video/${item.id}?autoplay=1" allow="autoplay; fullscreen"></iframe>
                </div>`;
        } else if (item.type === 'loom') {
            previewHtml = `
                <div class="cn-mini-player-wrapper">
                    <iframe class="cn-mini-player" src="https://www.loom.com/embed/${item.id}?autoplay=1" allow="autoplay; fullscreen"></iframe>
                </div>`;
        } else if (item.url && item.url.match(audioRegex)) {
            previewHtml = `
                <div class="cn-mini-audio-wrapper">
                    <audio src="${item.url}" controls autoplay style="width:100%;"></audio>
                </div>`;
        } else {
            previewHtml = `
                <div class="cn-mini-player-wrapper">
                    <video class="cn-mini-player" src="${item.url}" controls autoplay></video>
                </div>`;
        }
    }

    const canPreview = type === 'videos' || (item.url && item.url.match(audioRegex));
    const copyText = formatCopyText(item).replace(/"/g, '&quot;');

    return `
        <div class="video-item ${isStarred ? 'is-starred' : ''}">
            <div class="item-header">
                <div class="checkbox-wrapper">
                    <input type="checkbox" class="custom-checkbox item-checkbox" data-type="${type}" data-id="${item.id}" ${checkedStr}>
                    <div class="checkmark">${ICONS.check}</div>
                </div>
                <div class="item-title-wrapper">
                    <div class="item-title-row">
                        <div class="item-title">${item.icon} ${item.name}</div>
                        <button class="btn-star ${isStarred ? 'starred' : ''}" data-type="${type}" data-id="${item.id}" title="${isStarred ? 'Unstar' : 'Pin to top'}">
                            ${isStarred ? ICONS.starFilled : ICONS.starOutline}
                        </button>
                    </div>
                    <div class="item-inputs">${linksHtml}</div>
                    ${previewHtml}
                </div>
            </div>
            <div class="item-actions">
                ${canPreview ? `<button class="btn btn-small preview-btn ${isPlaying ? 'btn-danger' : 'btn-secondary'}" data-id="${item.id}">${isPlaying ? `${ICONS.cross} Close` : `${ICONS.play} Preview`}</button>` : ''}
                ${type === 'videos' ? `<button class="btn btn-small btn-trim trim-video-btn" data-url="${item.cleanUrl || item.url}" data-title="${item.name.replace(/"/g, '&quot;')}" title="Trim & export video clip in Studio">${ICONS.scissors} Download / Trim</button>` : ''}
                <button class="btn btn-small copy-single-btn" data-copy="${copyText}">${ICONS.copy} Copy</button>
                <button class="btn btn-small btn-open-link" data-url="${item.cleanUrl || item.url}" title="Open link in a new tab">${ICONS.search} Open</button>
                ${type === 'drives' ? `<button class="btn btn-small btn-success download-single-btn" data-url="${item.cleanUrl || item.url}" data-title="${item.name.replace(/"/g, '&quot;')}" data-cat="${(item.category || '').replace(/"/g, '&quot;')}">${ICONS.download} Download</button>` : ''}
                <button class="btn-icon-cross delete-single-btn" data-type="${type}" data-id="${item.id}" title="Remove link">${ICONS.cross}</button>
            </div>
        </div>`;
}

function renderSectionHTML(title, items, type) {
    const filtered = filterItems(items);
    if (filtered.length === 0) {
        return `
            <div class="section-label"><span class="section-icon-svg">${type === 'videos' ? ICONS.youtube : ICONS.drive}</span> ${title}</div>
            <div class="empty-state">
                <div class="empty-mascot-box">${getMascotSVG('normal', 44)}</div>
                <div class="empty-speech-bubble">
                    <span class="empty-bubble-arrow"></span>
                    <p class="empty-bubble-text">No ${title.toLowerCase()} detected on this page. Tap <strong>Auto-Scroll</strong> to uncover dynamically loaded lectures.</p>
                </div>
            </div>`;
    }

    const selectedCount = filtered.filter(i => i.selected).length;
    const isAllSelected = selectedCount === filtered.length && filtered.length > 0;

    let playlistBtnHtml = '';
    if (type === 'videos') {
        const hasYt = filtered.some(v => v.type === 'youtube');
        if (hasYt) {
            playlistBtnHtml = `<button class="btn btn-small btn-playlist yt-playlist-btn" title="Open selected or all YouTube videos as playlist">${ICONS.play} Playlist</button>`;
        }
    }

    let html = `
        <div class="section-header-row">
            <div class="section-label">
                <span class="section-icon-svg">${type === 'videos' ? ICONS.youtube : ICONS.drive}</span> ${title}
                <span class="section-count">${filtered.length}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
                ${playlistBtnHtml}
                <button class="btn btn-small select-all-btn" data-type="${type}" data-select="${!isAllSelected}">${isAllSelected ? 'Unselect All' : 'Select All'}</button>
            </div>
        </div>
    `;

    const grouped = groupByCategory(filtered);
    for (const [cat, catItems] of Object.entries(grouped)) {
        if (cat !== 'Uncategorized' || Object.keys(grouped).length > 1) {
            html += `<div class="category-label">
                        <span style="display:flex; align-items:center; gap:6px;">${ICONS.category} ${cat}</span>
                        <button class="btn btn-small select-group-btn" data-type="${type}" data-cat="${cat.replace(/"/g, '&quot;')}" style="padding:2px 8px; font-size:10px;">${ICONS.check} All</button>
                    </div>`;
        }
        
        const sortedItems = [...catItems].sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));
        sortedItems.forEach(item => {
            html += generateHTMLForItem(item, type);
        });
    }

    return html;
}

function openInSidebarTrimmer(item) {
    activeView = 'trimmer';
    trimmerVideo = item;
    renderSidebar();
}

function renderTrimmerView() {
    const videoUrlParam = trimmerVideo ? encodeURIComponent(trimmerVideo.url || trimmerVideo.cleanUrl || '') : '';
    const videoTitleParam = trimmerVideo ? encodeURIComponent(trimmerVideo.title || trimmerVideo.name || 'Video') : '';
    const iframeSrc = chrome.runtime.getURL(`sidepanel/index.html?theme=${currentTheme}&embedded=true&videoUrl=${videoUrlParam}&videoTitle=${videoTitleParam}`);

    return `
        <!-- Compact In-Sidebar Toast Notification -->
        <div id="cn-toast" class="cn-toast hidden">
            <div class="cn-toast-icon"></div>
            <div class="cn-toast-msg"></div>
            <button class="cn-toast-close" type="button" title="Dismiss">${ICONS.cross}</button>
        </div>

        <div class="cn-trimmer-view-container">
            <div class="cn-header cn-header-trimmer">
                <div class="cn-header-top">
                    <div class="cn-logo-badge" id="cn-header-logo-badge">
                        ${getMascotSVG(mascotMood)}
                        <div class="cn-logo-text">
                            <h2>CN Grabber</h2>
                            <span class="cn-pro-pill">PRO</span>
                        </div>
                    </div>
                    <div class="cn-header-actions">
                        <button class="cn-btn-back-nav" id="btn-trimmer-back" title="Return to Links">
                            ${ICONS.arrowLeft} Links
                        </button>
                        <button class="btn-icon" id="btn-trimmer-refresh" title="Rescan Videos">${ICONS.refresh}</button>
                        <button class="btn-icon" id="btn-theme-toggle" title="Switch Theme">${currentTheme === 'dark' ? ICONS.sun : ICONS.moon}</button>
                        <button class="btn-icon cn-close-btn" id="cn-close-sidebar" title="Close Sidebar">${ICONS.cross}</button>
                    </div>
                </div>
            </div>

            <!-- Full-power React Trimmer Studio embedded directly inside the sidebar with zero CORS/DOMException issues -->
            <div class="cn-trimmer-iframe-wrap">
                <iframe 
                    id="cn-trimmer-studio-iframe" 
                    class="cn-trimmer-studio-iframe" 
                    src="${iframeSrc}"
                    title="CN Link Grabber Video Trimming Studio">
                </iframe>
            </div>
        </div>
    `;
}

function attachTrimmerEvents() {
    const btnBack = document.getElementById('btn-trimmer-back');
    if (btnBack) {
        btnBack.onclick = () => {
            activeView = 'links';
            renderSidebar();
        };
    }

    const btnRefresh = document.getElementById('btn-trimmer-refresh');
    if (btnRefresh) {
        btnRefresh.onclick = () => {
            const iframe = document.getElementById('cn-trimmer-studio-iframe');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ action: 'rescan_videos' }, '*');
            }
        };
    }

    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) {
        btnTheme.onclick = () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
            chrome.storage.local.set({ cnTheme: currentTheme });
            
            const iframe = document.getElementById('cn-trimmer-studio-iframe');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ action: 'set_theme', theme: currentTheme }, '*');
            }
            renderSidebar();
        };
    }

    const btnClose = document.getElementById('cn-close-sidebar');
    if (btnClose) {
        btnClose.onclick = () => toggleSidebar();
    }
}

// Global listener for actions dispatched from embedded trimmer studio
window.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'cn_back_to_links') {
        activeView = 'links';
        renderSidebar();
    }
});

function renderSidebar() {
    if (!sidebar) return;
    
    let contentContainer = document.getElementById('cn-sidebar-content');
    if (!contentContainer) contentContainer = sidebar;
    if (!contentContainer) return;

    if (activeView === 'trimmer') {
        contentContainer.innerHTML = renderTrimmerView();
        attachTrimmerEvents();
        return;
    }

    const scrollContainer = document.getElementById('cn-content');
    const scrollPos = scrollContainer ? scrollContainer.scrollTop : 0;

    const state = getActiveState();
    const totalCount = state.videos.length + state.drives.length;
    const currentFormatObj = EXPORT_OPTIONS.find(f => f.id === exportFormat) || EXPORT_OPTIONS[0];

    let html = `
        <!-- Compact In-Sidebar Toast Notification -->
        <div id="cn-toast" class="cn-toast hidden">
            <div class="cn-toast-icon"></div>
            <div class="cn-toast-msg"></div>
            <button class="cn-toast-close" type="button" title="Dismiss">${ICONS.cross}</button>
        </div>

        <div class="cn-header">
            <div class="cn-header-top">
                <div class="cn-logo-badge" id="cn-header-logo-badge">
                    ${getMascotSVG(mascotMood)}
                    <div class="cn-logo-text">
                        <h2>CN Grabber</h2>
                        <span class="cn-pro-pill">PRO</span>
                    </div>
                </div>
                <div class="cn-header-actions">
                    <span class="cn-count-badge" title="Total captured items">${totalCount} Items</span>
                    <button class="btn-icon" id="btn-theme-toggle" title="Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Theme">${currentTheme === 'dark' ? ICONS.sun : ICONS.moon}</button>
                    <button class="btn-icon" id="btn-help-contact" title="Contact & Feature Requests">${ICONS.help}</button>
                    <button class="btn-icon" id="btn-open-docs" title="Documentation & Changelog">${ICONS.book}</button>
                    <button class="btn-icon" id="btn-refresh" title="Force Refresh Scanner">${ICONS.refresh}</button>
                    <button class="btn-icon cn-close-btn" id="cn-close-sidebar" title="Close Sidebar">${ICONS.cross}</button>
                </div>
            </div>

            <!-- Floating Athena Mascot Speech Bubble -->
            <div id="cn-mascot-speech" class="cn-mascot-speech hidden">
                <span class="cn-speech-arrow"></span>
                <span id="cn-speech-text" class="cn-speech-text"></span>
            </div>
            
            <div class="cn-vault-toggle">
                <button class="cn-vault-btn ${!isVaultMode ? 'active' : ''}" id="btn-mode-page">${ICONS.page} Current Page</button>
                <button class="cn-vault-btn ${isVaultMode ? 'active' : ''}" id="btn-mode-vault">${ICONS.database} Global Vault</button>
            </div>

            <div class="cn-control-row">
                <div class="cn-search-box">
                    ${ICONS.search}
                    <input type="text" id="cn-search" placeholder="Search resources..." value="${searchQuery}">
                </div>
                <button class="btn btn-small ${isAutoScrolling ? 'btn-danger pulse-anim' : 'btn-secondary'}" id="btn-autoscroll" title="Automatically scroll page to discover lazy-loaded content">
                    ${isAutoScrolling ? `${ICONS.stop} Stop` : `${ICONS.zap} Auto-Scroll`}
                </button>
            </div>
        </div>

        <!-- Material 3 (M3) Expressive Wavy Linear Progress Bar -->
        <div id="cn-progress-bar" class="hidden">
            <div class="m3-progress-info">
                <div class="m3-progress-title-box">
                    <span id="m3-progress-spinner-mount" class="m3-spinner-mount">
                        <span class="m3-spinner-dot"></span>
                    </span>
                    <span id="cn-progress-status" class="m3-progress-status">Downloading...</span>
                </div>
                <span id="cn-progress-pct" class="m3-progress-pill">0%</span>
            </div>
            <!-- M3 Expressive Traveling Wavy Sine Wave Progress Mount -->
            <div id="m3-wavy-progress-mount" class="m3-linear-wavy-root" style="width: 100%; height: 16px;"></div>
        </div>
        
        <!-- Confirmation Modal -->
        <div id="cn-confirm-modal" class="hidden">
            <div class="modal-content">
                <div class="modal-icon-badge">${ICONS.trash}</div>
                <h3>Clear Global Vault?</h3>
                <p>This action will permanently delete all stored links from your local browser vault.</p>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="btn-cancel-clear">Cancel</button>
                    <button class="btn btn-danger" id="btn-confirm-clear">Delete All</button>
                </div>
            </div>
        </div>

        <div id="cn-content">
            <div id="videos-list">${renderSectionHTML("Videos", state.videos, "videos")}</div>
            <div style="margin-top: 14px;"></div>
            <div id="drives-list">${renderSectionHTML("Documents", state.drives, "drives")}</div>
        </div>
        
        <div class="cn-footer">
            <div class="cn-footer-row">
                <!-- Custom Glass Dropdown -->
                <div class="cn-custom-dropdown" id="cn-format-dropdown">
                    <button class="cn-dropdown-trigger" id="cn-dropdown-trigger" type="button">
                        <span class="cn-dropdown-selected">
                            ${currentFormatObj.iconSvg}
                            <span>${currentFormatObj.label}</span>
                        </span>
                        ${ICONS.chevronDown}
                    </button>
                    <div class="cn-dropdown-menu ${isFormatDropdownOpen ? '' : 'hidden'}" id="cn-dropdown-menu">
                        ${EXPORT_OPTIONS.map(f => `
                            <div class="cn-dropdown-item ${exportFormat === f.id ? 'active' : ''}" data-format="${f.id}">
                                ${f.iconSvg}
                                <span>${f.label}</span>
                                ${exportFormat === f.id ? `<span class="cn-check-mark">${ICONS.check}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button class="btn btn-secondary cn-btn-csv" id="btn-export-csv" title="Export as tabular CSV">${ICONS.table} CSV</button>
                ${isVaultMode ? `<button class="btn-icon-cross" id="btn-clear-vault" title="Clear Entire Vault">${ICONS.trash}</button>` : ''}
            </div>

            <div class="cn-footer-row cn-action-grid">
                <button class="btn btn-primary" id="btn-copy-selected">${ICONS.copy} Copy</button>
                <button class="btn btn-success" id="btn-download-selected">${ICONS.download} Download PDFs</button>
                <button class="btn btn-danger" id="btn-delete-selected">${ICONS.trash} Delete</button>
            </div>
            <div class="cn-sidebar-dev-footer">
                <div class="cn-footer-credits-row">
                    <span>Architected by <a href="https://marjukamin.com" target="_blank" rel="noopener noreferrer">Marjuk Amin</a></span>
                    <span class="cn-footer-sep">•</span>
                    <button type="button" class="cn-footer-contact-btn" id="btn-footer-contact" title="Contact Developer & Feature Request">
                        ${ICONS.mail}
                        <span>Contact & Feature Request</span>
                    </button>
                    <span class="cn-footer-sep">•</span>
                    <a href="https://marjuk06.gumroad.com/coffee" target="_blank" rel="noopener noreferrer" class="cn-footer-coffee-btn" title="Support CN Link Grabber Pro with a coffee">
                        ☕ <span>Support</span>
                    </a>
                    <span class="cn-footer-sep">•</span>
                    <a href="https://github.com/marjuk06" target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
            </div>
        </div>

        <!-- Frosted Glass Contact & Feature Request Modal -->
        <div id="cn-contact-modal" class="cn-modal-backdrop hidden">
            <div class="cn-contact-modal-card">
                <div class="cn-contact-modal-header">
                    <div class="cn-contact-modal-title">
                        <span class="cn-contact-icon-bubble">${ICONS.mail}</span>
                        <div>
                            <h4>Contact Developer</h4>
                            <p>Reach out directly to Marjuk Amin</p>
                        </div>
                    </div>
                    <button class="btn-icon-cross" id="btn-close-contact" type="button" title="Close">${ICONS.cross}</button>
                </div>
                
                <!-- Success Confirmation Card (Shown on successful dispatch) -->
                <div id="cn-contact-success-banner" class="cn-contact-alert success hidden" style="margin: 12px 14px 14px;">
                    <div class="cn-success-icon-wrap">${ICONS.check}</div>
                    <div class="cn-success-text-wrap">
                        <div class="cn-success-title">Thank you for reaching out!</div>
                        <div class="cn-success-desc">Your submission has been delivered to <strong>Marjuk Amin</strong>. Check your email for confirmation.</div>
                    </div>
                </div>

                <div id="cn-contact-form-body" class="cn-contact-modal-body">
                    <!-- Developer Profile & Direct Socials Strip -->
                    <div class="cn-dev-profile-strip">
                        <div class="cn-dev-strip-header">
                            <img src="${safeGetURL('icons/marjuk06.png')}" alt="Marjuk Amin" class="cn-dev-avatar-img">
                            <div class="cn-dev-meta">
                                <div class="cn-dev-name">
                                    Marjuk Amin
                                    <span class="cn-dev-badge">Architect</span>
                                </div>
                                <div class="cn-dev-bio">Software Engineer • Creator</div>
                            </div>
                        </div>
                        <div class="cn-dev-social-row">
                            <a href="https://marjukamin.com" target="_blank" rel="noopener noreferrer" class="cn-dev-social-btn" title="Official Portfolio (marjukamin.com)">
                                ${ICONS.globe} <span>Website</span>
                            </a>
                            <a href="https://marjuk06.gumroad.com/coffee" target="_blank" rel="noopener noreferrer" class="cn-dev-social-btn cn-dev-coffee-btn" title="Support development on Gumroad">
                                ☕ <span>Donate</span>
                            </a>
                            <a href="https://github.com/marjuk06" target="_blank" rel="noopener noreferrer" class="cn-dev-social-btn" title="GitHub (@marjuk06)">
                                ${ICONS.github} <span>GitHub</span>
                            </a>
                            <a href="https://linkedin.com/in/marjukamin" target="_blank" rel="noopener noreferrer" class="cn-dev-social-btn" title="LinkedIn">
                                ${ICONS.linkedin} <span>LinkedIn</span>
                            </a>
                            <a href="https://x.com/marjuk06" target="_blank" rel="noopener noreferrer" class="cn-dev-social-btn" title="X (Twitter)">
                                ${ICONS.xTwitter} <span>X</span>
                            </a>
                            <a href="https://facebook.com/marjuk06" target="_blank" rel="noopener noreferrer" class="cn-dev-social-btn" title="Facebook">
                                ${ICONS.facebook} <span>Facebook</span>
                            </a>
                        </div>
                    </div>

                    <div class="cn-contact-field">
                        <label>Your Name</label>
                        <input type="text" id="cn-input-name" placeholder="Name">
                    </div>
                    <div class="cn-contact-field">
                        <label>Your Email</label>
                        <input type="email" id="cn-input-email" placeholder="name@domain.com">
                    </div>
                    <div class="cn-contact-field">
                        <label>Category</label>
                        <select id="cn-select-category" class="cn-contact-select">
                            <option value="New Feature Request">New Feature Request</option>
                            <option value="Course Platform Support">Course Platform Support</option>
                            <option value="Bug Report">Bug Report</option>
                            <option value="General Collaboration">General Collaboration</option>
                        </select>
                    </div>
                    <div class="cn-contact-field">
                        <label>Details / Feature Idea</label>
                        <textarea id="cn-input-message" rows="3" placeholder="Describe the feature or improvement you'd love to see..."></textarea>
                    </div>
                </div>

                <div id="cn-contact-form-footer" class="cn-contact-modal-footer">
                    <button type="button" class="btn btn-secondary" id="btn-cancel-contact">Cancel</button>
                    <button type="button" class="btn btn-primary" id="btn-submit-contact">${ICONS.send} Send to Developer</button>
                </div>
            </div>
        </div>
    `;
    
    if (contentContainer) {
        contentContainer.innerHTML = html;
    }
    if (sidebar) sidebar.classList.toggle('cn-theme-light', currentTheme === 'light');

    const newScrollContainer = document.getElementById('cn-content');
    if (newScrollContainer) {
        newScrollContainer.scrollTop = scrollPos;
    }

    attachEvents();
}

function attachEvents() {
    const state = getActiveState();
    const totalCount = state.videos.length + state.drives.length;

    // Interactive Mascot click reaction
    const mascotEl = document.getElementById('cn-interactive-mascot');
    if (mascotEl) {
        mascotEl.onclick = () => {
            mascotEl.classList.add('cn-mascot-wiggle');
            setTimeout(() => mascotEl.classList.remove('cn-mascot-wiggle'), 600);

            const tips = [
                `Athena: ${totalCount} resources indexed and ready.`,
                `Athena: Star any lecture card to pin it permanently to the top.`,
                `Athena: Use Auto-Scroll to scan dynamic infinite courses.`,
                `Athena: Click the Contact icon to request features or message Marjuk Amin.`,
                `Athena: Selected documents are downloaded to Downloads/CN_Grabber.`
            ];
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            showMascotSpeech(randomTip);
        };
    }

    // Theme Toggle (Light / Dark)
    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) {
        btnTheme.onclick = () => {
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            chrome.storage.local.set({ cnTheme: nextTheme });
        };
    }

    // Contact & Feature Request Modal
    const btnHelp = document.getElementById('btn-help-contact');
    const btnFooterContact = document.getElementById('btn-footer-contact');
    const contactModal = document.getElementById('cn-contact-modal');
    const btnCloseContact = document.getElementById('btn-close-contact');
    const btnCancelContact = document.getElementById('btn-cancel-contact');
    const btnSubmitContact = document.getElementById('btn-submit-contact');

    const resetContactModal = () => {
        const formBody = document.getElementById('cn-contact-form-body');
        const formFooter = document.getElementById('cn-contact-form-footer');
        const successBanner = document.getElementById('cn-contact-success-banner');
        if (formBody) formBody.classList.remove('hidden');
        if (formFooter) formFooter.classList.remove('hidden');
        if (successBanner) successBanner.classList.add('hidden');
        if (btnSubmitContact) {
            btnSubmitContact.disabled = false;
            btnSubmitContact.innerHTML = `${ICONS.send} Send to Developer`;
            btnSubmitContact.style.background = '';
            btnSubmitContact.style.borderColor = '';
        }
    };

    const openContactModal = () => {
        resetContactModal();
        if (contactModal) contactModal.classList.remove('hidden');
    };

    if (btnHelp) btnHelp.onclick = openContactModal;
    if (btnFooterContact) btnFooterContact.onclick = openContactModal;
    if (btnCloseContact) {
        btnCloseContact.onclick = () => {
            if (contactModal) contactModal.classList.add('hidden');
            resetContactModal();
        };
    }
    if (btnCancelContact) {
        btnCancelContact.onclick = () => {
            if (contactModal) contactModal.classList.add('hidden');
            resetContactModal();
        };
    }
    if (btnSubmitContact) {
        btnSubmitContact.onclick = async () => {
            const name = (document.getElementById('cn-input-name')?.value || '').trim();
            const email = (document.getElementById('cn-input-email')?.value || '').trim();
            const category = document.getElementById('cn-select-category')?.value || 'New Feature Request';
            const message = (document.getElementById('cn-input-message')?.value || '').trim();

            if (!message) {
                showToast("Please describe your feature idea or inquiry.", "warning");
                return;
            }

            const originalBtnHTML = btnSubmitContact.innerHTML;
            btnSubmitContact.disabled = true;
            btnSubmitContact.innerHTML = `
                <span class="m3-spinner-dot spin-anim" style="width:12px;height:12px;display:inline-block;border:2px solid #fff;border-top-color:transparent;border-radius:50%;margin-right:6px;vertical-align:middle;"></span>
                <span>Sending to Marjuk Amin...</span>
            `;

            try {
                // Dispatch directly to background service worker with safety timeout
                const sendPromise = new Promise((resolve) => {
                    safeSendMessage({
                        action: "send_contact_feedback",
                        payload: {
                            name: name || 'Anonymous User',
                            email: email || '',
                            category,
                            message,
                            pageUrl: window.location.href,
                            version: '4.1.0 Pro',
                            timestamp: new Date().toISOString()
                        }
                    }, (res) => resolve(res || { success: true }));
                });

                const timeoutPromise = new Promise((resolve) => {
                    setTimeout(() => resolve({ success: true, timeout: true }), 9000);
                });

                await Promise.race([sendPromise, timeoutPromise]);

                // Hide form fields and footer, reveal confirmation popup card
                const formBody = document.getElementById('cn-contact-form-body');
                const formFooter = document.getElementById('cn-contact-form-footer');
                const successBanner = document.getElementById('cn-contact-success-banner');

                if (formBody) formBody.classList.add('hidden');
                if (formFooter) formFooter.classList.add('hidden');
                if (successBanner) successBanner.classList.remove('hidden');

                // Clear message textarea
                const msgInput = document.getElementById('cn-input-message');
                if (msgInput) msgInput.value = '';

                // Keep confirmation popup visible for ~2.8 seconds, then auto-close modal & reset
                setTimeout(() => {
                    if (contactModal) contactModal.classList.add('hidden');
                    resetContactModal();
                }, 2800);

            } catch (err) {
                console.error("Direct feedback dispatch failed:", err);
                const formBody = document.getElementById('cn-contact-form-body');
                const formFooter = document.getElementById('cn-contact-form-footer');
                const successBanner = document.getElementById('cn-contact-success-banner');

                if (formBody) formBody.classList.add('hidden');
                if (formFooter) formFooter.classList.add('hidden');
                if (successBanner) successBanner.classList.remove('hidden');

                setTimeout(() => {
                    if (contactModal) contactModal.classList.add('hidden');
                    resetContactModal();
                }, 2800);
            }
        };
    }

    // Safe CSP developer avatar fallback
    const devAvatarEl = contactModal?.querySelector('.cn-dev-avatar-img');
    if (devAvatarEl) {
        devAvatarEl.addEventListener('error', () => {
            devAvatarEl.src = 'https://github.com/marjuk06.png';
        }, { once: true });
    }

    // Documentation & Updates Landing Page
    const btnDocs = document.getElementById('btn-open-docs');
    if (btnDocs) {
        btnDocs.onclick = () => {
            safeSendMessage({ action: "open_docs" });
        };
    }

    // Close button
    const btnClose = document.getElementById('cn-close-sidebar');
    if (btnClose) {
        btnClose.onclick = () => {
            if (sidebar) sidebar.classList.remove('open');
            document.documentElement.classList.remove('cn-sidebar-open');
            document.documentElement.classList.remove('cn-is-udvash');
            isSidebarOpen = false;
        };
    }

    // Toast Dismiss
    const toastClose = document.querySelector('.cn-toast-close');
    if (toastClose) {
        toastClose.onclick = () => {
            document.getElementById('cn-toast').classList.add('hidden');
        };
    }

    // Auto-Scroll Toggle
    const btnAutoScroll = document.getElementById('btn-autoscroll');
    if (btnAutoScroll) {
        btnAutoScroll.onclick = () => {
            if (isAutoScrolling) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        };
    }

    // Modes
    const tabPage = document.getElementById('btn-mode-page');
    if (tabPage) tabPage.onclick = () => { isVaultMode = false; renderSidebar(); };
    
    const tabVault = document.getElementById('btn-mode-vault');
    if (tabVault) tabVault.onclick = () => { isVaultMode = true; renderSidebar(); };
    
    // Vault Actions
    const btnClearVault = document.getElementById('btn-clear-vault');
    if (btnClearVault) {
        btnClearVault.addEventListener('click', () => {
            document.getElementById('cn-confirm-modal').classList.remove('hidden');
        });
    }

    // Custom Dropdown Trigger
    const dropdownTrigger = document.getElementById('cn-dropdown-trigger');
    if (dropdownTrigger) {
        dropdownTrigger.onclick = (e) => {
            e.stopPropagation();
            isFormatDropdownOpen = !isFormatDropdownOpen;
            const menu = document.getElementById('cn-dropdown-menu');
            if (menu) menu.classList.toggle('hidden', !isFormatDropdownOpen);
        };
    }

    // Dropdown Item Select
    document.querySelectorAll('.cn-dropdown-item').forEach(item => {
        item.onclick = (e) => {
            e.stopPropagation();
            exportFormat = item.getAttribute('data-format');
            isFormatDropdownOpen = false;
            renderSidebar();
        };
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#cn-format-dropdown') && isFormatDropdownOpen) {
            isFormatDropdownOpen = false;
            const menu = document.getElementById('cn-dropdown-menu');
            if (menu) menu.classList.add('hidden');
        }
    });

    // Mini Player Preview Toggle
    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            activePreviewId = (activePreviewId === id) ? null : id;
            renderSidebar();
        });
    });

    // Star / Favorite Toggle
    document.querySelectorAll('.btn-star').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const type = e.currentTarget.getAttribute('data-type');
            const id = e.currentTarget.getAttribute('data-id');
            const state = getActiveState();
            const item = state[type].find(i => i.id === id);
            if (item) {
                item.starred = !item.starred;
                if (isVaultMode) {
                    safeSendMessage({ action: "save_vault", vault: vaultState });
                    if (isExtensionValid() && chrome.storage && chrome.storage.local) {
                        chrome.storage.local.set({ cnVault: vaultState, linkGrabberVault: vaultState });
                    }
                }
                renderSidebar();
            }
        });
    });

    // YouTube Playlist Launch
    document.querySelectorAll('.yt-playlist-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const allVideos = filterItems(state.videos).filter(v => v.type === 'youtube');
            const selectedYt = allVideos.filter(v => v.selected);
            const targets = selectedYt.length > 0 ? selectedYt : allVideos;

            if (targets.length === 0) {
                return showToast("No YouTube videos available to create a playlist.", "warning");
            }
            const ids = targets.map(v => v.id);
            const playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${ids.join(',')}`;
            window.open(playlistUrl, '_blank');
        });
    });

    // Delete Single Item
    document.querySelectorAll('.delete-single-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.currentTarget.getAttribute('data-type');
            const id = e.currentTarget.getAttribute('data-id');
            const state = getActiveState();
            
            ignoredIds.add(id);
            state[type] = state[type].filter(item => item.id !== id);
            
            if (isVaultMode) {
                safeSendMessage({ action: "save_vault", vault: vaultState });
                if (isExtensionValid() && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({ cnVault: vaultState, linkGrabberVault: vaultState });
                }
            }
            renderSidebar();
        });
    });

    // Single Download
    document.querySelectorAll('.download-single-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = e.currentTarget.getAttribute('data-url');
            const title = e.currentTarget.getAttribute('data-title') || 'document';
            const category = e.currentTarget.getAttribute('data-cat') || 'General';
            let filename = title.replace(/[^a-zA-Z0-9_\-\.\ ]/g, '_').trim();
            if (!filename.toLowerCase().match(/\.[a-z0-9]{2,4}$/i)) filename += '.pdf';

            // Canvas PDF Compiler Trigger (Vue, Nuxt, Bondi Pathshala, Canvas Viewers)
            if (url === '#canvas-pdf') {
                const nativeDlBtn = document.querySelector('button.cpdf-btn--dl, button[aria-label*="ডাউনলোড" i], button[aria-label*="download" i]');
                if (nativeDlBtn) {
                    try { nativeDlBtn.click(); } catch (_) {}
                }

                mascotMood = 'downloading';
                updateMascotMood('downloading');
                compileCanvasPdf(filename, (pct, label) => {
                    updateProgressIndicator(pct, label);
                    if (pct >= 100) {
                        mascotMood = 'cheer';
                        updateMascotMood('cheer');
                        showMascotSpeech(`Master PDF created and saved (${filename})!`);
                        setTimeout(() => {
                            mascotMood = 'normal';
                            updateMascotMood('normal');
                            const progressBar = document.getElementById('cn-progress-bar');
                            if (progressBar) progressBar.classList.add('hidden');
                        }, 4000);
                    }
                });
                return;
            }

            // Standard Network Download
            updateProgressIndicator(6, `Connecting stream: ${filename}...`);
            mascotMood = 'downloading';
            updateMascotMood('downloading');

            safeSendMessage({
                action: "download_files",
                files: [{ url, filename, category }]
            });
        });
    });

    // Open Link in New Tab (Immune to SPA routing and popup blockers)
    document.querySelectorAll('.btn-open-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = e.currentTarget.getAttribute('data-url');
            if (!url) return;

            if (url === '#canvas-pdf') {
                const viewer = document.querySelector('.vue-pdf-embed, .pdfp, .pdfViewer, canvas');
                if (viewer) {
                    viewer.scrollIntoView({ behavior: 'smooth' });
                    showToast("Scrolled to document canvas on page.", "info");
                }
                return;
            }

            // Tell background worker to open a new tab directly via chrome.tabs.create
            safeSendMessage({ action: "open_tab", url }, (res) => {
                if (!res || !res.success) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            });
        });
    });

    // In-Sidebar Video Trimmer Trigger
    document.querySelectorAll('.trim-video-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const url = e.currentTarget.getAttribute('data-url');
            const title = e.currentTarget.getAttribute('data-title') || 'Video';
            openInSidebarTrimmer({ url, title });
        });
    });

    // Delete Selected Items
    const btnDeleteSelected = document.getElementById('btn-delete-selected');
    if (btnDeleteSelected) {
        btnDeleteSelected.addEventListener('click', () => {
            const state = getActiveState();
            const selVideos = state.videos.filter(v => v.selected);
            const selDrives = state.drives.filter(d => d.selected);
            const count = selVideos.length + selDrives.length;
            
            if (count === 0) {
                return showToast("Please select items to delete.", "warning");
            }

            selVideos.forEach(v => ignoredIds.add(v.id));
            selDrives.forEach(d => ignoredIds.add(d.id));
            
            state.videos = state.videos.filter(v => !v.selected);
            state.drives = state.drives.filter(d => !d.selected);
            
            if (isVaultMode) {
                safeSendMessage({ action: "save_vault", vault: vaultState });
                if (isExtensionValid() && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({ cnVault: vaultState, linkGrabberVault: vaultState });
                }
            }
            
            renderSidebar();
        });
    }

    // Modal Actions
    const btnCancelClear = document.getElementById('btn-cancel-clear');
    if (btnCancelClear) {
        btnCancelClear.addEventListener('click', () => {
            document.getElementById('cn-confirm-modal').classList.add('hidden');
        });
    }

    const btnConfirmClear = document.getElementById('btn-confirm-clear');
    if (btnConfirmClear) {
        btnConfirmClear.addEventListener('click', () => {
            document.getElementById('cn-confirm-modal').classList.add('hidden');
            vaultState = { videos: [], drives: [] };
            safeSendMessage({ action: "save_vault", vault: vaultState });
            if (isExtensionValid() && chrome.storage && chrome.storage.local) {
                chrome.storage.local.set({ cnVault: vaultState, linkGrabberVault: vaultState }, () => {
                    if (isVaultMode) renderSidebar();
                });
            } else if (isVaultMode) {
                renderSidebar();
            }
        });
    }

    // Refresh Scanner
    const btnRefreshScan = document.getElementById('btn-refresh');
    if (btnRefreshScan) {
        btnRefreshScan.onclick = () => {
            btnRefreshScan.classList.add('rotating');
            fetchSniffedPdfs();
            scanPage();
            syncToVault();
            setTimeout(() => {
                if (btnRefreshScan && btnRefreshScan.isConnected) {
                    btnRefreshScan.classList.remove('rotating');
                }
                renderSidebar();
            }, 300);
        };
    }

    // Search
    const searchInput = document.getElementById('cn-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderSidebar();
            const reSearch = document.getElementById('cn-search');
            if (reSearch) reSearch.focus();
        });
    }

    // Checkboxes
    document.querySelectorAll('.item-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const type = e.target.getAttribute('data-type');
            const id = e.target.getAttribute('data-id');
            const item = state[type].find(i => i.id === id);
            if (item) item.selected = e.target.checked;
            renderSidebar();
        });
    });

    // Select All
    document.querySelectorAll('.select-all-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.getAttribute('data-type');
            const doSelect = e.target.getAttribute('data-select') === 'true';
            filterItems(state[type]).forEach(i => i.selected = doSelect);
            renderSidebar();
        });
    });

    // Group Select
    document.querySelectorAll('.select-group-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.currentTarget.getAttribute('data-type');
            const cat = e.currentTarget.getAttribute('data-cat');
            const catItems = filterItems(state[type]).filter(i => i.category === cat);
            const allSelected = catItems.every(i => i.selected);
            catItems.forEach(i => i.selected = !allSelected);
            renderSidebar();
        });
    });

    // Copy Single Full Info
    document.querySelectorAll('.copy-single-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = e.target.getAttribute('data-copy');
            if (text) navigator.clipboard.writeText(text);
            const orig = btn.innerHTML;
            btn.innerHTML = `${ICONS.check} Copied`;
            btn.classList.add('btn-success');
            setTimeout(() => { 
                if (btn && btn.isConnected) {
                    btn.innerHTML = orig; 
                    btn.classList.remove('btn-success'); 
                }
            }, 1800);
        });
    });

    // Copy URL Only
    document.querySelectorAll('.copy-url-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.currentTarget;
            if (!targetBtn) return;
            const text = targetBtn.getAttribute('data-copy');
            if (text) navigator.clipboard.writeText(text).catch(() => {});
            const orig = targetBtn.innerHTML;
            targetBtn.innerHTML = ICONS.check;
            targetBtn.style.color = 'var(--accent-green)';
            setTimeout(() => { 
                if (targetBtn && targetBtn.isConnected) {
                    targetBtn.innerHTML = orig; 
                    targetBtn.style.color = ''; 
                }
            }, 1400);
        });
    });

    // Bulk Copy Action
    const btnCopySelected = document.getElementById('btn-copy-selected');
    if (btnCopySelected) {
        btnCopySelected.onclick = () => {
            const allSelected = [...filterItems(state.videos), ...filterItems(state.drives)].filter(i => i.selected);
            const selected = allSelected.length > 0 ? allSelected : [...filterItems(state.videos), ...filterItems(state.drives)];
            
            if (selected.length === 0) {
                return showToast("Please select items to copy.", "warning");
            }

            let text = '';
            if (exportFormat === 'yt_playlist') {
                const ytVideos = selected.filter(v => v.type === 'youtube');
                if (ytVideos.length === 0) {
                    return showToast("No YouTube videos selected for playlist link.", "warning");
                }
                text = `https://www.youtube.com/watch_videos?video_ids=${ytVideos.map(v => v.id).join(',')}`;
            } else if (exportFormat === 'notion') {
                const header = "| Type | Title | Link | Category |\n| :--- | :--- | :--- | :--- |\n";
                text = header + selected.map(formatCopyText).join('\n');
            } else {
                text = selected.map(formatCopyText).join('\n\n');
            }

            navigator.clipboard.writeText(text);
            const origHTML = btnCopySelected.innerHTML;
            btnCopySelected.innerHTML = `${ICONS.check} Copied!`;
            setTimeout(() => {
                if (btnCopySelected && btnCopySelected.isConnected) {
                    btnCopySelected.innerHTML = origHTML;
                }
            }, 1600);
        };
    }

    // Bulk Download Action
    const btnDownloadSelected = document.getElementById('btn-download-selected');
    if (btnDownloadSelected) {
        btnDownloadSelected.onclick = () => {
            const selected = filterItems(state.drives).filter(i => i.selected);
            const selectedVideos = filterItems(state.videos).filter(i => i.selected);

            if (selected.length === 0) {
                if (selectedVideos.length > 0) {
                    openInSidebarTrimmer({
                        url: selectedVideos[0].cleanUrl || selectedVideos[0].url,
                        title: selectedVideos[0].name
                    });
                    return;
                }
                return showToast("Please select Document/Drive items to download, or tap 'Download / Trim' on videos.", "warning");
            }

            const canvasPdfItems = selected.filter(item => (item.cleanUrl || item.url) === '#canvas-pdf');
            const normalItems = selected.filter(item => (item.cleanUrl || item.url) !== '#canvas-pdf');

            // Trigger native download buttons or canvas PDF compilation for modern web PDF readers
            if (canvasPdfItems.length > 0) {
                const nativeDlBtn = document.querySelector('button.cpdf-btn--dl, button[aria-label*="ডাউনলোড" i], button[aria-label*="download" i]');
                if (nativeDlBtn) {
                    try { nativeDlBtn.click(); } catch (_) {}
                }

                canvasPdfItems.forEach(cItem => {
                    let filename = (cItem.name || 'document').replace(/[^a-zA-Z0-9_\-\.\ ]/g, '_').trim();
                    if (!filename.toLowerCase().match(/\.[a-z0-9]{2,4}$/i)) filename += '.pdf';
                    compileCanvasPdf(filename, (pct, label) => {
                        updateProgressIndicator(pct, label);
                    });
                });
            }

            // Standard batch downloading for network files
            if (normalItems.length > 0) {
                const files = normalItems.map(item => {
                    let filename = (item.name || 'document').replace(/[^a-zA-Z0-9_\-\.\ ]/g, '_').trim();
                    if (!filename.toLowerCase().match(/\.[a-z0-9]{2,4}$/i)) filename += '.pdf';
                    return {
                        url: item.cleanUrl || item.url,
                        filename,
                        category: item.category || 'Downloads'
                    };
                });

                // Show M3 Expressive wavy progress bar
                updateProgressIndicator(6, `Queueing ${files.length} documents...`);

                mascotMood = 'downloading';
                updateMascotMood('downloading');

                safeSendMessage({ action: "download_files", files });
            }
        };
    }

    // CSV Export
    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) {
        btnExportCsv.onclick = () => {
            const allItems = [...filterItems(state.videos), ...filterItems(state.drives)];
            if (allItems.length === 0) {
                return showToast("No data available to export.", "warning");
            }
            
            let csv = "Type,Category,Title,Link\n";
            allItems.forEach(i => {
                const t = i.type || 'document';
                const cat = `"${(i.category || 'General').replace(/"/g, '""')}"`;
                const name = `"${(i.name || '').replace(/"/g, '""')}"`;
                const link = i.cleanUrl || i.url;
                csv += `${t},${cat},${name},${link}\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `CN_Grabber_Export_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }

    if (isVaultMode) {
        safeSendMessage({ action: "save_vault", vault: vaultState });
    }
}

// ─── VIDEO DETECTOR & MEDIA CONTROLLER FOR TRIMMER STUDIO ───
const videoElementMap = new Map();
let activeTrimmerVideoEl = null;
let previewAnimationTimer = null;

function detectPageVideosForStudio() {
    videoElementMap.clear();
    const videoEls = Array.from(document.querySelectorAll('video'));
    document.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) {
            videoEls.push(...Array.from(el.shadowRoot.querySelectorAll('video')));
        }
    });

    return videoEls.map((video, idx) => {
        const id = `cn-studio-vid-${idx}`;
        video.setAttribute('data-cn-studio-id', id);
        videoElementMap.set(id, video);

        // Notify studio immediately when video metadata or duration becomes available
        const notifyMetadata = () => {
            if (!isNaN(video.duration) && video.duration > 0) {
                safeSendMessage({
                    type: 'VIDEO_METADATA_LOADED',
                    payload: {
                        id,
                        duration: video.duration,
                        videoWidth: video.videoWidth || 1920,
                        videoHeight: video.videoHeight || 1080
                    }
                });
                const iframe = document.getElementById('cn-trimmer-studio-iframe');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'VIDEO_METADATA_LOADED',
                        payload: {
                            id,
                            duration: video.duration,
                            videoWidth: video.videoWidth || 1920,
                            videoHeight: video.videoHeight || 1080
                        }
                    }, '*');
                }
            }
        };
        video.addEventListener('loadedmetadata', notifyMetadata, { once: true });
        video.addEventListener('durationchange', notifyMetadata);

        const sources = [];
        if (video.src) sources.push({ src: video.src, type: video.getAttribute('type') || undefined });
        video.querySelectorAll('source').forEach(sc => {
            const sSrc = sc.src || sc.getAttribute('src');
            if (sSrc) sources.push({ src: sSrc, type: sc.type || undefined });
        });

        const effectiveSrc = video.currentSrc || video.src || (sources[0]?.src ?? '');
        const isBlob = effectiveSrc.startsWith('blob:');
        const isHlsOrDash =
            effectiveSrc.includes('.m3u8') ||
            effectiveSrc.includes('.mpd') ||
            sources.some(s => s.type && (s.type.includes('mpegurl') || s.type.includes('dash')));

        let mimeType = 'video/mp4';
        const clean = effectiveSrc.split('?')[0].toLowerCase();
        if (clean.endsWith('.webm')) mimeType = 'video/webm';
        else if (clean.endsWith('.mkv')) mimeType = 'video/x-matroska';
        else if (clean.endsWith('.m3u8')) mimeType = 'application/x-mpegURL';
        else if (clean.endsWith('.mpd')) mimeType = 'application/dash+xml';

        return {
            id,
            src: video.src || '',
            currentSrc: effectiveSrc,
            pageTitle: document.title || 'Lecture Video',
            pageUrl: window.location.href,
            duration: isNaN(video.duration) ? 0 : video.duration,
            currentTime: video.currentTime || 0,
            videoWidth: video.videoWidth || 0,
            videoHeight: video.videoHeight || 0,
            paused: video.paused,
            muted: video.muted,
            volume: video.volume,
            playbackRate: video.playbackRate,
            sources,
            mimeType,
            isHlsOrDash,
            isBlob,
            isDirectMedia: !isBlob && !isHlsOrDash && effectiveSrc.length > 0
        };
    });
}

function findPageHlsStreamUrl() {
    try {
        const entries = performance.getEntriesByType('resource');
        for (let i = entries.length - 1; i >= 0; i--) {
            const name = entries[i].name;
            const clean = name.split('?')[0].toLowerCase();
            if (clean.endsWith('.m3u8') || clean.endsWith('.mpd') || name.includes('.m3u8') || name.includes('.mpd')) {
                return name;
            }
        }
    } catch (_) {}
    return null;
}

function ensureSidebarCreated() {
    if (sidebar) return;
    sidebar = document.createElement('div');
    sidebar.id = 'cn-link-grabber-sidebar';
    
    const handle = document.createElement('div');
    handle.id = 'cn-resize-handle';
    sidebar.appendChild(handle);
    
    const content = document.createElement('div');
    content.id = 'cn-sidebar-content';
    sidebar.appendChild(content);

    document.documentElement.appendChild(sidebar);
    
    let isResizing = false;
    handle.addEventListener('mousedown', () => {
        isResizing = true;
        document.body.style.userSelect = 'none';
        document.body.style.pointerEvents = 'none';
        sidebar.style.pointerEvents = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        let newWidth = window.innerWidth - e.clientX;
        if (newWidth < 340) newWidth = 340;
        if (newWidth > 1100) newWidth = 1100;
        sidebar.style.width = newWidth + 'px';
        if (isSidebarOpen) {
            document.documentElement.style.setProperty('--cn-sidebar-width', newWidth + 'px');
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.userSelect = '';
            document.body.style.pointerEvents = '';
            sidebar.style.pointerEvents = '';
        }
    });
    
    document.body.style.transition = 'margin-right 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    
    scanPage();
    syncToVault();
}

function openSidebar() {
    ensureSidebarCreated();
    fetchSniffedPdfs();
    scanPage();
    syncToVault();
    sidebar.classList.add('open');
    document.documentElement.classList.add('cn-sidebar-open');
    if (window.location.hostname.includes('udvash-unmesh.com')) {
        document.documentElement.classList.add('cn-is-udvash');
    }
    document.documentElement.style.setProperty('--cn-sidebar-width', sidebar.style.width || '410px');
    isSidebarOpen = true;
    renderSidebar();
}

function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    document.documentElement.classList.remove('cn-sidebar-open');
    document.documentElement.classList.remove('cn-is-udvash');
    stopAutoScroll();
    isSidebarOpen = false;
}

function toggleSidebar() {
    if (isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// ─── INITIALIZATION & REAL-TIME BACKGROUND MESSAGES ───
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle_sidebar") {
        toggleSidebar();
    } else if (request.action === "open_in_sidebar_trimmer") {
        openSidebar();
        openInSidebarTrimmer({ url: request.videoUrl, title: request.videoTitle });
    } else if (request.action === "download_started") {
        updateProgressIndicator(6, `Initiating ${request.total} download(s)...`);
        mascotMood = 'downloading';
        updateMascotMood('downloading');
    } else if (request.action === "download_progress") {
        let label = 'Downloading';
        if (request.total > 1) {
            label += ` (${request.completed + 1}/${request.total})`;
        }
        if (request.currentFile) {
            label += `: ${request.currentFile}`;
        }
        if (request.bytesText) {
            label += ` • ${request.bytesText}`;
        }

        updateProgressIndicator(request.percent, label);
    } else if (request.action === "download_complete") {
        updateProgressIndicator(100, `All ${request.total} items finished downloading!`);
        
        mascotMood = 'cheer';
        updateMascotMood('cheer');
        showMascotSpeech(`Done! All ${request.total} files saved to Downloads/CN_Grabber`);

        setTimeout(() => {
            mascotMood = 'normal';
            updateMascotMood('normal');
            const progressBar = document.getElementById('cn-progress-bar');
            if (progressBar) progressBar.classList.add('hidden');
            if (m3ProgressBarIndicator) {
                m3ProgressBarIndicator.destroy();
                m3ProgressBarIndicator = null;
            }
            if (m3WavyProgressInstance) {
                m3WavyProgressInstance.destroy();
                m3WavyProgressInstance = null;
            }
        }, 3600);
    } else if (request.action === "download_item_failed") {
        showToast(`Failed to download ${request.filename}`, "warning");
    } else if (request.action === "pdf_sniffed" && request.pdf) {
        if (!sniffedPdfs.some(p => p.url === request.pdf.url)) {
            sniffedPdfs.push(request.pdf);
            if (scanPage()) {
                syncToVault();
                renderSidebar();
            }
        }
    }

    // ─── VIDEO TRIMMER STUDIO BRIDGE HANDLERS ───
    if (request.type === 'DETECT_VIDEOS') {
        const videos = detectPageVideosForStudio();
        if (videos.length > 0 && !activeTrimmerVideoEl) {
            activeTrimmerVideoEl = videoElementMap.get(videos[0].id) || null;
        }
        const hlsStreamUrl = findPageHlsStreamUrl();
        sendResponse({ success: true, videos, hlsStreamUrl });
        return true;
    }

    if (request.type === 'SELECT_VIDEO') {
        const videoId = request.payload?.videoId;
        if (videoId && videoElementMap.has(videoId)) {
            activeTrimmerVideoEl = videoElementMap.get(videoId);
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false });
        }
        return true;
    }

    if (request.type === 'SEEK_VIDEO') {
        const time = request.payload?.time;
        if (activeTrimmerVideoEl && typeof time === 'number') {
            activeTrimmerVideoEl.currentTime = Math.max(0, Math.min(time, activeTrimmerVideoEl.duration || time));
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false });
        }
        return true;
    }

    if (request.type === 'PLAY_VIDEO') {
        if (activeTrimmerVideoEl) {
            activeTrimmerVideoEl.play().catch(() => {});
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false });
        }
        return true;
    }

    if (request.type === 'PAUSE_VIDEO') {
        if (activeTrimmerVideoEl) {
            activeTrimmerVideoEl.pause();
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false });
        }
        return true;
    }

    if (request.type === 'PREVIEW_RANGE') {
        const { startTime, endTime } = request.payload || {};
        if (activeTrimmerVideoEl && typeof startTime === 'number' && typeof endTime === 'number') {
            if (previewAnimationTimer) cancelAnimationFrame(previewAnimationTimer);
            activeTrimmerVideoEl.currentTime = startTime;
            activeTrimmerVideoEl.play().catch(() => {});
            const checkPreview = () => {
                if (!activeTrimmerVideoEl) return;
                if (activeTrimmerVideoEl.currentTime >= endTime || activeTrimmerVideoEl.paused) {
                    activeTrimmerVideoEl.pause();
                    previewAnimationTimer = null;
                } else {
                    previewAnimationTimer = requestAnimationFrame(checkPreview);
                }
            };
            previewAnimationTimer = requestAnimationFrame(checkPreview);
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false });
        }
        return true;
    }

    if (request.type === 'STOP_PREVIEW') {
        if (previewAnimationTimer) {
            cancelAnimationFrame(previewAnimationTimer);
            previewAnimationTimer = null;
        }
        if (activeTrimmerVideoEl) activeTrimmerVideoEl.pause();
        sendResponse({ success: true });
        return true;
    }

    if (request.type === 'GET_PLAYBACK_STATE') {
        if (activeTrimmerVideoEl) {
            sendResponse({
                success: true,
                currentTime: activeTrimmerVideoEl.currentTime,
                duration: activeTrimmerVideoEl.duration || 0
            });
        } else {
            sendResponse({ success: false });
        }
        return true;
    }
});

// Live Observer for lazy-loads
const observer = new MutationObserver((mutations) => {
    if (!isSidebarOpen || isVaultMode) return;
    
    let shouldUpdate = false;
    for (let mutation of mutations) {
        if (sidebar && sidebar.contains(mutation.target)) continue;
        shouldUpdate = true;
        break;
    }

    if (shouldUpdate) {
        if (scanPage()) {
            syncToVault();
            renderSidebar();
        }
    }
});
observer.observe(document.body, { childList: true, subtree: true });
