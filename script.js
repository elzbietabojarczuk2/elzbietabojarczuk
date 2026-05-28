/* ══════════════════════════════════════════
   Elżbieta Bojarczuk — Personal Website
   script.js  ·  v2.0
   ══════════════════════════════════════════ */

/* ── Mobile nav ── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('open');
  document.body.style.overflow = expanded ? '' : 'hidden';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Sticky header shadow ── */
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Active nav highlight on scroll ── */
const sections = Array.from(document.querySelectorAll('section[id]'));
const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        const isActive = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('active', isActive);
        if (isActive) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Animated stat counters ── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  const isDecimal = !Number.isInteger(target);

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.dataset.target) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ── Smooth internal link clicks ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Newsletter signup (front-end only — no data leaves the browser) ── */
const newsletterForm = document.getElementById('newsletter-form');
const signupModal = document.getElementById('signup-modal');

if (newsletterForm && signupModal) {
  const emailInput = document.getElementById('newsletter-email');
  const emailOut   = document.getElementById('modal-email');
  const closeBtn   = document.getElementById('modal-close');
  const okBtn      = document.getElementById('modal-ok');
  let lastFocused  = null;

  /* Real welcome-email delivery via EmailJS (the only way to send from a static site).
     Fill these 3 values from your free EmailJS account, then the welcome email
     (welcome-email.html → pasted into your EmailJS template) is sent automatically.
     Left blank, the form still works and shows the confirmation modal. */
  const EMAILJS = { publicKey: '', serviceId: '', templateId: '' };
  let emailjsReady = false;

  const loadEmailJs = () => new Promise((resolve, reject) => {
    if (window.emailjs) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

  const sendWelcomeEmail = async (email) => {
    const { publicKey, serviceId, templateId } = EMAILJS;
    if (!publicKey || !serviceId || !templateId) return; // not configured — skip silently
    try {
      await loadEmailJs();
      if (!emailjsReady) { window.emailjs.init({ publicKey }); emailjsReady = true; }
      await window.emailjs.send(serviceId, templateId, { to_email: email, email: email });
    } catch (_) { /* delivery failed — confirmation modal still shows */ }
  };

  const openModal = (email) => {
    if (emailOut) emailOut.textContent = email || 'You';
    lastFocused = document.activeElement;
    signupModal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };
  const closeModal = () => {
    signupModal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = (emailInput.value || '').trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!valid) {
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.focus();
      return;
    }
    emailInput.removeAttribute('aria-invalid');
    // store locally only; nothing is transmitted
    try {
      const subs = JSON.parse(localStorage.getItem('sbdagf_subs') || '[]');
      subs.push({ email: value, at: Date.now() });
      localStorage.setItem('sbdagf_subs', JSON.stringify(subs));
    } catch (_) { /* storage unavailable — ignore */ }
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
    await sendWelcomeEmail(value);
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
    openModal(value);
    newsletterForm.reset();
  });

  closeBtn.addEventListener('click', closeModal);
  okBtn.addEventListener('click', closeModal);
  signupModal.addEventListener('click', (e) => { if (e.target === signupModal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !signupModal.hidden) closeModal(); });

  // keep focus inside the dialog while open
  signupModal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = signupModal.querySelectorAll('button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ── BibTeX copy-to-clipboard ── */
document.querySelectorAll('.cite-copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const pre = document.getElementById(btn.dataset.target);
    if (!pre) return;
    navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    });
  });
});

/* ── Back to top ── */
const toTop = document.getElementById('to-top');
if (toTop) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toggleTop = () => toTop.classList.toggle('visible', window.scrollY > 600);
  window.addEventListener('scroll', toggleTop, { passive: true });
  toggleTop();
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ── Scroll progress bar ── */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

const updateProgress = () => {
  const doc = document.documentElement;
  const pct = (window.scrollY / Math.max(doc.scrollHeight - doc.clientHeight, 1)) * 100;
  progressBar.style.width = `${Math.min(pct, 100)}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();


/* ── Sparkle particles ── */
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function spawnSparkles(x, y, count, isClick) {
  if (reduceMotionQuery.matches) return;
  const colors = ['#435155', '#a7b3aa', '#fbfaf6', '#8c9fa8', '#6b7f86'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'sparkle-particle';
    const angle = (i / count) * 360 + Math.random() * (360 / count);
    const dist  = isClick ? 55 + Math.random() * 75 : 18 + Math.random() * 22;
    const size  = isClick ? 4 + Math.random() * 7   : 2 + Math.random() * 3;
    p.style.cssText =
      `left:${x}px;top:${y}px;width:${size}px;height:${size}px;` +
      `background:${colors[Math.floor(Math.random() * colors.length)]};` +
      `--dx:${(Math.cos(angle * Math.PI / 180) * dist).toFixed(1)}px;` +
      `--dy:${(Math.sin(angle * Math.PI / 180) * dist).toFixed(1)}px;` +
      `animation-duration:${isClick ? 0.85 : 0.5}s;`;
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
  }
}

document.querySelectorAll('.btn-primary, .pdf-download, .btn-outline, .btn-invert').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const r = btn.getBoundingClientRect();
    spawnSparkles(r.left + r.width / 2, r.top + r.height / 2, 5, false);
  });
  btn.addEventListener('click', e => spawnSparkles(e.clientX, e.clientY, 20, true));
});

/* ── Magnetic CTA buttons ── */
document.querySelectorAll('.btn-primary').forEach(btn => {
  let raf = null;
  btn.addEventListener('mousemove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.18;
      const y = (e.clientY - r.top  - r.height / 2) * 0.18;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
      raf = null;
    });
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.45s var(--ease-smooth)';
    btn.style.transform  = '';
    setTimeout(() => (btn.style.transition = ''), 450);
  });
});

/* ── Ripple on click ── */
document.querySelectorAll('.btn-primary, .btn-outline, .pdf-download, .btn-invert').forEach(btn => {
  btn.style.overflow = 'hidden';
  btn.addEventListener('click', e => {
    const r    = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const rpl  = document.createElement('span');
    rpl.className = 'ripple';
    rpl.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px;`;
    btn.appendChild(rpl);
    rpl.addEventListener('animationend', () => rpl.remove(), { once: true });
  });
});
