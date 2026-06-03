# Cherrystone Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify each `visual_audit_findings.md` finding against the live site/source, fix confirmed issues across tokens / a11y / images / JS, build the blocks plugin, and deploy to `cherrystone.vc`.

**Architecture:** Edits land in local source (`cherrystone-theme/` CSS+templates, `cherrystone-blocks/src` PHP+CSS, `cherrystone-blocks/assets/js/frontend.js`). The blocks plugin compiles via `wp-scripts build` (note: `frontend.js` is unbundled and served from `assets/js/` directly — it is NOT compiled). Only changed files are synced to the host over SSH; live Playwright passes gate before and after.

**Tech Stack:** WordPress block theme + dynamic blocks (PHP render.php), `@wordpress/scripts` build, vanilla JS + GSAP/ScrollTrigger, Hostinger SSH MCP, Playwright MCP.

**Verification model:** There is no unit-test framework. The "test" for each fix is a Playwright measurement/snapshot on the live site and/or a source read. Each task verifies the finding is real before fixing, then re-verifies after.

**No git:** This directory is not a git repository, so there are no commits. Each fix task ends with a manual checkpoint. Before overwriting any live file, download a `.bak` copy (Task 9).

**Confirmed environment:**
- Theme local: `cherrystone-theme/`; live: `/home/u255197975/domains/cherrystone.vc/public_html/wp-content/themes/cherrystone-theme`
- Plugin local: `cherrystone-blocks/`; live: `/home/u255197975/domains/cherrystone.vc/public_html/wp-content/plugins/cherrystone-blocks`
- SSH MCP connection `default` verified (`82.29.199.112:65002`).
- `theme.json` presets emit `--wp--preset--color--{ink,paper,accent-ink}` and `--wp--preset--font-family--sans`.

**Verified-during-planning findings:**
- A2 (footer inline styles) is a **FALSE POSITIVE** — `parts/footer.html` already uses Gutenberg block attributes (`{"style":{"typography":{...}}}`); the inline `style=""` is their serialized output. **No task.**
- C1 (`wp_get_attachment_image`) is **largely not applicable** — all four image blocks build `src` from URL meta / `get_the_post_thumbnail_url()` + an `onerror` PNG→SVG→initials fallback chain, with no usable attachment ID. Converting would break the fallback. Use C2 (lazy + dims) instead.

The 7 core pages: Home `/`, About `/about`, Portfolio `/portfolio`, Sponsors `/sponsors`, Apply `/apply-for-capital`, Members `/member-login`, and the Resources/Founders page (confirm exact slug in Task 1).

---

## Task 1: Live baseline verification (Playwright)

**Files:** none (read-only verification). Record results in a scratch note.

- [ ] **Step 1: Confirm the 7 page slugs**

Run via Playwright: navigate to `https://cherrystone.vc` and read the primary nav links to confirm exact slugs (esp. the Resources/Founders page). Record the final 7 URLs.

- [ ] **Step 2: Measure the hamburger touch target at 375px**

```
browser_resize(width=375, height=800)
browser_navigate("https://cherrystone.vc")
browser_evaluate(() => {
  const b = document.querySelector('.wp-block-navigation__responsive-container-open');
  if (!b) return 'NO BUTTON';
  const r = b.getBoundingClientRect();
  return { w: r.width, h: r.height, cls: b.className };
})
```
Expected (per audit): ~24×24px. Record actual w/h and the exact button class for Task 4.

- [ ] **Step 3: Capture heading outlines on Home, About, Portfolio, Sponsors, Apply**

For each page:
```
browser_navigate(url)
browser_evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
  .map(h => h.tagName + ' ' + h.textContent.trim().slice(0,40)))
```
Record the outline per page. Confirm the skips the audit claims (Home H1→H3; About/Portfolio H2→H4; Sponsors H1→H3; Apply has no H1–H4 in main).

- [ ] **Step 4: Confirm no horizontal scroll + capture console errors (baseline)**

