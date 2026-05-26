# Elżbieta Bojarczuk — Personal Website

> Portfolio & **SBDAGF** methodology showcase for a Senior Product Designer & UX Researcher.
> Editorial-minimalist design — warm paper, ink, and a single ochre accent. Zero dependencies, zero build step.

---

## ✦ Overview

A fast, accessible, single-page personal site built with pure **HTML + CSS + vanilla JS**. It presents Elżbieta's experience, the SBDAGF framework, skills, and contact details, with scroll-reveal animations and animated impact counters.

---

## 🧭 The SBDAGF methodology

The site's centerpiece is the **Small Business Digital Accessibility & Growth Framework (SBDAGF)** — an open-access, accessibility-first UX methodology built for U.S. small businesses and distribution through the SBA's SBDC network.

- **Read it on the site:** <https://elzbietabojarczuk.github.io/#sbdagf>
- **Download the practitioner checklist (PDF):** [`SBDAGF_practitioner_checklist.pdf`](SBDAGF_practitioner_checklist.pdf)
- **License:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

---

## 📁 Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Full single-page site (semantic, accessible markup) |
| `style.css` | Design tokens, layout, responsive rules, animations |
| `script.js` | Scroll reveal, counters, mobile nav, newsletter + modal |
| `accessibility.html` | WCAG 2.1 AA accessibility statement |
| `evidence.html` | Unlisted exhibit cross-reference |
| `welcome-email.html` | On-brand welcome email template (see `SETUP_EMAIL.md`) |
| `SBDAGF_practitioner_checklist.pdf` | Open-access methodology checklist |
| `elzbieta-bojarczuk-cv.pdf` | Downloadable CV |
| `favicon.svg` · `og-image.png` | Favicon · social share card |
| `robots.txt` · `sitemap.xml` · `site.webmanifest` | SEO + PWA metadata |
| `.nojekyll` | Tells GitHub Pages to skip Jekyll processing |

---

## 🎨 Design

- **Aesthetic:** editorial minimalist — generous whitespace, hairline rules, near-square corners, oversized display type.
- **Palette:** warm paper `#f4f1ea` · ink `#1a1714` · burnt-ochre accent `#ab3d1b`. No gradients, no glow.
- **Type:**
  - Display — **Fraunces** (serif)
  - Body — **Hanken Grotesk**
  - Labels & metrics — **JetBrains Mono**

All colors live as CSS variables in the `:root` block of `style.css`, so the theme is easy to retune.

---

## 🚀 Local preview

No build step. Either open `index.html` directly, or serve it:

```bash
# Python
python3 -m http.server 8001
# → http://localhost:8001
```

```powershell
# Windows (just open it)
start index.html
```

---

## 🌐 Deploy (GitHub Pages)

The site is hosted from this repo's `main` branch.

1. Push to `main` (see below).
2. Repo → **Settings → Pages**.
3. Source: **Deploy from a branch** → Branch `main` → folder `/ (root)` → **Save**.
4. Live within ~1 minute at the URL shown on the Pages settings screen.

### Push changes

```bash
git add .
git commit -m "Update site"
git push origin main
```

---

## ♿ Accessibility & tech

- WCAG 2.1 AA-minded: skip link, ARIA roles/labels, visible focus states, ≥44px tap targets.
- Honors `prefers-reduced-motion`.
- Fully responsive — mobile, tablet, desktop.
- `IntersectionObserver` for scroll reveals, active-nav highlighting, and animated stat counters.
- Pure HTML5 + CSS3 + vanilla JS — **no frameworks, no dependencies, no build**.

---

## 📄 License

SBDAGF methodology content is published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
© 2026 Elżbieta Bojarczuk. All rights reserved.
