# Cinematic Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the homepage hero → investment-lens region into a cinematic experience where the existing scroll-scrubbed "frames" video is a fixed/sticky backdrop behind five glass sections styled to match the prototype, the old WebGL backdrop is removed, and sponsors/partners are dropped from the homepage.

**Architecture:** A runtime-built "cinematic region" wraps the five top blocks (hero, entry-cards, ticker-strip, core-features, investment-lens). The hero's video/canvas layer is relocated to that region as a sticky, full-viewport backdrop at `z-index:0`; the sections sit transparent over it at `z-index:1`. A single GSAP ScrollTrigger scrubs `video.currentTime` (desktop) / canvas frame index (mobile) across the region's scroll length — no pinning. Section visuals are restyled in place (CSS-first against existing class names). The old `unified-canvas.js` WebGL layer is un-enqueued. Sponsors block is removed from the template and the live page content.

**Tech Stack:** WordPress block plugin (`@wordpress/scripts` / `wp-scripts build`), vanilla JS in `assets/js/frontend.js` (unbundled), GSAP + ScrollTrigger (already enqueued from CDN), global CSS in `cherrystone-blocks/src/style.css`, Python packaging (`make_zips.py`), Hostinger SSH deploy + LiteSpeed cache.

**No automated test framework exists** for these visual blocks. Each task is verified by: (a) `npm run build` succeeds, (b) `npm run lint:js` clean for touched JS, and (c) post-deploy visual/behavioral verification via the Playwright MCP against the live site. "Expected result" is stated for every verification step.

---

## Pre-flight (do once before Task 1)

- [ ] **P1: Create a feature branch**

```bash
cd "c:/Users/Ethan/OneDrive - Vanderbilt/Desktop/Cherrystone/Cherrystone New Site/wordpress"
git checkout -b feat/cinematic-homepage
git status   # confirm branch
```

- [ ] **P2: Commit the spec + plan already on disk**

```bash
git add docs/superpowers/specs/2026-06-04-cinematic-homepage-redesign-design.md docs/superpowers/plans/2026-06-04-cinematic-homepage-redesign.md
git commit -m "docs: cinematic homepage redesign spec + plan"
```

- [ ] **P3: Confirm a working baseline build**

Run: `cd cherrystone-blocks && npm run build`
Expected: build completes, exit 0, `build/index.js` regenerated.

---

## Task 1: Remove the old WebGL backdrop from the homepage

**Files:**
- Modify: `cherrystone-blocks/cherrystone-blocks.php` (function `cherrystone_blocks_enqueue_unified_canvas`, ~line 494–515)

The old backdrop (`build/unified-canvas.js`, the R3F blob/pebble mesh) is enqueued site-wide on `enqueue_block_assets`. We stop it from loading on the front-end homepage. Keep it available for the block editor (so `coastal-motif-spline-hero/edit.js` preview still works).

- [ ] **Step 1: Gate the enqueue to editor-only**

In `cherrystone_blocks_enqueue_unified_canvas()`, before the `wp_enqueue_script` call, return early on the front end:

```php
	// The cinematic homepage backdrop is now the scroll-scrubbed hero video
	// (see assets/js/frontend.js). The legacy WebGL canvas is only needed in
	// the block editor preview, not on the public front end.
	if ( ! is_admin() ) {
		return;
	}
```

- [ ] **Step 2: Build**

Run: `cd cherrystone-blocks && npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add cherrystone-blocks/cherrystone-blocks.php
git commit -m "feat(home): stop loading legacy WebGL backdrop on front end"
```

---

## Task 2: Build the cinematic region + sticky video backdrop (desktop) and replace the pin-scrub

**Files:**
- Modify: `cherrystone-blocks/assets/js/frontend.js` — replace `initVideoScrollHero()` (lines ~930–1178) with a region-based implementation. (This file is unbundled and shipped as-is.)

**Context the engineer needs:**
- The hero block renders, as direct children of the page wrapper, in this order: `.preloader-overlay`, then `<section class="sequence-hero-container">` containing `.sequence-video-container > video.sequence-video`, `.sequence-overlay`, `.sequence-scroll-indicator`.
- The next four sections are siblings after the hero: `.hero-entry-section` (entry-cards), `.strip` (ticker), `.block` (core-features), `.block.thesis-block` (investment-lens).
- GSAP + ScrollTrigger are globally available as `window.gsap` / `window.ScrollTrigger`.
- We must NOT pin. We make the video container `position: sticky` inside the region and scrub `currentTime` across the whole region scroll length.

- [ ] **Step 1: Replace `initVideoScrollHero` with the region builder + desktop scrub**

Replace the entire `const initVideoScrollHero = () => { ... };` definition (lines ~930–1178) with:

```js
		// Builds the cinematic region wrapping hero → investment-lens, relocates
		// the hero video as a sticky full-viewport backdrop, and scrubs it across
		// the region's scroll length (no pinning).
		const buildCinematicRegion = () => {
			const hero = document.querySelector( '.sequence-hero-container' );
			if ( ! hero ) return null;

			// Don't double-build (e.g. on resize re-init).
			let region = document.querySelector( '.cs-cinematic' );
			if ( region ) return region;

			const lens =
				document.querySelector( '.thesis-block' ) ||
				document.querySelector( '.block.thesis-block' );
			const preloader = document.querySelector( '.preloader-overlay' );
			const parent = hero.parentNode;
			if ( ! parent ) return null;

			// First node of the region = preloader if it sits before the hero,
			// otherwise the hero itself.
			const firstNode =
				preloader && preloader.compareDocumentPosition( hero ) &
					Node.DOCUMENT_POSITION_FOLLOWING
					? preloader
					: hero;
			// Last node of the region = the lens block (inclusive), else the hero.
			const lastNode = lens || hero;

			region = document.createElement( 'div' );
			region.className = 'cs-cinematic';
			parent.insertBefore( region, firstNode );

			// Move firstNode..lastNode (inclusive) into the region.
			let node = firstNode;
			let moving = true;
			while ( moving && node ) {
				const next = node.nextSibling;
				const stop = node === lastNode;
				region.appendChild( node );
				if ( stop ) moving = false;
				node = next;
			}

			// Relocate the video container to be the sticky backdrop layer.
			const videoContainer = hero.querySelector( '.sequence-video-container' );
			if ( videoContainer ) {
				videoContainer.classList.add( 'cs-cinematic-media' );
				region.insertBefore( videoContainer, region.firstChild );
			}

			// Readability scrim between media and content.
			const scrim = document.createElement( 'div' );
			scrim.className = 'cs-cinematic-scrim';
			scrim.setAttribute( 'aria-hidden', 'true' );
			region.insertBefore(
				scrim,
				videoContainer ? videoContainer.nextSibling : region.firstChild
			);

			return region;
		};

		const initVideoScrollHero = () => {
			const hero = document.querySelector( '.sequence-hero-container' );
			if ( ! hero ) return;

			const preloader = document.querySelector( '.preloader-overlay' );
			const bar       = document.querySelector( '.preloader-bar' );
			const pctEl     = document.querySelector( '.preloader-percentage' );
			const hidePreloader = () => {
				if ( preloader ) preloader.classList.add( 'fade-out' );
			};

			const reducedMotion =
				window.matchMedia &&
				window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
			const isMobile = window.matchMedia( '(max-width: 1023px)' ).matches;

			const region = buildCinematicRegion();
			if ( ! region ) { hidePreloader(); return; }

			if ( isMobile ) {
				initCinematicMobile( region, hero, { bar, pctEl, hidePreloader, reducedMotion } );
				return;
			}

			// ── Desktop: sticky WebM video scrubbed across the region ──────────
			if (
				typeof window.gsap === 'undefined' ||
				typeof window.ScrollTrigger === 'undefined'
			) { hidePreloader(); return; }

			const video = hero.querySelector( '.sequence-video' );
			if ( ! video ) { hidePreloader(); return; }

			const originalSrc = video.getAttribute( 'src' );
			if ( originalSrc && ! originalSrc.includes( 'v=' ) ) {
				const sep = originalSrc.includes( '?' ) ? '&' : '?';
				video.setAttribute( 'src', `${ originalSrc }${ sep }v=cinematic1` );
				video.load();
			}

			window.gsap.registerPlugin( window.ScrollTrigger );
			video.pause();
			video.currentTime = 0;

			if ( reducedMotion ) { hidePreloader(); return; }

			const setupScrollTrigger = () => {
				const duration = video.duration || 6;
				window.gsap.to( video, {
					currentTime: duration,
					ease: 'none',
					scrollTrigger: {
						trigger: region,
						start: 'top top',
						end: 'bottom bottom',
						scrub: 0.5,
					},
				} );
				hidePreloader();
			};

			video.addEventListener( 'progress', () => {
				if ( ! video.duration || ! video.buffered.length ) return;
				const pct = Math.round(
					( video.buffered.end( video.buffered.length - 1 ) / video.duration ) * 100
				);
				if ( bar )   bar.style.width   = `${ pct }%`;
				if ( pctEl ) pctEl.textContent = `${ pct }%`;
			} );
			video.addEventListener( 'canplaythrough', hidePreloader, { once: true } );
			const fallback = setTimeout( hidePreloader, 4000 );
			video.addEventListener( 'canplaythrough', () => clearTimeout( fallback ), { once: true } );

			if ( video.readyState >= 1 ) setupScrollTrigger();
			else video.addEventListener( 'loadedmetadata', setupScrollTrigger, { once: true } );
		};
```

> Note: `initCinematicMobile` is defined in Task 3. Define it above `initVideoScrollHero` (or hoist it) so the reference resolves.

- [ ] **Step 2: Lint the file**

Run: `cd cherrystone-blocks && npm run lint:js -- assets/js/frontend.js`
Expected: no errors (warnings about existing code are acceptable; no new errors on the edited function).