For each of the 7 pages at 375 / 768 / 1320 px:
```
browser_evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
browser_console_messages()  // record any errors, esp. GSAP-related
```
Record baseline so post-deploy comparison is apples-to-apples.

- [ ] **Step 5: Checkpoint**

Write the confirmed/false-positive status of each finding into a scratch list. Any finding that does NOT reproduce is dropped from the remaining tasks with a one-line note.

---

## Task 2: Token remap — theme.css `:root` (Finding A1)

**Files:**
- Modify: `cherrystone-theme/assets/css/theme.css:14,16,23,32`

- [ ] **Step 1: Verify current `:root` values**

Read `cherrystone-theme/assets/css/theme.css` lines 6–45. Confirm: `--paper: #fafaf7;` (14), `--ink: #0a4266;` (16), `--accent-ink: #c44a31;` (23), `--font-sans: 'Inter Tight', ...;` (32).

- [ ] **Step 2: Apply the preset-with-fallback remap**

Change each of these four declarations so the local alias consumes the WP preset with the existing literal as fallback:

```css
--paper: var(--wp--preset--color--paper, #fafaf7);
--ink: var(--wp--preset--color--ink, #0a4266);
--accent-ink: var(--wp--preset--color--accent-ink, #c44a31);
--font-sans: var(--wp--preset--font-family--sans, 'Inter Tight', 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif);
```

Leave all other `:root` vars (e.g. `--paper-warm`, `--ink-muted`) unchanged unless they have an exact matching preset slug in `theme.json` (they do not — only `ink`, `paper`, `accent-ink`, `sans` map cleanly). Do NOT touch the hundreds of `var(--ink)` references elsewhere; they inherit automatically.

- [ ] **Step 3: Verify the file still parses**

Re-read the edited block; confirm 4 declarations changed, balanced braces, no stray characters.

- [ ] **Step 4: Checkpoint** — note A1/theme.css done.

---

## Task 3: Token remap — blocks src/style.css `:root` (Finding A1)

**Files:**
- Modify: `cherrystone-blocks/src/style.css:14,16,26,43`

- [ ] **Step 1: Verify current values**

Read `cherrystone-blocks/src/style.css` lines 5–45. Confirm `--paper` (14), `--ink` (16), `--accent-ink` (26), `--font-sans` (43).

- [ ] **Step 2: Apply identical remap**

```css
--paper: var(--wp--preset--color--paper, #fafaf7);
--ink: var(--wp--preset--color--ink, #0a4266);
--accent-ink: var(--wp--preset--color--accent-ink, #c44a31);
--font-sans: var(--wp--preset--font-family--sans, 'Inter Tight', 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif);
```

Leave the second `:root` at line ~2220 (inside a media query / override block) unchanged unless it redeclares these same four tokens with literals — if it does, read it and apply the same fallback pattern; otherwise leave it.

- [ ] **Step 3: Verify** — re-read block; confirm changes + balanced braces.

- [ ] **Step 4: Checkpoint** — note this file feeds the `wp-scripts build` in Task 9.

---

## Task 4: Hamburger touch target ≥44px (Finding B1)

**Files:**
- Modify: `cherrystone-theme/assets/css/theme.css` (append a rule near the existing `.cs-site-header` block, ~line 130–180)

Skip this task if Task 1 Step 2 showed the button already ≥44×44px.

- [ ] **Step 1: Confirm the exact button selector**

From Task 1 Step 2 you have the button's class. WordPress core uses `.wp-block-navigation__responsive-container-open`. Use the actual class observed.

- [ ] **Step 2: Add the hit-area rule**

Append to `theme.css` (use the real selector from Step 1):

```css
/* A11y: ensure the mobile nav toggle meets the 44px minimum touch target. */
.wp-block-navigation__responsive-container-open,
.wp-block-navigation__responsive-container-close {
	min-width: 44px;
	min-height: 44px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 10px;
}
```

