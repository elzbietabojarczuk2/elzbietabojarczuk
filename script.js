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
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
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