- [ ] **Step 3: Build**

Run: `cd cherrystone-blocks && npm run build`
Expected: exit 0. (frontend.js is shipped unbundled but build must still pass.)

- [ ] **Step 4: Commit**

```bash
git add cherrystone-blocks/assets/js/frontend.js
git commit -m "feat(home): build cinematic region + sticky video scrub (desktop)"
```

---

## Task 3: Mobile scroll-driven frame sequence across the region

**Files:**
- Modify: `cherrystone-blocks/assets/js/frontend.js` — add `initCinematicMobile()` above `initVideoScrollHero` (referenced in Task 2).

**Context:** Mobile currently auto-loops the WebP frame sequence (frames 30–120 at `/wp-content/uploads/cherrystone-frames/frame_NNN.webp`). We instead draw the frame matching scroll progress across the region. Canvas is sticky/full-viewport via CSS (Task 4).

- [ ] **Step 1: Add `initCinematicMobile`**

```js
		const initCinematicMobile = ( region, hero, opts ) => {
			const { bar, pctEl, hidePreloader, reducedMotion } = opts;

			// Hide the WebM video on mobile; use a canvas frame sequence instead.
			const videoContainer = region.querySelector( '.sequence-video-container' );
			const videoEl = hero.querySelector( '.sequence-video' );
			if ( videoContainer ) videoContainer.style.display = 'none';
			if ( videoEl ) { videoEl.removeAttribute( 'src' ); videoEl.load(); }

			let mediaWrap = region.querySelector( '.cs-cinematic-canvas-wrap' );
			if ( ! mediaWrap ) {
				mediaWrap = document.createElement( 'div' );
				mediaWrap.className = 'cs-cinematic-media cs-cinematic-canvas-wrap';
				region.insertBefore( mediaWrap, region.firstChild );
			}
			let canvas = mediaWrap.querySelector( 'canvas' );
			if ( ! canvas ) {
				canvas = document.createElement( 'canvas' );
				mediaWrap.appendChild( canvas );
			}
			const context = canvas.getContext( '2d' );
			if ( ! context ) { hidePreloader(); return; }

			const frameStart = 30;
			const frameEnd   = 120;
			const frameCount = frameEnd - frameStart + 1;
			const frameBase  =
				hero.getAttribute( 'data-frame-base' ) ||
				'/wp-content/uploads/cherrystone-frames/';
			const padFrame = ( i ) => String( i ).padStart( 3, '0' );
			const frameUrl = ( i ) => `${ frameBase }frame_${ padFrame( i ) }.webp`;

			const frames = new Array( frameCount );
			let loaded = 0;
			let firstDrawable = null;
			let currentIndex = 0;

			const setProgress = () => {
				const p = Math.round( ( loaded / frameCount ) * 100 );
				if ( bar )   bar.style.width  = `${ p }%`;
				if ( pctEl ) pctEl.textContent = `${ p }%`;
			};
			const resize = () => {
				const rect = mediaWrap.getBoundingClientRect();
				const pr = Math.min( window.devicePixelRatio || 1, 2 );
				const w = Math.max( 1, Math.round( rect.width ) );
				const h = Math.max( 1, Math.round( rect.height ) );
				canvas.width = Math.round( w * pr );
				canvas.height = Math.round( h * pr );
				canvas.style.width = `${ w }px`;
				canvas.style.height = `${ h }px`;
				context.setTransform( pr, 0, 0, pr, 0, 0 );
				drawFrame( frames[ currentIndex ] || firstDrawable );
			};
			const drawFrame = ( image ) => {
				if ( ! image ) return;
				const w = canvas.clientWidth, h = canvas.clientHeight;
				const scale = Math.max( w / image.naturalWidth, h / image.naturalHeight );
				const dw = image.naturalWidth * scale, dh = image.naturalHeight * scale;
				context.clearRect( 0, 0, w, h );
				context.drawImage( image, ( w - dw ) / 2, ( h - dh ) / 2, dw, dh );
			};

			// Scroll progress 0..1 across the region → frame index.
			const progress = () => {
				const rect = region.getBoundingClientRect();
				const total = rect.height - window.innerHeight;
				if ( total <= 0 ) return 0;
				const p = -rect.top / total;
				return Math.min( 1, Math.max( 0, p ) );
			};
			const render = () => {
				const idx = Math.round( progress() * ( frameCount - 1 ) );
				if ( idx !== currentIndex && frames[ idx ] ) {
					currentIndex = idx;
					drawFrame( frames[ idx ] );
				}
			};

			window.addEventListener( 'resize', resize, { passive: true } );
			resize();
			if ( ! reducedMotion ) {
				window.addEventListener( 'scroll', () => {
					window.requestAnimationFrame( render );
				}, { passive: true } );
			}

			for ( let f = frameStart; f <= frameEnd; f += 1 ) {
				const img = new Image();
				const idx = f - frameStart;
				img.decoding = 'async';
				img.src = frameUrl( f );
				img.onload = () => {
					frames[ idx ] = img;
					loaded += 1;
					if ( ! firstDrawable ) { firstDrawable = img; currentIndex = idx; resize(); hidePreloader(); }
					setProgress();
					if ( loaded === frameCount ) { hidePreloader(); render(); }
				};
				img.onerror = () => { loaded += 1; setProgress(); if ( loaded === frameCount ) hidePreloader(); };
			}
		};
```