If the icon visually grows too large, keep the SVG/icon size fixed and let padding create the hit area (the flex centering above already does this).

- [ ] **Step 3: Verify locally** — re-read appended rule; confirm selector matches Step 1.

- [ ] **Step 4: Checkpoint** — live re-measure happens in Task 10.

---

## Task 5: Heading hierarchy + matching CSS (Finding B2)

**Files:**
- Modify: `cherrystone-blocks/src/blocks/portfolio-grid/render.php:122` (h4→h3)
- Modify: `cherrystone-blocks/src/blocks/people-grid/render.php:82` (h4→h3)
- Modify: `cherrystone-blocks/src/blocks/sponsors/render.php:53` (h3→h2)
- Modify: `cherrystone-blocks/src/style.css:1001` (`.portfolio-card h4` → `.portfolio-card h3`)
- Modify: `cherrystone-blocks/src/style.css:1405` (`.member-card h4` → `.member-card h3`)

Only retag the headings whose skip was confirmed in Task 1 Step 3. The section-level headings in these blocks are `<h2>` (portfolio/people) so company/member names must be `<h3>` (not `<h4>`); the Sponsors block heading sits directly under the page `<h1>` so it must be `<h2>` (not `<h3>`).

- [ ] **Step 1: portfolio-grid render.php**

Change line 122 from:
```php
<h4><?php echo esc_html( $name ); ?></h4>
```
to:
```php
<h3><?php echo esc_html( $name ); ?></h3>
```

- [ ] **Step 2: people-grid render.php**

Change line 82 from `<h4><?php echo esc_html( $name ); ?></h4>` to `<h3><?php echo esc_html( $name ); ?></h3>`.

- [ ] **Step 3: sponsors render.php**

Change line 53 from:
```php
<h3 style="margin-top: 16px; font-size: 22px; max-width: 30ch;"><?php echo wp_kses_post( $heading ); ?></h3>
```
to:
```php
<h2 style="margin-top: 16px; font-size: 22px; max-width: 30ch;"><?php echo wp_kses_post( $heading ); ?></h2>
```
(Inline `font-size:22px` preserves the visual size, so promoting the tag does not enlarge it.)

- [ ] **Step 4: Update tag-based CSS selectors in src/style.css**

Line 1001: `.portfolio-card h4 {` → `.portfolio-card h3 {`
Line 1405: `.member-card h4 { font-size: 16px; font-weight: 600; margin: 0; }` → `.member-card h3 { font-size: 16px; font-weight: 600; margin: 0; }`

(The base rule `h1, h2, h3, h4 { }` at line 130 already covers all heading tags, so no base typography change needed. The sponsors h2 keeps its inline font-size, so no sponsor CSS change needed.)

- [ ] **Step 5: Verify** — grep `src/style.css` for `.portfolio-card h4` and `.member-card h4`; expect zero matches. Grep the three render.php for the old tags; expect zero.

- [ ] **Step 6: Checkpoint** — note Apply-page missing-headings sub-finding handled in Task 6.

---

## Task 6: Apply-page heading (Finding B2 cont.)

**Files:** TBD-by-verification — determined in Step 1.

The audit says the Apply page (`/apply-for-capital`) has no H1–H4 in main content. This page is composed of blocks/templates, not necessarily one of the render.php files above.

- [ ] **Step 1: Locate the Apply page's main heading source**

From Task 1 Step 3's Apply outline, determine whether the page genuinely lacks a visible top heading. Identify the source: a page template in `cherrystone-theme/templates/`, a pattern, or a form block (`member-portal`/founder-application). Grep `cherrystone-theme/` and `cherrystone-blocks/src/blocks/` for the Apply page's visible title text.

- [ ] **Step 2: Add a single `<h1>` (or correct the existing top heading level)**

