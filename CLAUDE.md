# Elżbieta Bojarczuk — Portfolio Website

Static site. No build. GitHub Pages. Vanilla HTML/CSS/JS only.

## File Index

| File | Purpose |
|------|---------|
| index.html | Main page — all sections inline, ~890 lines |
| style.css | All styles, v3.0 editorial minimalist, ~1900 lines |
| script.js | Vanilla JS, no framework, ~224 lines |
| accessibility.html | Accessibility statement |
| evidence.html | Supporting evidence page |
| 404.html | Custom not-found |
| welcome-email.html | EmailJS welcome template |
| SBDAGF_practitioner_checklist.pdf | Downloadable checklist |
| elzbieta-bojarczuk-cv.pdf | Downloadable CV |
| README.md | Setup + deployment notes |
| SETUP_EMAIL.md | EmailJS config guide |
| sitemap.xml | SEO sitemap |
| robots.txt | Crawler directives |
| site.webmanifest | PWA manifest |
| og-image.png/svg | Open Graph images |
| apple-touch-icon.png | iOS icon |
| favicon.png/svg | Favicon set |
| uxpoland-logo.jpg | UX Poland logo for contact card |
| .nojekyll | Disable Jekyll on GitHub Pages |

## Design Tokens (style.css :root)

```css
--c-bg:      #f4f1ea   /* warm paper */
--c-bg-alt:  #eae4d8   /* alternate sections */
--c-surface: #fbfaf6
--c-ink:     #1a1714
--c-muted:   #574f44
--c-accent:  #ab3d1b   /* ochre/terracotta, AA 5.2:1 on cream */

--ff-display: 'Fraunces', Georgia, serif
--ff-body:    'Hanken Grotesk', sans-serif
--ff-mono:    'JetBrains Mono', monospace

--maxw: 76rem
--r-sm: 2px  --r-md: 3px
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)
```

## Page Sections (index.html order)

1. **Hero** — stat cards (7-figure, ~1M+, 9+ markets, 10+ years); animated counters via `data-target`+`data-suffix`
2. **About** `#about` — `.about-grid`: text + `.about-highlights` (3 `.highlight-card`: 92%, 55, 70%+)
3. **Experience** `#experience` — `ol.timeline` 3 items:
   - OLX Group · Jun 2021–Present · Senior Product Designer
   - XTB DM S.A. · Sep 2016–May 2021 · UX Lead
   - Loyalty Partner Polska (PAYBACK) · May 2015–Aug 2016 · Web UX Specialist
4. **Work** `#work` — `.case-grid` 3 `.case-card` + `.client-strip`
5. **SBDAGF** `#sbdagf` — methodology: stats, 5 principles, 2-layer arch, 5-phase workflow, audience
6. **Impact** `#impact` — `.impact-grid` 6 cards with source links
7. **Recognition** `#recognition` — `.recognition-grid` 6 `.rec-card`
8. **Publications** `#publications` — `ul.pub-list` + BibTeX cite block + copy button
9. **Mentorship** `#mentorship` — stats (26h, 49 sessions, 97.8%, 5.0★, 3 programs) + program cards
10. **Skills** `#skills` — Design & Strategy, Tools, Languages, Education groups
11. **Contact** `#contact` — 7 contact cards + newsletter form + confirmation modal

## Key CSS Patterns

```
.reveal / .reveal--delay-1 / .reveal--delay-2   → scroll-reveal (IntersectionObserver adds .visible)
.section-alt                                     → uses --c-bg-alt
.stat-number[data-target][data-suffix]           → animated counter
.highlight-card--labeled                         → 3-row grid, icon spans 3, adds .highlight-label slot (absolute, sits on border-top)
.is-word on .stat-number                         → static text, skip counter
.btn-primary / .btn-outline / .btn-invert        → button variants
```

## JS Features (script.js)

- Mobile nav toggle, `aria-expanded`, body scroll lock
- Sticky header shadow at `scrollY > 40`
- Active nav via `IntersectionObserver` (rootMargin `-40% 0px -55% 0px`)
- Scroll-reveal via `IntersectionObserver` (threshold 0.12)
- Animated counters: ease-out cubic, 1400ms, int or decimal
- Newsletter: EmailJS optional (`EMAILJS` const line 124), localStorage `sbdagf_subs`, modal + focus trap
- BibTeX copy (`navigator.clipboard`)
- Back-to-top at `scrollY > 600`, respects `prefers-reduced-motion`

## EmailJS Config

Fill `EMAILJS` in `script.js:124`. Leave blank → modal works, no email sent. See `SETUP_EMAIL.md`.

## Accessibility

WCAG 2.1 AA. Skip link, landmark roles, `aria-label` on all interactive elements, `aria-current` on active nav. Works without JS.

## Deployment

```
Canonical: https://elzbietabojarczuk.github.io/
Host: GitHub Pages (repo: elzbietabojarczuk/elzbietabojarczuk.github.io)
No build — push files directly
```

## Key Metrics in Copy

- 92% ID verification time reduction (XTB: ~18h → ~1.5h)
- 7-figure revenue impact (OLX)
- ~1,000,000 user activations (PAYBACK)
- 6 accessibility-compliant experiments in 2 months (OLX Operation Bridge)
- 55-issue UX audit methodology
- 70%+ drop-off rate diagnosed + fixed
- 9 global markets (XTB xStation)