- [ ] **Step 2: Lint + build**

Run: `cd cherrystone-blocks && npm run lint:js -- assets/js/frontend.js && npm run build`
Expected: no new lint errors; build exit 0.

- [ ] **Step 3: Commit**

```bash
git add cherrystone-blocks/assets/js/frontend.js
git commit -m "feat(home): mobile scroll-driven frame sequence across cinematic region"
```

---

## Task 4: Cinematic region CSS — sticky media, scrim, transparent sections

**Files:**
- Modify: `cherrystone-blocks/src/style.css` — append a new `/* Cinematic region */` block near the existing hero rules (after line ~6238 region is fine; appending at end of file is acceptable since these are new selectors).
- Modify: existing hero rules `sequence-hero-container` / `sequence-video-container` (~line 6181–6238) so the video is no longer absolutely pinned to the hero only.

- [ ] **Step 1: Add cinematic region rules**

Append to `src/style.css`:

```css
/* ── Cinematic homepage region ─────────────────────────────────────────── */
.cs-cinematic { position: relative; }

/* Sticky full-viewport media backdrop (video or canvas wrap). */
.cs-cinematic .cs-cinematic-media {
	position: sticky;
	top: 0;
	height: 100vh;
	width: 100%;
	z-index: 0;
	overflow: hidden;
	/* Pull subsequent sections up to overlap the sticky media. */
	margin-bottom: -100vh;
	pointer-events: none;
}
.cs-cinematic .cs-cinematic-media video,
.cs-cinematic .cs-cinematic-media canvas {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

/* Readability scrim above media, below content. */
.cs-cinematic .cs-cinematic-scrim {
	position: sticky;
	top: 0;
	height: 100vh;
	width: 100%;
	z-index: 1;
	margin-bottom: -100vh;
	pointer-events: none;
	background:
		linear-gradient( 180deg, rgba(251,250,247,0.35) 0%, rgba(251,250,247,0.15) 40%, rgba(251,250,247,0.55) 100% );
}

/* Content sections ride above the sticky media + scrim. */
.cs-cinematic > .sequence-hero-container,
.cs-cinematic > .hero-entry-section,
.cs-cinematic > .strip,
.cs-cinematic > .block {
	position: relative;
	z-index: 2;
	background: transparent !important;
}

/* The hero section no longer hosts the video; it is just the overlay copy. */
.cs-cinematic > .sequence-hero-container {
	min-height: 100vh;
	display: flex;
	align-items: center;
}

@media (prefers-reduced-motion: reduce) {
	.cs-cinematic .cs-cinematic-media { position: relative; height: 70vh; margin-bottom: 0; }
	.cs-cinematic .cs-cinematic-scrim { position: relative; margin-bottom: 0; }
}
```

- [ ] **Step 2: Neutralize the old hero-bound video positioning**

Find the `.sequence-video-container` rule (~line 6190). If it sets `position: absolute`/`fixed` scoped to the hero, scope those rules so they only apply when NOT inside `.cs-cinematic`. Add an override after the existing block:

```css
/* Inside the cinematic region the media is sticky (see .cs-cinematic-media). */
.cs-cinematic .sequence-video-container.cs-cinematic-media { position: sticky; }
```

- [ ] **Step 3: Build**

Run: `cd cherrystone-blocks && npm run build`
Expected: exit 0; `build/style-index.css` regenerated.

- [ ] **Step 4: Commit**

```bash
git add cherrystone-blocks/src/style.css
git commit -m "feat(home): cinematic region CSS (sticky media, scrim, transparent sections)"
```

---

## Task 5: Restyle entry-cards ("Two ways in") to the prototype

**Files:**
- Modify: `cherrystone-blocks/src/style.css` — `.hero-entry-section` / `.split-panel` rules (~line 398–540). Replace the visual rules with prototype-equivalent styling keyed to existing class names.

**Source of truth:** prototype `cs-styles.css` `.entry` / `.entry-card` block (the `.entry-card` glass card with tag, eyebrow, title, body, link, hover lift + corner glow).

- [ ] **Step 1: Apply prototype card styling to existing markup**

Replace the body of the `.split-panel` rules with (adapt selectors to the existing markup; `.split-panel-tag`, `.split-panel-cta` already exist):