If the page's hero/title is rendered as a lower-level tag or styled `<p>`, promote it to `<h1>`. If the title lives in a template/pattern HTML file, edit that file's heading block `{"level":N}` to `1`. Preserve styling via existing classes/inline font-size. Make the minimal change that gives the page exactly one `<h1>` followed by sequential headings.

- [ ] **Step 3: Verify** — re-run the Apply heading-outline evaluate (post-build/deploy in Task 10) and confirm an `H1` now leads.

- [ ] **Step 4: Checkpoint.**

---

## Task 7: Image lazy-loading + dimensions (Finding C2)

**Files:**
- Modify: `cherrystone-blocks/src/blocks/portfolio-grid/render.php:114-119`
- Modify: `cherrystone-blocks/src/blocks/people-grid/render.php:77`
- Modify: `cherrystone-blocks/src/blocks/sponsors/render.php:84-89`
- Modify: `cherrystone-blocks/src/blocks/testimonials/render.php:77`

Add `loading="lazy"` and `decoding="async"` to each raw `<img>`. Keep the existing `onerror`, `style`, `alt`, and `src` exactly as-is. Do NOT switch to `wp_get_attachment_image()` (would break the URL-meta + onerror fallback chain — see plan header).

- [ ] **Step 1: portfolio-grid**

Change the `<img>` (lines 114–119) to add the two attributes after `alt`:
```php
<img
	src="<?php echo esc_url( $logo_url ); ?>"
	alt="<?php echo esc_attr( $name ); ?>"
	loading="lazy"
	decoding="async"
	onerror="<?php echo esc_attr( $on_error ); ?>"
	style="display:block;width:100%;height:100%;object-fit:contain;padding:4px;"
>
```

- [ ] **Step 2: people-grid**

Change line 77 to:
```php
<img src="<?php echo esc_url( $photo_url ); ?>" alt="<?php echo esc_attr( $name ); ?>" loading="lazy" decoding="async" width="200" height="200" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
```
(`width/height="200"` matches the `medium` thumbnail and the fixed circular `.member-avatar`; `width:100%` keeps it responsive — the attributes only supply an intrinsic ratio to prevent CLS.)

- [ ] **Step 3: sponsors**

Change the `<img>` (lines 84–89) to add the attributes after `alt`:
```php
<img
	src="<?php echo esc_url( $logo_url ); ?>"
	alt="<?php echo esc_attr( $logo_alt ? $logo_alt : $name ); ?>"
	loading="lazy"
	decoding="async"
	onerror="<?php echo esc_attr( $on_error ); ?>"
	style="display: block; width: 100%; height: 100%; object-fit: contain; padding: 4px;"
>
```

- [ ] **Step 4: testimonials**

Change line 77 to:
```php
<img src="<?php echo esc_url( $photo_url ); ?>" alt="<?php echo esc_attr( $author ); ?>" loading="lazy" decoding="async" width="40" height="40" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; flex-shrink: 0;">
```

- [ ] **Step 5: Verify** — grep the four render.php for `loading="lazy"`; expect 4 matches. Confirm each still has its original `onerror`/`src`/`alt`.

- [ ] **Step 6: Checkpoint.**

---

## Task 8: GSAP retry cap + ScrollTrigger.refresh (Findings D1, D2)

**Files:**
- Modify: `cherrystone-blocks/assets/js/frontend.js:455-472` (retry cap)
- Modify: `cherrystone-blocks/assets/js/frontend.js:440-453` (resize handler refresh)

Reminder: `frontend.js` is NOT bundled — it is served directly. The edit lands in the file the browser loads; the Task 9 build does not touch it, but it must still be synced.

- [ ] **Step 1 (D1): Add a bounded retry to `initGSAPScrollTrigger`**

