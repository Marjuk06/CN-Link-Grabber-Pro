/**
 * CN Link Grabber Pro
 * Documentation Hub Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-content');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Quick Hero CTAs
  const ctaChangelog = document.getElementById('cta-changelog');
  if (ctaChangelog) {
    ctaChangelog.addEventListener('click', () => {
      document.querySelector('[data-tab="tab-changelog"]')?.click();
    });
  }
  const ctaStudio = document.getElementById('cta-studio');
  if (ctaStudio) {
    ctaStudio.addEventListener('click', () => {
      document.querySelector('[data-tab="tab-trimmer"]')?.click();
    });
  }
  const ctaContact = document.getElementById('cta-contact');
  if (ctaContact) {
    ctaContact.addEventListener('click', () => {
      document.querySelector('[data-tab="tab-contact"]')?.click();
    });
  }

  // Developer Profile Avatar Fallback
  const devAvatarImg = document.querySelector('.dev-avatar-img');
  if (devAvatarImg) {
    devAvatarImg.addEventListener('error', () => {
      devAvatarImg.src = 'https://github.com/marjuk06.png';
    }, { once: true });
  }

  // Athena Mascot Interactive Tips & Animations
  const mascotWrap = document.getElementById('top-interactive-mascot');
  const speechBubble = document.getElementById('mascot-speech-bubble');
  const speechText = document.getElementById('mascot-speech-text');

  const tips = [
    "Athena: Click the extension icon in Chrome to open your sidebar anytime!",
    "Tip: Tap 'Download / Trim' on any lecture video to clip it instantly.",
    "Pro tip: Need a new course site supported? Submit it anytime from the Contact tab or sidebar footer!",
    "Tip: Star items to pin them to the top of your Global Vault.",
    "Athena: All video trimming happens losslessly in your browser!"
  ];
  let tipIndex = 0;
  let hideTimer = null;

  if (mascotWrap && speechBubble && speechText) {
    mascotWrap.addEventListener('click', () => {
      mascotWrap.classList.remove('winking');
      void mascotWrap.offsetWidth;
      mascotWrap.classList.add('winking');

      tipIndex = (tipIndex + 1) % tips.length;
      speechText.textContent = tips[tipIndex];
      speechBubble.classList.remove('hidden');

      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        speechBubble.classList.add('hidden');
      }, 4000);
    });
  }

  // Copy Email to Clipboard
  const btnCopyEmail = document.getElementById('btn-copy-email-docs');
  const copyBtnText = document.getElementById('copy-btn-text');
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      navigator.clipboard.writeText('contact@marjukamin.com').then(() => {
        if (copyBtnText) copyBtnText.textContent = 'Copied!';
        btnCopyEmail.style.background = 'var(--accent-green)';
        btnCopyEmail.style.color = '#FFFFFF';
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy';
          btnCopyEmail.style.background = '';
          btnCopyEmail.style.color = '';
        }, 2000);
      }).catch(() => {
        window.location.href = 'mailto:contact@marjukamin.com';
      });
    });
  }

  // Feature Suggestion & Inquiry Form
  const featureForm = document.getElementById('docs-feature-form');
  const successToast = document.getElementById('contact-success-toast');
  if (featureForm) {
    featureForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('form-name')?.value || '').trim();
      const email = (document.getElementById('form-email')?.value || '').trim();
      const category = document.getElementById('form-category')?.value || 'New Feature Request';
      const subjectInput = (document.getElementById('form-subject')?.value || '').trim();
      const message = (document.getElementById('form-message')?.value || '').trim();

      const submitBtn = featureForm.querySelector('button[type="submit"]');
      const origBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending to Marjuk Amin...</span>`;
      }

      // Dispatch directly via background worker (No mail app or page redirect needed!)
      chrome.runtime.sendMessage({
        action: "send_contact_feedback",
        payload: {
          name,
          email,
          category: `${category} - ${subjectInput}`,
          message,
          pageUrl: 'CN Link Grabber Pro Documentation Hub',
          version: '4.1.0 Pro',
          timestamp: new Date().toISOString()
        }
      }, () => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>✓ Sent to Marjuk Amin!</span>`;
          submitBtn.style.background = '#10B981';
          submitBtn.style.borderColor = '#059669';
          setTimeout(() => {
            submitBtn.innerHTML = origBtnHTML;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
          }, 3000);
        }

        if (successToast) {
          successToast.style.display = 'flex';
          setTimeout(() => {
            successToast.style.display = 'none';
          }, 6000);
        }
        featureForm.reset();
      });
    });
  }

  // Theme Toggle & Persistence
  const themeBtn = document.getElementById('theme-btn');
  function initTheme() {
    const saved = localStorage.getItem('cn_docs_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('cn_docs_theme', next);
    });
  }
  initTheme();
});