```css
.hero-entry-section .hero-entry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; }
.split-panel {
	position: relative;
	padding: 40px;
	border-radius: var(--radius-lg, 22px);
	background: var(--glass-bg);
	border: var(--glass-border);
	box-shadow: var(--glass-shadow);
	backdrop-filter: blur(16px);
	-webkit-backdrop-filter: blur(16px);
	overflow: hidden;
	min-height: 340px;
	display: flex;
	flex-direction: column;
	transition: transform .4s var(--ease-smooth), box-shadow .4s ease;
}
.split-panel::after {
	content: ""; position: absolute; right: -60px; top: -60px;
	width: 200px; height: 200px; border-radius: 50%;
	background: radial-gradient(circle at 40% 40%, rgba(14,65,100,0.10), transparent 68%);
	transition: transform .6s var(--ease-smooth);
}
.split-panel:hover { transform: translateY(-6px); box-shadow: 0 36px 80px -28px rgba(20,19,15,0.30); }
.split-panel:hover::after { transform: scale(1.25); }
.split-panel-tag { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; color: var(--accent); }
.split-panel h2, .split-panel h3 { font-size: 30px; line-height: 1.08; margin-top: 24px; max-width: 16ch; }
.split-panel p { font-size: 16px; line-height: 1.6; color: var(--ink-muted-on-glass); margin: 16px 0 0; max-width: 42ch; }
.split-panel-cta { margin-top: auto; padding-top: 28px; display: inline-flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; color: var(--accent); }
.split-panel-cta svg { transition: transform .3s var(--ease-smooth); }
.split-panel:hover .split-panel-cta svg { transform: translateX(5px); }
@media (max-width: 880px) { .hero-entry-section .hero-entry-grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Build + commit**

```bash
cd cherrystone-blocks && npm run build
git add cherrystone-blocks/src/style.css
git commit -m "feat(home): restyle entry-cards to prototype glass cards"
```

---

## Task 6: Restyle ticker-strip to the prototype

**Files:**
- Modify: `cherrystone-blocks/src/style.css` — `.strip` / `.strip-track` rules (~line 541–613).

**Source of truth:** prototype `.ticker` / `.ticker-track` / `.ticker-item` (dot + name + sector, edge fade masks, pause-on-hover, 46s linear loop).

- [ ] **Step 1: Apply prototype ticker styling**

```css
.strip {
	position: relative; padding: 26px 0; overflow: hidden;
	border-top: 1px solid var(--line-soft); border-bottom: 1px solid var(--line-soft);
	background: rgba(255,255,255,0.40);
	backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
}
.strip-track { display: flex; gap: 56px; width: max-content; animation: tickerScroll 46s linear infinite; }
.strip:hover .strip-track { animation-play-state: paused; }
.strip-track > span { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.04em; color: var(--ink-muted); white-space: nowrap; }
.strip-track .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); opacity: .55; }
.strip::before, .strip::after { content:""; position:absolute; top:0; bottom:0; width:120px; z-index:2; pointer-events:none; }
.strip::before { left:0; background: linear-gradient(90deg, var(--paper), transparent); }
.strip::after { right:0; background: linear-gradient(270deg, var(--paper), transparent); }
```

> If `@keyframes tickerScroll` already exists elsewhere (it does, ~line 5782) ensure it ends at `translateX(-50%)`. The ticker markup duplicates items, so `-50%` produces a seamless loop. Do not add a second `@keyframes` with the same name.

- [ ] **Step 2: Build + commit**

```bash
cd cherrystone-blocks && npm run build
git add cherrystone-blocks/src/style.css
git commit -m "feat(home): restyle ticker-strip to prototype ticker"
```

---

## Task 7: Restyle core-features ("What we do") to the prototype

**Files:**
- Modify: `cherrystone-blocks/src/style.css` — `.value-grid` / `.value-card` rules (~line 614–694).
- Modify (markup, minimal): `cherrystone-blocks/src/blocks/core-features/save.js` — add a hover fill bar element; add a matching `deprecated` entry in `cherrystone-blocks/src/blocks/core-features/index.js`.

**Source of truth:** prototype `.features` / `.feature` (num, icon mark, title, body; 3-col with left dividers; hover `feature-bar` fill).

- [ ] **Step 1: Add the hover bar to markup**

In `core-features/save.js`, after the body `<RichText.Content tagName="p" ... />` inside `.value-card`, add:

```jsx
								<div className="value-bar" aria-hidden="true"></div>