The current guard (lines 468–471) recurses forever via `setTimeout`. Introduce a counter in the enclosing `initImageSequenceHero` scope and cap retries. Replace:
```js
				if ( ! window.gsap || ! window.ScrollTrigger ) {
					// Wait 50ms and try again to avoid race conditions with deferred/external scripts
					setTimeout( initGSAPScrollTrigger, 50 );
					return;
				}
```
with:
```js
				if ( ! window.gsap || ! window.ScrollTrigger ) {
					// Bounded retry: ~30 × 50ms ≈ 1.5s, then give up gracefully
					// rather than recursing forever if GSAP never loads.
					gsapRetries += 1;
					if ( gsapRetries > 30 ) {
						// eslint-disable-next-line no-console
						console.warn(
							'Cherrystone hero: GSAP/ScrollTrigger did not load; showing static hero.'
						);
						renderFrame( 0 );
						[ kicker, title, sub, actions, indicator ].forEach( ( el ) => {
							if ( el ) {
								el.style.opacity = '1';
								el.style.transform = 'none';
							}
						} );
						return;
					}
					setTimeout( initGSAPScrollTrigger, 50 );
					return;
				}
```

- [ ] **Step 2 (D1): Declare the counter**

Immediately before `const initGSAPScrollTrigger = () => {` (line 455), add:
```js
			let gsapRetries = 0;
```
(Same indentation level as the other `const`/`let` inside `initImageSequenceHero`.)

- [ ] **Step 3 (D2): Refresh ScrollTrigger after resize**

In `handleResize` (lines 440–453), after `renderFrame( Math.round( sequence.frame ) );` add a guarded refresh:
```js
			renderFrame( Math.round( sequence.frame ) );

			// Keep pin/scrub bounds aligned with the new canvas size.
			if ( window.ScrollTrigger ) {
				window.ScrollTrigger.refresh();
			}
```

- [ ] **Step 4: Verify** — re-read lines 440–500; confirm: `gsapRetries` declared once, incremented + capped, graceful fallback present, `ScrollTrigger.refresh()` guarded. Run `npm run lint:js` in `cherrystone-blocks` if available; expect no new errors on `frontend.js`.

- [ ] **Step 5: Checkpoint.**

---

## Task 9: Build the blocks plugin

**Files:** generates `cherrystone-blocks/build/**`

- [ ] **Step 1: Install deps if needed**

Run in `cherrystone-blocks/`: if `node_modules` is present (it is), skip; else `npm install`.

- [ ] **Step 2: Build**

Run: `cd cherrystone-blocks && npm run build`
Expected: `wp-scripts build` completes with no errors; `build/style-index.css` (or equivalent) reflects the `src/style.css` token edits; `build/*` block assets regenerated.

- [ ] **Step 3: Verify the token change reached the build**

Grep `cherrystone-blocks/build/` for `--wp--preset--color--ink`; expect ≥1 match (proves the src/style.css remap compiled in).

- [ ] **Step 4: Checkpoint** — list the exact changed local files to sync:
  - `cherrystone-theme/assets/css/theme.css`
  - `cherrystone-theme/` Apply-page template/pattern (if edited in Task 6)
  - `cherrystone-blocks/build/**` (rebuilt)
  - `cherrystone-blocks/assets/js/frontend.js`
  - (render.php live under `build/`? confirm in Task 10 Step 1 — see note)

---

## Task 10: Deploy to live host (SSH sync)

**Files:** uploads to the live theme + plugin paths.

- [ ] **Step 1: Confirm how render.php is served live**

Dynamic blocks register render via `block.json` `"render": "file:./render.php"`. Confirm whether the live plugin loads render.php from `build/` or `src/` by checking each block's `block.json` and where `wp-scripts` copies it. Run:
```
execute-command: find /home/u255197975/domains/cherrystone.vc/public_html/wp-content/plugins/cherrystone-blocks -name render.php -path '*portfolio-grid*'
```
Sync the render.php edits to whichever location is authoritative (and rebuild copies them into `build/` — verify `build/blocks/portfolio-grid/render.php` contains `<h3>` locally before upload).

- [ ] **Step 2: Back up live files**

