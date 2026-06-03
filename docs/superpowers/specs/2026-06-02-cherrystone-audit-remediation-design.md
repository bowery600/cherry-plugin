# Cherrystone Audit Remediation — Design Spec

**Date:** 2026-06-02
**Source audit:** `visual_audit_findings.md`
**Goal:** Verify each audit finding against the live site (`https://cherrystone.vc`) and/or source, discard false positives, then implement confirmed fixes, build, and deploy live.

---

## Scope & session outcome

1. **Verify** every finding before touching code (Playwright for live behavior, source reads for code claims).
2. **Fix all** confirmed findings across the four remediation categories.
3. **Build** the blocks plugin (`wp-scripts build`).
4. **Deploy live** to `cherrystone.vc` by syncing only changed files over SSH.
5. **Re-verify** live with a final Playwright pass across the 7 core pages.

False positives are dropped with a one-line note in the run summary, not "fixed."

---

## Environment (confirmed)

- **Local source:** `cherrystone-theme/` (block theme) and `cherrystone-blocks/` (block plugin, `wp-scripts` build, v6.5.0).
- **Host:** Hostinger SSH `default` → `82.29.199.112:65002`, user `u255197975`. Connection verified.
- **Live paths:**
  - Theme: `/home/u255197975/domains/cherrystone.vc/public_html/wp-content/themes/cherrystone-theme`
  - Plugin: `/home/u255197975/domains/cherrystone.vc/public_html/wp-content/plugins/cherrystone-blocks`
- **theme.json presets (confirmed):** color slugs include `ink (#0a4266)`, `paper (#fafaf7)`, `accent-ink (#c44a31)`; font family slugs include `sans`, `serif`, `mono`. WordPress therefore already emits `--wp--preset--color--ink`, `--wp--preset--color--paper`, `--wp--preset--color--accent-ink`, `--wp--preset--font-family--sans`.

---

## Decision 1 — Token remapping (APPROVED)

Do **not** find-and-replace every `var(--ink)` reference. Instead redefine the `:root` aliases to consume the presets with hardcoded fallbacks, in `cherrystone-theme/assets/css/theme.css` and `cherrystone-blocks/src/style.css`:

```css
:root {
  --ink: var(--wp--preset--color--ink, #0a4266);
  --paper: var(--wp--preset--color--paper, #fafaf7);
  --accent-ink: var(--wp--preset--color--accent-ink, #c44a31);
  --font-sans: var(--wp--preset--font-family--sans, 'Inter Tight', 'Inter', -apple-system, sans-serif);
  /* + any other aliases that have a matching preset slug */
}
```

Every existing `var(--ink)` reference then responds to Global Styles automatically; fallbacks hold if a preset is missing. **Verification gate:** before editing, read both stylesheets and confirm the exact local var names in use (audit says `--font-sans`; confirm against actual `:root`). Only remap aliases that have a real matching preset slug.

---

## Decision 2 — Deploy mechanism (APPROVED)

Sync only changed files over SSH; do **not** reinstall zips (the `make_zips.py` flow is for fresh installs and risks plugin deactivation). Changed set:
- Theme: edited `.css` / `.html` / `.php` files.
- Plugin: rebuilt `build/` assets + any edited `render.php` files under `src/blocks/*`.

Upload via the Hostinger SSH MCP. After upload, verify live with Playwright. Keep a record of pre-change file state so any change can be backed out.

---

## Remediation work (verify → fix per item)

### A. Style & token fixes
- **A1 Token bypass** — Decision 1 remap. *Verify:* presets emitted in live `<head>` / source; confirm local var names.
- **A2 Footer inline styles** (`parts/footer.html`) — convert inline `style="..."` to block attributes **where they map cleanly** to supported block supports; leave anything without a clean attribute mapping as-is rather than inventing markup. *Verify:* read `parts/footer.html` and confirm the inline styles exist.

### B. Accessibility fixes
- **B1 Hamburger hit area** — ensure ≥44×44px via padding / min-height/min-width in `theme.css`. *Verify:* Playwright measures the `Open menu` button box at 375px (audit claims 24×24).
- **B2 Heading hierarchy** — fix level skips in block `render.php` and templates (e.g. company names `h4`→`h3` under an `h2` section; Home `h3`→`h2`; About/Portfolio `h4`→`h3`; Sponsors `h3` under `h1`; Apply page missing headings). *Verify:* Playwright heading-outline / accessibility snapshot per affected page; only adjust real skips. Preserve visual styling (style by class, not tag).
- **B3 Footer link spacing / skip links** — minor; confirm live before acting, low priority.

### C. Image optimization
- **C1** — switch block `render.php` renderers (`portfolio-grid`, `people-grid`, `sponsors`, `testimonials`) from raw `<img>` built from attachment URLs to `wp_get_attachment_image( $id, $size )`, which supplies `srcset`/`sizes`/`width`/`height`/`loading=lazy`. *Verify:* read each render.php; confirm it has the attachment **ID** available (not just a URL) — if only a URL is stored, fall back to C2.
- **C2** — for genuinely external URLs, add `loading="lazy"` and a container `aspect-ratio` to reserve layout.

### D. JS reliability (`frontend.js`)
- **D1** — add a retry cap (~30 attempts ≈ 1.5s) to `initGSAPScrollTrigger()`; on exhaustion log one warning and return without rescheduling (no infinite `setTimeout` recursion). *Verify:* read current retry logic.
- **D2** — call `ScrollTrigger.refresh()` inside the debounced resize handler after canvas rescale. *Verify:* read resize handler.
- **Build note:** per project memory, `frontend.js` is unbundled — confirm whether it lives in `src/` and is copied, or is loaded directly, so the edit lands in the served file.

---

## Build & verify flow

1. Verify-phase reads/Playwright checks complete; finalize the confirmed fix list.
2. Apply fixes to source.
3. `cd cherrystone-blocks && npm run build`.
4. SSH-sync changed theme files + plugin `build/` + `render.php` files.
5. Live Playwright pass: 7 core pages × {375, 768, 1320}px — confirm no horizontal scroll regressions, hamburger ≥44px, heading outlines clean, images carry `srcset`/`lazy`, no console errors from `frontend.js`.
6. Summarize: what was confirmed, what was a false positive, what was fixed, what was deployed.

---

## Risks & mitigations

- **Preset slug mismatch** → fallbacks in Decision 1 + pre-edit var-name verification.
- **Heading retag breaks visual style** → style by class, not by tag; verify visually after.
- **render.php only has image URL, not ID** → fall back to C2 (lazy + aspect-ratio).
- **Live deploy regression** → record pre-change file state; sync minimal file set; final Playwright gate before declaring done.
- **Not a git repo** → no commit safety net locally; rely on saved pre-change copies before overwriting host files.

---

## Out of scope

- Net-new visual/design changes beyond the audit.
- Unrelated refactoring.
- Re-architecting the build or zip-packaging pipeline.
