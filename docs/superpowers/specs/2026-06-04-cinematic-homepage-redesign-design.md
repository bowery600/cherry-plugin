# Cinematic homepage redesign (top → investment lens)

**Date:** 2026-06-04
**Status:** Approved design — pending implementation plan

## Summary

Restructure and restyle the Cherrystone homepage from the hero through the
investment-lens section to match the prototype in
`Cherrystone New Site (2).zip` (`Home.html`, `cs-styles.css`, `cs-backdrop.js`,
`cs-interactions.js`). The current site **already uses the same design tokens**
as the prototype (`--paper #fbfaf7`, `--accent #0E4164`, EB Garamond /
Inter Tight / JetBrains Mono, glassmorphism), so this is markup + section-CSS
work, **not** a global palette change.

The defining change: the existing scroll-scrubbed "frames" hero video becomes a
**fixed/sticky cinematic backdrop spanning the top five sections**, replacing the
prototype's animated "stones" canvas concept and removing the site's current
WebGL backdrop (`unified-canvas.js`).

## Scope

**In scope (top → investment lens):**

1. `coastal-motif-spline-hero` (hero) — keep the video hero; add trust strip.
2. `entry-cards` — restyle to prototype "Two ways in".
3. `ticker-strip` — restyle to prototype ticker.
4. `core-features` — restyle to prototype "What we do".
5. `investment-lens` — restyle to prototype "Investment lens" + sector card.
6. Cinematic video backdrop behind sections 1–5.
7. Remove `sponsors` (and any partners) section from the homepage.

**Out of scope (untouched):** `stats`, `portfolio-grid`, `testimonials`,
`footer-cta`, and all standalone pages (incl. `/sponsors`, `/partners`).

## Decisions (from brainstorming)

- **Backdrop:** frames video as a fixed/sticky backdrop across hero → lens;
  the site's old WebGL backdrop is removed entirely.
- **Video behaviour:** scrub the *whole span* (one continuous scroll-driven
  sequence behind all five sections).
- **Backdrop end:** after investment lens; paper background resumes for stats
  onward.
- **Hero content:** keep existing kicker/headline/sub/buttons **and add** the
  prototype trust strip (2004 · 25+ · $18M+ · 6 verticals) + scroll cue.
- **Sponsors:** remove the sponsors block from the homepage and audit for any
  partners content; keep standalone pages.
- **Backdrop tech:** **sticky backdrop + GSAP scrub** (no pin → no layout jump).
- **Restyle fidelity:** **restyle in place where possible** — keep existing
  block markup/classes where CSS alone reproduces the prototype; change markup
  only where structurally necessary.

## Architecture

### Current mechanism (for reference)

- Desktop hero: `assets/js/frontend.js` → `initVideoScrollHero()` registers a
  GSAP ScrollTrigger that **pins** `.sequence-hero-container` over
  `window.innerHeight * 5` and scrubs `video.currentTime` 0→duration on the
  `.sequence-video` WebM.
- Mobile hero: canvas WebP frame sequence (frames 30–120) that currently
  **auto-loops** at 24fps rather than scroll-driving.
- Old backdrop: `build/unified-canvas.js` (R3F blob/pebble shader mesh) enqueued
  site-wide via `cherrystone_blocks_enqueue_unified_canvas` on
  `enqueue_block_assets`.
- Homepage blocks are static (`save.js`, no `render.php`) composed inside
  `cherrystone/page-home` (InnerBlocks, `templateLock: all`). Block markup is
  styled by the global `cherrystone-blocks/src/style.css` (~6.7k lines).

### 1. Cinematic video backdrop

- **Remove old backdrop:** stop enqueuing / loading `unified-canvas.js` on the
  homepage (and remove its frontend role generally for this page). The
  `coastal-motif-spline-hero` editor mesh preview may remain for editing only.
- **Cinematic region:** wrap the five top blocks in a single region container
  (`.cs-cinematic` or equivalent). Implemented via the page-home composition so
  the wrapper surrounds hero → lens.
- **Sticky visual layer:** the video (desktop) / canvas (mobile) sits
  `position: sticky; top: 0; height: 100vh; z-index: 0` (full-viewport) behind
  the region. The five sections become **transparent / glass** at `z-index: 1`
  and scroll over it. At the region bottom the sticky layer scrolls away and the
  normal paper background resumes.