```

- [ ] **Step 2: Add a deprecation so existing saved blocks migrate**

In `core-features/index.js`, register a `deprecated` array whose single entry's `save` reproduces the PREVIOUS markup (the card without `.value-bar`) and the current `attributes`, so WordPress migrates the live block instead of erroring. Mirror the structure used in `coastal-motif-spline-hero/index.js`.

```js
const deprecated = [
	{
		attributes: metadata.attributes,
		save( { attributes } ) {
			// previous markup: identical to current save() minus the .value-bar div
			// (copy the prior save.js output here verbatim)
		},
	},
];
registerBlockType( metadata.name, { ...metadata, edit: Edit, save, deprecated } );
```

> Copy the exact prior `save()` JSX (before Step 1) into the deprecation. Import `metadata` from `./block.json` if not already imported.

- [ ] **Step 3: Apply prototype feature styling**

```css
.value-grid { margin-top: 64px; display: grid; grid-template-columns: repeat(3,1fr); gap: 0; border-top: 1px solid var(--line); }
.value-card { padding: 40px 34px 12px; border-left: 1px solid var(--line); position: relative; background: transparent; }
.value-card:first-child { border-left: none; }
.value-card .num { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; color: var(--accent); }
.value-card .ico { margin: 26px 0 22px; width: 46px; height: 46px; display: grid; place-items: center; border-radius: 12px; background: var(--accent-soft); color: var(--accent); }
.value-card .ico svg { width: 22px; height: 22px; }
.value-card h3 { font-size: 24px; line-height: 1.12; max-width: 18ch; }
.value-card p { font-size: 15.5px; line-height: 1.6; color: var(--ink-muted-on-glass); margin: 16px 0 0; }
.value-bar { margin-top: 30px; height: 2px; background: var(--line); position: relative; overflow: hidden; }
.value-bar::after { content:""; position:absolute; left:0; top:0; bottom:0; width:0; background: var(--accent); transition: width .8s var(--ease-smooth); }
.value-card:hover .value-bar::after { width: 100%; }
@media (max-width: 880px) { .value-grid { grid-template-columns: 1fr; } .value-card { border-left: none; border-top: 1px solid var(--line); } .value-card:first-child { border-top: none; } }
```

- [ ] **Step 4: Build (verify no block validation errors), commit**

Run: `cd cherrystone-blocks && npm run build`
Expected: exit 0.

```bash
git add cherrystone-blocks/src/blocks/core-features cherrystone-blocks/src/style.css
git commit -m "feat(home): restyle core-features to prototype with hover bar + deprecation"
```

---

## Task 8: Restyle investment-lens to the prototype

**Files:**
- Modify: `cherrystone-blocks/src/style.css` — `.insight-board` / `.sector-radar` / `.sector-tile` rules (~line 695–840).

**Source of truth:** prototype `.lens` (sticky left copy + `.signal` chips + link) and `.sector-card` / `.sector-row` bar-meter rows. The existing markup already exposes `--bar` width and `.sector-count` / `.sector-name` / `.sector-sample` / `.sector-bar`.

- [ ] **Step 1: Apply prototype lens styling to existing markup**

```css
.thesis-block .insight-board { display: grid; grid-template-columns: 1fr 1.02fr; gap: 64px; align-items: start; }
.insight-copy { position: sticky; top: 120px; }
.insight-copy h2 { font-size: clamp(32px,3.6vw,52px); letter-spacing: -0.028em; margin-top: 22px; }
.insight-copy .lede { margin-top: 22px; }
.signal-list { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 30px; }
.signal-list span { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.03em; padding: 9px 16px; border-radius: 999px; border: 1px solid var(--line); background: rgba(255,255,255,0.6); color: var(--ink-muted); display: inline-flex; align-items: center; gap: 8px; }
.signal-list span::before { content:""; width:6px; height:6px; border-radius:50%; background: var(--accent); }

