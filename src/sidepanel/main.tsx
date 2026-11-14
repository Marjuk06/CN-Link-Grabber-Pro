import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// Initialize theme from URL query or storage
const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const initialTheme = searchParams?.get('theme');
if (initialTheme) {
  document.documentElement.setAttribute('data-theme', initialTheme);
} else {
  try {
    chrome.storage?.local?.get(['cnTheme'], (res) => {
      if (res && res.cnTheme) {
        document.documentElement.setAttribute('data-theme', res.cnTheme);
      }
    });
  } catch {}
}

window.addEventListener('message', (event) => {
  if (event.data?.action === 'set_theme' && event.data.theme) {
    document.documentElement.setAttribute('data-theme', event.data.theme);
  }
});

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
