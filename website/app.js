(() => {
  // ─── DARK MODE TOGGLE (Synced with <meta name="color-scheme">) ───
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'color-scheme';

  function getSystemScheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getRenderedScheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (_) {}
    return getSystemScheme();
  }

  function applySchemeMeta(value) {
    if (metaColorScheme) {
      metaColorScheme.setAttribute('content', value || 'light dark');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const target = getRenderedScheme() === 'dark' ? 'light' : 'dark';
      const system = getSystemScheme();
      try {
        if (target === system) {
          localStorage.removeItem(STORAGE_KEY);
          applySchemeMeta('light dark');
        } else {
          localStorage.setItem(STORAGE_KEY, target);
          applySchemeMeta(target);
        }
      } catch (_) {
        applySchemeMeta(target === system ? 'light dark' : target);
      }
    });
  }

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      applySchemeMeta(e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : 'light dark');
    }
  });

  // ─── SUPPORT FORM VALIDATION & DISPATCH ───
  const form = document.getElementById('support-form');
  const statusBox = document.getElementById('support-status');
  const submitBtn = document.getElementById('support-submit');

  if (form) {
    const validatedFields = form.querySelectorAll('[data-error]');
    validatedFields.forEach((field) => {
      const syncAria = () => {
        const errorId = field.getAttribute('data-error');
        const baseDesc = field.dataset.baseDescribedby || '';
        if (field.matches(':user-invalid')) {
          field.setAttribute('aria-invalid', 'true');
          field.setAttribute('aria-describedby', baseDesc ? `${baseDesc} ${errorId}` : errorId);
        } else {
          field.removeAttribute('aria-invalid');
          if (baseDesc) {
            field.setAttribute('aria-describedby', baseDesc);
          } else {
            field.removeAttribute('aria-describedby');
          }
        }
      };
      if (field.hasAttribute('aria-describedby')) {
        field.dataset.baseDescribedby = field.getAttribute('aria-describedby');
      }
      field.addEventListener('blur', syncAria);
      field.addEventListener('input', syncAria);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        validatedFields.forEach((f) => f.dispatchEvent(new Event('blur')));
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const name = document.getElementById('support-name').value.trim();
      const email = document.getElementById('support-email').value.trim();
      const category = document.getElementById('support-category').value;
      const message = document.getElementById('support-message').value.trim();

      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      statusBox.className = 'form-status';
      statusBox.textContent = '';

      try {
        const res = await fetch('https://marjuk-mail-router.eap-fcm-worker.workers.dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            category,
            message,
            pageUrl: window.location.href,
            version: '4.1.0 Pro'
          })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          statusBox.className = 'form-status success';
          statusBox.textContent = 'Thank you for reaching out! Your message has been delivered to Marjuk Amin. Check your email for confirmation.';
          form.reset();
        } else {
          throw new Error(data.error || 'Submission failed');
        }
      } catch (_) {
        statusBox.className = 'form-status error';
        statusBox.textContent = 'Could not send right now. Please email contact@marjukamin.com directly.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }
})();