.sector-radar { background: var(--glass-bg); border: var(--glass-border); border-radius: var(--radius-lg, 22px); box-shadow: var(--glass-shadow); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); overflow: hidden; display: block; }
.sector-tile { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 16px; padding: 20px 26px; border-bottom: 1px solid rgba(20,19,15,0.06); transition: background-color .2s ease; }
.sector-tile:last-child { border-bottom: none; }
.sector-tile:hover { background: rgba(255,255,255,0.55); }
.sector-name { font-family: var(--font-serif); font-size: 23px; letter-spacing: -0.01em; display: block; }
.sector-sample { font-size: 13px; color: var(--ink-soft, #847e74); margin-top: 3px; display: block; }
.sector-count { font-family: var(--font-mono); font-size: 13px; color: var(--ink-muted); }
.sector-bar { display: block; height: 22px; width: 64px; }
.sector-bar > span { display: block; height: 100%; width: var(--bar, 16%); background: var(--accent); border-radius: 2px; }
@media (max-width: 1080px) { .thesis-block .insight-board { grid-template-columns: 1fr; gap: 40px; } .insight-copy { position: static; } }
```

> The exact prototype uses 7 discrete bars per row; the existing markup uses a single `--bar` width meter. Keep the single-meter form (restyle-in-place decision) — it reads equivalently.

- [ ] **Step 2: Build + commit**

```bash
cd cherrystone-blocks && npm run build
git add cherrystone-blocks/src/style.css
git commit -m "feat(home): restyle investment-lens to prototype lens + sector card"
```

---

## Task 9: Hero trust strip + scroll cue

**Files:**
- Modify: `cherrystone-blocks/src/blocks/coastal-motif-spline-hero/save.js` — add trust strip + scroll cue markup inside `.sequence-overlay-content`.
- Modify: `cherrystone-blocks/src/blocks/coastal-motif-spline-hero/block.json` — add attributes for the four trust cells (optional; see Step 1 note).
- Modify: `cherrystone-blocks/src/blocks/coastal-motif-spline-hero/edit.js` — render the same markup in the editor.
- Modify: `cherrystone-blocks/src/blocks/coastal-motif-spline-hero/index.js` — add a `deprecated` entry reproducing the current (pre-trust-strip) save markup.
- Modify: `cherrystone-blocks/src/style.css` — trust strip + scroll cue styles.

**Source of truth:** prototype `.hero-trust` / `.ht-cell` / `.ht-num` / `.ht-label` and `.scroll-cue`.

- [ ] **Step 1: Add markup to `save.js`**

Inside `.sequence-overlay-content`, after `.sequence-actions`, add a static trust strip (static values are acceptable per the spec; keep them editable later if desired):

```jsx
						<div className="hero-trust">
							<div className="ht-cell"><div className="ht-num">2004</div><div className="ht-label">Founded in Providence, Rhode Island</div></div>
							<div className="ht-cell"><div className="ht-num">25<span className="unit">+</span></div><div className="ht-label">Active portfolio companies</div></div>
							<div className="ht-cell"><div className="ht-num"><span className="unit">$</span>18M<span className="unit">+</span></div><div className="ht-label">Member capital deployed</div></div>
							<div className="ht-cell"><div className="ht-num">6</div><div className="ht-label">Industry verticals</div></div>
						</div>
						<div className="scroll-cue" aria-hidden="true"><span className="cue-bar"></span>Scroll to explore</div>
```

> Static markup means NO new block attributes are required, but it DOES change saved output — so the deprecation in Step 3 is mandatory.

- [ ] **Step 2: Mirror the markup in `edit.js`** so the editor preview matches (add the same JSX in the editor's overlay content).

- [ ] **Step 3: Add a deprecation in `index.js`**

Append a new entry to the existing `deprecated` array whose `save` reproduces the CURRENT save markup (video variant, before this task's additions) and `migrate` returns attributes unchanged. Place it at the START of the array so it is matched first for existing saved content.

- [ ] **Step 4: Add styles to `src/style.css`**

```css
.hero-trust { margin-top: 48px; display: flex; align-items: stretch; background: var(--glass-bg); border: var(--glass-border); border-radius: var(--radius, 14px); box-shadow: var(--glass-shadow); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); max-width: 880px; overflow: hidden; }
.hero-trust .ht-cell { padding: 22px 30px; flex: 1; border-left: 1px solid rgba(20,19,15,0.07); }
.hero-trust .ht-cell:first-child { border-left: none; }
.ht-num { font-family: var(--font-serif); font-size: 36px; line-height: 1; letter-spacing: -0.02em; color: var(--ink); }
.ht-num .unit { color: var(--accent); }
.ht-label { font-size: 12.5px; color: var(--ink-soft, #847e74); margin-top: 8px; line-height: 1.35; }
.scroll-cue { margin-top: 40px; display: inline-flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink-soft, #847e74); }
.scroll-cue .cue-bar { position: relative; width: 38px; height: 1px; background: rgba(20,19,15,0.25); overflow: hidden; }
.scroll-cue .cue-bar::after { content:""; position:absolute; inset:0; width:14px; background: var(--accent); animation: cueSlide 2.4s cubic-bezier(.7,0,.3,1) infinite; }
@keyframes cueSlide { 0% { transform: translateX(-16px); } 60%,100% { transform: translateX(40px); } }
@media (max-width: 880px) { .hero-trust { flex-direction: column; } .hero-trust .ht-cell { border-left: none; border-top: 1px solid rgba(20,19,15,0.07); } .hero-trust .ht-cell:first-child { border-top: none; } }
```

- [ ] **Step 5: Build (verify no validation error), commit**

```bash
cd cherrystone-blocks && npm run build
git add cherrystone-blocks/src/blocks/coastal-motif-spline-hero cherrystone-blocks/src/style.css
git commit -m "feat(home): add hero trust strip + scroll cue with deprecation"
```

---

## Task 10: Remove sponsors (and audit partners) from the homepage

**Files:**
- Modify: `cherrystone-blocks/src/blocks/page-home/edit.js` — remove `[ 'cherrystone/sponsors', {} ]` from `TEMPLATE` (line 12) so it drops from `ALLOWED_BLOCKS` too.
- Live content: the home page post already exists; the idempotent seeder will NOT rewrite it. Remove the sponsors block from the live `post_content` directly (Task 12 deploy step) via WP-CLI.

- [ ] **Step 1: Remove sponsors from the template**

In `page-home/edit.js`, delete the line:

```js
	[ 'cherrystone/sponsors', {} ],
```

- [ ] **Step 2: Audit for partners on the homepage**

Run: `grep -n "partner" cherrystone-blocks/src/blocks/page-home/edit.js`
Expected: no matches (no partners block in the template). If a `partner-logo-ticker` (or similar) appears, remove it the same way and note it for the live-content cleanup in Task 12.

- [ ] **Step 3: Build + commit**

```bash
cd cherrystone-blocks && npm run build
git add cherrystone-blocks/src/blocks/page-home/edit.js
git commit -m "feat(home): remove sponsors section from home template"
```

---

## Task 11: Package, deploy, clean live content, verify

**Files:**
- Use: `make_zips.py` (repo root).
- Deploy: Hostinger SSH MCP (`mcp__hostinger-ssh__*`).

- [ ] **Step 1: Package the plugin zip**

Run: `cd "c:/Users/Ethan/OneDrive - Vanderbilt/Desktop/Cherrystone/Cherrystone New Site/wordpress" && python make_zips.py`
Expected: `cherrystone-blocks.zip` rewritten with forward-slash paths. (NEVER use WinPS 5.1 `Compress-Archive`.)

- [ ] **Step 2: Deploy the updated plugin to the server**

Upload/extract `cherrystone-blocks.zip` (or sync `assets/js/frontend.js`, `build/`, `includes/`, blocks `src`/`build`) to the WordPress plugins directory via the Hostinger SSH MCP. Confirm files updated (timestamp check via `mcp__hostinger-ssh__execute-command`).

- [ ] **Step 3: Remove the sponsors block from the live home page content**

Via SSH WP-CLI (adjust path to the WP root):

```bash
wp post list --post_type=page --name=home --field=ID
# then, with the returned ID:
wp post get <ID> --field=content > /tmp/home.html
# remove the <!-- wp:cherrystone/sponsors ... /--> block (and any partners block) from /tmp/home.html
wp post update <ID> /tmp/home.html
```

Expected: the `<!-- wp:cherrystone/sponsors /-->` block (and any partners block) no longer present in the page content.

- [ ] **Step 4: Purge LiteSpeed cache**

Run via SSH: `wp litespeed-purge all` (or the site's purge command).
Expected: cache cleared.

- [ ] **Step 5: Visual + behavioral verification (Playwright MCP)**

Use the Playwright MCP against the live homepage URL:
- `browser_navigate` to the homepage.
- `browser_snapshot` — confirm: hero with trust strip; entry cards as glass; ticker; features 3-col; investment lens with sticky copy + sector card; NO sponsors/partners section.
- Scroll through the top region (`browser_evaluate` window.scrollTo in steps) and `browser_take_screenshot` at ~5 scroll positions — confirm the video frames change behind the sections (desktop) and content stays readable over the scrim.
- `browser_resize` to 390×844 (mobile) and repeat scroll screenshots — confirm canvas frames advance with scroll and content is legible.
- `browser_console_messages` — confirm no JS errors, and that `unified-canvas.js` is not requested (`browser_network_requests` should not list it).

Expected: all of the above hold. Record screenshots for the tuning pass.

- [ ] **Step 6: Commit any deploy notes / asset changes**

```bash
git add -A
git commit -m "chore(home): deploy cinematic homepage + remove sponsors from live content"
```

---

## Task 12: Visual tuning pass

**Files:**
- Modify: `cherrystone-blocks/src/style.css` — `.cs-cinematic-scrim` gradient strength; glass opacities if needed.

- [ ] **Step 1: Assess legibility** from Task 11 screenshots. If text/cards are hard to read over busy frames, increase scrim opacity (e.g. raise the `rgba(251,250,247, …)` stops toward 0.5–0.7) and/or raise glass `--glass-bg` opacity locally within `.cs-cinematic`.

- [ ] **Step 2: Rebuild, redeploy, purge, re-verify** (repeat Task 11 Steps 1–2, 4–5) until legibility is acceptable across desktop + mobile.

- [ ] **Step 3: Commit**

```bash
cd cherrystone-blocks && npm run build
git add cherrystone-blocks/src/style.css
git commit -m "polish(home): tune cinematic scrim + glass for legibility"
```

---

## Self-review (completed against the spec)

- **Cinematic backdrop spanning hero→lens, scrub whole span:** Tasks 2–4. ✅
- **Remove old WebGL backdrop:** Task 1. ✅
- **Backdrop ends after lens / paper resumes:** sticky-media + `-100vh` overlap releases at region end (Task 4). ✅
- **Hero trust strip + scroll cue:** Task 9. ✅
- **Restyle entry-cards / ticker / features / lens in place:** Tasks 5–8. ✅
- **Remove sponsors + audit partners (template + live content):** Tasks 10–11. ✅
- **Reduced-motion / capture-safe:** reduced-motion CSS (Task 4) + existing preloader/fallback retained (Tasks 2–3). ✅
- **Block migration safety:** deprecations added for the two blocks whose markup changes (core-features Task 7, hero Task 9); CSS-only sections need none. ✅
- **Build/deploy/reseed pipeline (make_zips, SSH, LiteSpeed):** Task 11. ✅
- **Naming consistency:** region class `.cs-cinematic`, media `.cs-cinematic-media`, scrim `.cs-cinematic-scrim`, function `buildCinematicRegion` / `initCinematicMobile` used consistently across Tasks 2–4. ✅