For every file about to be overwritten, download a timestamped copy first (Hostinger MCP `download` or `cp` on host):
```
execute-command: cp <livefile> <livefile>.bak-2026-06-02
```
Cover: `themes/cherrystone-theme/assets/css/theme.css`, the plugin `build/` dir (`cp -r build build.bak-2026-06-02`), `assets/js/frontend.js`, and any edited template.

- [ ] **Step 3: Upload changed files**

Use the Hostinger SSH MCP `upload` for each:
- `cherrystone-theme/assets/css/theme.css` → live theme path
- edited Apply template/pattern (if any) → live theme path
- `cherrystone-blocks/build/` (full dir) → live plugin `build/`
- `cherrystone-blocks/assets/js/frontend.js` → live plugin `assets/js/frontend.js`

- [ ] **Step 4: Bust caches**

If a caching plugin/object cache is active, flush it (`wp cache flush` via execute-command if WP-CLI present). Note the theme/plugin asset version query strings — if unchanged, append a manual cache-bust or confirm versions bumped so browsers refetch CSS/JS.

- [ ] **Step 5: Checkpoint** — record what was uploaded and the `.bak` locations for rollback.

---

## Task 11: Live re-verification (Playwright)

**Files:** none (read-only).

- [ ] **Step 1: Hamburger ≥44px**

At 375px on Home, re-run the Task 1 Step 2 measurement. Expected: width ≥44 AND height ≥44.

- [ ] **Step 2: Heading outlines fixed**

Re-run Task 1 Step 3 evaluate on Home, About, Portfolio, Sponsors, Apply. Expected: no level skips (Portfolio/About company/member names now `H3` under `H2`; Sponsors heading now `H2` under page `H1`; Apply now has a leading `H1`).

- [ ] **Step 3: Images carry lazy + dims**

On Portfolio and About:
```
browser_evaluate(() => [...document.querySelectorAll('.portfolio-card img, .member-card img')]
  .slice(0,5).map(i => ({ loading: i.loading, w: i.getAttribute('width'), h: i.getAttribute('height') })))
```
Expected: `loading: "lazy"` present.

- [ ] **Step 4: Tokens respond + visuals intact**

Confirm computed color still resolves (no broken fallback):
```
browser_evaluate(() => getComputedStyle(document.body).color)
```
Expected: the ink navy resolves (rgb of #0a4266 or a Global-Styles override), not empty/black default. Spot-check Home/Portfolio render visually via screenshot — colors and fonts unchanged from baseline.

- [ ] **Step 5: No horizontal scroll + no new console errors**

Re-run Task 1 Step 4 across all 7 pages × {375, 768, 1320}. Expected: still no horizontal scroll; console errors no worse than baseline; hero still animates (or degrades gracefully).

- [ ] **Step 6: Final summary**

Report: each finding → {confirmed-and-fixed | false-positive | not-reproduced}, files changed, deploy confirmation, and any residual items (e.g. footer-link spacing B3 if deprioritized).

---

## Self-review notes

- **Spec coverage:** A1 → Tasks 2–3; A2 → false positive (documented, no task); B1 → Tasks 1+4; B2 → Tasks 1+5+6; C1 → documented N/A; C2 → Task 7; D1/D2 → Task 8; build → Task 9; deploy → Task 10; re-verify → Task 11. All spec items mapped.
- **Type/selector consistency:** CSS selector edits in Task 5 (`.portfolio-card h3`, `.member-card h3`) match the retagged elements in Tasks 5 Steps 1–2. `gsapRetries` declared (Task 8 Step 2) before use (Step 1).
- **Known soft spots requiring in-task verification:** exact Apply-page heading source (Task 6 Step 1); live render.php location build-vs-src (Task 10 Step 1); cache-busting mechanism (Task 10 Step 4). Each is an explicit verify step, not a placeholder.
- **B3 (footer link spacing / skip links):** low priority; address only if it reproduces in Task 1 and time permits — otherwise list as residual in Task 11 Step 6.