- **Scrub:** a single GSAP ScrollTrigger drives `video.currentTime` (desktop) /
  frame index (mobile) from region-top (`start: 'top top'`) to region-bottom
  (`end: 'bottom bottom'` via the region as trigger/endTrigger). **No pin.**
- **Readability scrim:** a gradient/tint overlay between the video layer and the
  content (z-index between them) keeps text and glass cards legible over busy
  video frames. Scrim strength is a tunable to be validated visually.
- **Mobile:** the canvas frame sequence is driven by the same scroll progress
  across the region (replacing the current auto-loop).
- **Reduced-motion / capture-safe:** render a static first frame and keep all
  content visible (mirrors the existing `csmotion` arming + timeout fallback
  pattern in the current code so screenshots/reduced-motion still show content).

### 2. Hero

Keep the existing `.sequence-overlay-content` (kicker, headline, sub, two
buttons). **Add** below it:

- a glass **trust strip** with four cells (2004 / 25+ / $18M+ / 6 verticals),
  styled per `cs-styles.css` `.hero-trust` / `.ht-cell` / `.ht-num` / `.ht-label`;
- the animated **scroll cue** (`.scroll-cue` with sliding bar).

These become hero attributes (editable) where reasonable, otherwise static
markup in the hero block.

### 3. Section restyle (CSS-first, in place)

For each block, prefer reproducing the prototype look by editing the block's CSS
in `src/style.css` against the existing class names; change `save.js`/`edit.js`
markup only where the prototype needs structure the current markup lacks.

- **entry-cards** (`.hero-entry-section` / `.split-panel`): reproduce
  `.entry-card` look — tag, eyebrow, title, body, link; hover lift + corner glow.
- **ticker-strip** (`.strip` / `.strip-track`): reproduce `.ticker` look — item
  dot + name + sector, edge fade masks, pause-on-hover.
- **core-features** (`.value-grid` / `.value-card`): reproduce `.features` /
  `.feature` — num, icon mark, title, body, 3-col with dividers, hover
  `feature-bar` fill. (Hover fill bar may require a small markup addition.)
- **investment-lens** (`.insight-board` / `.sector-radar` / `.sector-tile`):
  reproduce `.lens` (sticky left copy + signals + link) and `.sector-card` /
  `.sector-row` bar-meter rows. Left column sticky on desktop.

Transparent backgrounds on these sections (so the video shows through) plus the
glass treatment from existing tokens (`--glass-bg`, `--glass-border`,
`--glass-shadow`).

### 4. Remove sponsors + partners from homepage

- Remove the `sponsors` block from the `page-home` template (`edit.js` TEMPLATE
  + `ALLOWED_BLOCKS`) and from the seeded/live home content.
- Audit the homepage for partner content (e.g. `partner-logo-ticker`); remove if
  present.
- Leave standalone `/sponsors` and `/partners` pages intact.

## Build / deploy / re-seed

- `save.js`/markup edits **invalidate saved blocks** (project memory). Where
  markup changes, add block `deprecated` migrations and update
  `includes/seed-content.json` + `includes/seed-data.php`; re-seed on deploy.
- Pipeline: `npm run build` → package with `python make_zips.py` (NEVER WinPS
  5.1 `Compress-Archive` — backslash bug) → deploy via Hostinger SSH → re-seed →
  **purge LiteSpeed cache**.

## Risks

- **Legibility over moving video** across five sections is the primary aesthetic
  risk; scrim strength + glass opacity need a visual pass after first deploy.
- **Sticky + scrub across sibling blocks:** the region wrapper must cleanly
  surround exactly the five blocks; verify z-index/stacking and that the sticky
  layer releases correctly at the lens boundary.
- **Mobile scroll-driven frames:** converting the auto-loop to scroll-scrub must
  stay smooth on low-end devices; keep the reduced-motion static fallback.
- **Block migration:** any markup change risks validation errors on the live
  saved homepage; deprecations + re-seed mitigate.

## Success criteria

- Homepage hero → investment lens visually matches the prototype, on the warm
  paper palette, with the video frames as the moving backdrop.
- Video scrubs smoothly across the full top span on desktop and mobile; releases
  to paper after the lens.
- Old WebGL backdrop no longer loads on the homepage.
- Sponsors (and any partners) no longer appear on the homepage; standalone pages
  unaffected.
- Reduced-motion and screenshot/capture contexts show all content.
- No block validation errors after deploy + re-seed.
