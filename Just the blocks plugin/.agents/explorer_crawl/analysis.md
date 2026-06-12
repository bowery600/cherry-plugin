# Cherrystone Angel Group - UI/UX Audit & Crawl Report

## Executive Summary
This report presents the findings of an automated crawl and UI/UX audit of the live website `https://cherrystone.vc`. Using Playwright, we crawled 53 unique URLs, captured page metrics, tracked console errors, and ran DOM audits against the **ui-ux-pro-max** design guidelines. 

The website uses a custom WordPress blocks plugin, presenting a refined design with Charcoal and Ocean Blue accents, EB Garamond serif headings, Inter Tight body text, and monospaced coding accents. While the design is elegant and high-contrast, several critical UI/UX issues were discovered, particularly concerning **touch target sizes on mobile**, **micro-typography readability**, **heading hierarchy violations**, and **multiple broken news links (404 errors)**.

---

## 1. List of Crawled Pages & Status

The table below lists all 53 discovered pages on `https://cherrystone.vc` with their title and HTTP response status.

| # | Page URL | Title | Status | Issues Found |
|---|---|---|---|---|
| 1 | `https://cherrystone.vc/` | Cherrystone Angel Group | 200 OK | 130 desktop, 123 mobile |
| 2 | `https://cherrystone.vc/about` | About – Cherrystone Angel Group | 200 OK | 128 desktop, 121 mobile |
| 3 | `https://cherrystone.vc/leadership` | Leadership – Cherrystone Angel Group | 200 OK | 37 desktop, 30 mobile |
| 4 | `https://cherrystone.vc/communications` | Communications – Cherrystone Angel Group | 200 OK | 37 desktop, 30 mobile |
| 5 | `https://cherrystone.vc/sponsors` | Sponsors – Cherrystone Angel Group | 200 OK | 47 desktop, 40 mobile |
| 6 | `https://cherrystone.vc/portfolio` | Portfolio – Cherrystone Angel Group | 200 OK | 44 desktop, 62 mobile |
| 7 | `https://cherrystone.vc/pitch-night` | Pitch Night – Cherrystone Angel Group | 200 OK | 26 desktop, 19 mobile |
| 8 | `https://cherrystone.vc/members` | Members – Cherrystone Angel Group | 200 OK | 32 desktop, 25 mobile |
| 9 | `https://cherrystone.vc/member-portal` | Member Portal – Cherrystone Angel Group | 200 OK | 28 desktop, 21 mobile |
| 10 | `https://cherrystone.vc/apply` | Apply – Cherrystone Angel Group | 200 OK | 27 desktop, 20 mobile |
| 11 | `https://cherrystone.vc/apply-for-capital` | Apply for Capital – Cherrystone Angel Group | 200 OK | 27 desktop, 20 mobile |
| 12 | `https://cherrystone.vc/member-interest` | Member Interest – Cherrystone Angel Group | 200 OK | 26 desktop, 19 mobile |
| 13 | `https://cherrystone.vc/portfolio-company/advanced-image-enhancement` | Advanced Image Enhancement – Cherrystone Angel Group | 200 OK | Template-based issues |
| 14 | `https://cherrystone.vc/portfolio-company/horizontal-systems` | Horizontal Systems – Cherrystone Angel Group | 200 OK | Template-based issues |
| 15 | `https://cherrystone.vc/portfolio-company/smartcells-inc` | SmartCells, Inc. – Cherrystone Angel Group | 200 OK | Template-based issues |
| 16 | `https://cherrystone.vc/partners` | Partners – Cherrystone Angel Group | 200 OK | Template-based issues |
| 17 | `https://cherrystone.vc/news/lenoss-medical-closes-series-a-funding-round` | Lenoss Medical closes Series A funding round | 200 OK | Template-based issues |
| 18 | `https://cherrystone.vc/news/cherrystone-welcomes-3-new-portfolio-companies-in-early-2024` | Cherrystone welcomes 3 new portfolio companies... | 200 OK | Template-based issues |
| 19 | `https://cherrystone.vc/news/senzime-has-entered-into-an-agreement-to-acquire-the-us-company-respiratory-motion` | Senzime acquires Respiratory Motion... | 200 OK | Template-based issues |
| 20 | `https://cherrystone.vc/news/jaia-robotics-closes-seed-funding-round-with-more-than-1-million` | Jaia Robotics closes Seed funding round... | 200 OK | Template-based issues |
| 21 | `https://cherrystone.vc/news/rellevate-closed-on-4-million-round` | Rellevate closed on $4 million round | 200 OK | Template-based issues |
| 22 | `https://cherrystone.vc/news/nodar-secures-funding-to-drive-automation` | NODAR secures funding to drive automation | 200 OK | Template-based issues |
| 23 | `https://cherrystone.vc/news/narragansett-brewery-ranked-32-largest-craft-brewery-in-america` | Narragansett Brewery ranked #32... | 200 OK | Template-based issues |
| 24 | `https://cherrystone.vc/news/nodar-awarded-patent-for-multi-camera-3d-vision-technology` | NODAR awarded patent... | 200 OK | Template-based issues |
| 25 | `https://cherrystone.vc/news/nodar-supports-a-fusion-of-sensing-technologies` | NODAR supports a fusion... | 200 OK | Template-based issues |
| 26 | `https://cherrystone.vc/news/windgap-closes-on-39m` | Windgap closes on $39M | 200 OK | Template-based issues |
| 27 | `https://cherrystone.vc/news/laurent-pharmaceuticals-announces-phase-2-clinical-trial-results` | Laurent Pharmaceuticals Phase 2... | 200 OK | Template-based issues |
| 28 | `https://cherrystone.vc/news/laurent-pharmaceuticals-provides-clinical-development-update` | Laurent Pharmaceuticals clinical update... | 200 OK | Template-based issues |
| 29 | `https://cherrystone.vc/news/unruly-released-new-research-about-connected-tv-vs-linear-tv` | Unruly research on Connected TV... | 200 OK | Template-based issues |
| 30 | `https://cherrystone.vc/news/rellevate-joins-ukg-technology-partner-network` | Rellevate joins UKG partner network... | 200 OK | Template-based issues |
| 31 | `https://cherrystone.vc/news/premama-releases-one-guide-to-prenatal-vitamins-in-vogue-magazine` | Premama guide in Vogue magazine | 200 OK | Template-based issues |
| 32 | `https://cherrystone.vc/news/kalion-inc-teams-with-agile-biofoundry-to-win-doe-grant-to-advance-bio-based-glucaric-acid` | Kalion Inc. wins DOE grant... | 200 OK | Template-based issues |
| 33 | `https://cherrystone.vc/news/narragansett-beer-gives-an-update-on-providence-brewery-opening-and-anniversary` | Narragansett Beer brewery update... | 200 OK | Template-based issues |
| 34 | `https://cherrystone.vc/pitch-night/pitch-night-2026-annual` | Pitch Night 2026 — Annual | 200 OK | Template-based issues |
| 35 | `https://cherrystone.vc/pitch-night/general-meeting` | General Meeting | 200 OK | Template-based issues |
| 36 | `https://cherrystone.vc/pitch-night/holiday-party` | Holiday Party | 200 OK | Template-based issues |
| 37 | `https://cherrystone.vc/communications/lenoss-medical-closes-series-a-funding-round` | Lenoss Medical closes Series A... | 200 OK | Template-based issues |
| 38 | `https://cherrystone.vc/communications/cherrystone-welcomes-3-new-portfolio-companies-in-early-2024` | Cherrystone welcomes 3 new... | 200 OK | Template-based issues |
| 39 | `https://cherrystone.vc/communications/senzime-has-entered-into-an-agreement-to-acquire-the-us-company-respiratory-motion` | Senzime acquires Respiratory Motion... | 200 OK | Template-based issues |
| 40 | `https://cherrystone.vc/communications/jaia-robotics-closes-seed-funding-round-with-more-than-1-million` | Jaia Robotics closes Seed... | 200 OK | Template-based issues |
| 41 | `https://cherrystone.vc/communications/rellevate-closed-on-4-million-round` | Rellevate closed on $4 million... | 200 OK | Template-based issues |
| 42 | `https://cherrystone.vc/communications/nodar-secures-funding-to-drive-automation` | NODAR secures funding... | 200 OK | Template-based issues |
| 43 | `https://cherrystone.vc/communications/narragansett-brewery-ranked-32-largest-craft-brewery-in-america` | Narragansett Brewery ranked #32... | 200 OK | Template-based issues |
| 44 | `https://cherrystone.vc/communications/nodar-awarded-patent-for-multi-camera-3d-vision-technology` | NODAR patent... | 200 OK | Template-based issues |
| 45 | `https://cherrystone.vc/communications/nodar-supports-a-fusion-of-sensing-technologies` | NODAR supports fusion... | 200 OK | Template-based issues |
| 46 | `https://cherrystone.vc/communications/windgap-closes-on-39m` | Windgap closes... | 200 OK | Template-based issues |
| 47 | `https://cherrystone.vc/communications/laurent-pharmaceuticals-announces-phase-2-clinical-trial-results` | Laurent Phase 2... | 200 OK | Template-based issues |
| 48 | `https://cherrystone.vc/communications/laurent-pharmaceuticals-provides-clinical-development-update` | Laurent clinical update... | 200 OK | Template-based issues |
| 49 | `https://cherrystone.vc/communications/unruly-released-new-research-about-connected-tv-vs-linear-tv` | Unruly Connected TV research... | 200 OK | Template-based issues |
| 50 | `https://cherrystone.vc/communications/rellevate-joins-ukg-technology-partner-network` | Rellevate UKG network... | 200 OK | Template-based issues |
| 51 | `https://cherrystone.vc/communications/premama-releases-one-guide-to-prenatal-vitamins-in-vogue-magazine` | Premama Vogue guide... | 200 OK | Template-based issues |
| 52 | `https://cherrystone.vc/communications/kalion-inc-teams-with-agile-biofoundry-to-win-doe-grant-to-advance-bio-based-glucaric-acid` | Kalion Inc. DOE grant... | 200 OK | Template-based issues |
| 53 | `https://cherrystone.vc/communications/narragansett-beer-gives-an-update-on-providence-brewery-opening-and-anniversary` | Narragansett brewery update... | 200 OK | Template-based issues |

### Broken / 404 Pages Discovered During Crawl

These links are present on the live site but return a 404 response when navigated:

1. `https://cherrystone.vc/news/cherrystone-chairman-stephen-schweich-featured-on-the-wicked-pissah-podcast` (404 Not Found)
2. `https://cherrystone.vc/news/vrychawqm8pg4rzwnujb6sct70qkb0` (404 Not Found)
3. `https://cherrystone.vc/news/a44c0jufcgxfa2hq0wptpnlssy8cek` (404 Not Found)
4. `https://cherrystone.vc/news/66zzxw7zxrggjmfyuhzd7yt20u92ss` (404 Not Found)
5. `https://cherrystone.vc/news/canadas-cfia-approves-knipbio-meal-as-a-salmon-feed-ingredient` (404 Not Found)
6. `https://cherrystone.vc/news/board-on-track-is-acquired-by-to-transact-communications` (404 Not Found)
7. `https://cherrystone.vc/news/pitch-night-winners` (404 Not Found)
8. `https://cherrystone.vc/news/windgap-medical-inc-closes-significant-series-b-round` (404 Not Found)
9. `https://cherrystone.vc/news/unruly-was-featured-as-the-first-stem-learning-tool-that-combines-coding-for-kids-with-active-play` (404 Not Found)
10. `https://cherrystone.vc/news/premama-wellness-raises-35m-in-first-institutional-funding-round` (404 Not Found)
11. `https://cherrystone.vc/news/laurent-pharmaceuticals-receives-health-canadas-approval-to-initiate-covid-19-clinical-trial` (404 Not Found)

---

## 2. Detailed Page-by-Page UI/UX Audits

### 2.1. Homepage (`https://cherrystone.vc/`)
* **Discovered Issues / Inconsistencies**:
  1. **Tappable navigation links are too small**: "Home" and "About" links in the header are only `37px` wide, which is below the 44px minimum touch target size.
  2. **Micro-text used for functional elements**: Elements like "Scroll to explore", "ACCREDITED INVESTORS", and "Pre-seed to seed" are hardcoded to `11px` (using `"JetBrains Mono"`). They are extremely hard to read on mobile.
  3. **Skip to content touch target is practically non-existent**: The link is `1.0x1.0px` in dimensions, failing standard accessibility target criteria when active.
  4. **Heading hierarchy skipped**: Skip from h2 to h4 in news grids (e.g., h2 "The latest from Cherrystone." directly to h4 headlines).
* **ui-ux-pro-max Guidelines Violated**:
  * `touch-target-size` (Touch & Interaction - Priority 2)
  * `readable-font-size` (Typography & Color - Priority 6)
  * `heading-hierarchy` (Accessibility - Priority 1)
* **Proposed Improvements**:
  * Increase the padding of header navigation links to guarantee a minimum hit box of `44x44px`.
  * Increase font-size for monospace secondary labels from `11px` to at least `12px` (preferably `13px` or `14px` for legibility).
  * Adjust headings so that news grid items use `h3` tags rather than skipping directly to `h4`.

### 2.2. About Page (`https://cherrystone.vc/about`)
* **Discovered Issues / Inconsistencies**:
  1. **Extremely narrow buttons/links**: The "Visit website ->" and "View bio" buttons are only `14px` high vertically, creating a massive mis-tap risk on mobile.
  2. **Monospaced Micro-Typography**: "Join Cherrystone", "EARLY & MIDDLE STAGE", and "QUALIFIED INVESTORS" labels are rendered at `11px`, reducing readability.
  3. **Heading skipped**: The hierarchy skips from h3 ("Become a Member") to h5 ("Site" in footer).
* **ui-ux-pro-max Guidelines Violated**:
  * `touch-target-size` (Touch & Interaction - Priority 2)
  * `readable-font-size` (Typography & Color - Priority 6)
  * `heading-hierarchy` (Accessibility - Priority 1)
* **Proposed Improvements**:
  * Style "Visit website ->" and "View bio" as distinct buttons with padding (e.g., `8px 16px`) to ensure the vertical height is at least `44px`.
  * Elevate micro-labels to `13px` with `letter-spacing: 0.05em`.
  * Correct footer title element tag from `h5` to a styled `div` or sequential heading to preserve structural hierarchy.

### 2.3. Leadership Page (`https://cherrystone.vc/leadership`)
* **Discovered Issues / Inconsistencies**:
  1. **Very tight button targets**: Similar to the About page, the profile grid uses `View bio` buttons with a vertical height of `14px`.
  2. **Footer links under 44px**: Legal and secondary navigation items in the footer (e.g., "About", "Portfolio", "Email us") are only `31.4px` in height, which fails the touch target guidelines.
  3. **Heading hierarchy skip**: Heading levels jump from h3 to h5.
* **ui-ux-pro-max Guidelines Violated**:
  * `touch-target-size` (Touch & Interaction - Priority 2)
  * `readable-font-size` (Typography & Color - Priority 6)
  * `heading-hierarchy` (Accessibility - Priority 1)
* **Proposed Improvements**:
  * Apply a vertical hitSlop or padding of at least `12px` to the "View bio" elements.
  * Increase footer link line-height or vertical padding to achieve a height of `44px`.

### 2.4. Portfolio Page (`https://cherrystone.vc/portfolio`)
* **Discovered Issues / Inconsistencies**:
  1. **Highly repetitive small target warnings**: Portfolio grid items feature links with a height of `14px` ("Visit website ->").
  2. **Monospace readability**: Use of `JetBrains Mono` at `11px` for multiple inline stats and tags.
* **ui-ux-pro-max Guidelines Violated**:
  * `touch-target-size` (Touch & Interaction - Priority 2)
  * `readable-font-size` (Typography & Color - Priority 6)
* **Proposed Improvements**:
  * Wrap the portfolio cards in a larger click target container that redirects to the external website or detail sheet, removing the need for tiny text links.

### 2.5. Members Page (`https://cherrystone.vc/members`)
* **Discovered Issues / Inconsistencies**:
  1. **Hidden input labels**: A hidden WPForms honeypot input is in the DOM (`wpforms-524-field_7`) but does not have a linked label or helper text. While visually hidden, it triggers automated accessibility alerts.
  2. **Heading skips**: Skips from h2 ("The path to membership.") to h4 ("Express Interest").
* **ui-ux-pro-max Guidelines Violated**:
  * `input-labels` (Forms & Feedback - Priority 8)
  * `heading-hierarchy` (Accessibility - Priority 1)
* **Proposed Improvements**:
  * Ensure honeypot inputs utilize `aria-hidden="true"` and `tabindex="-1"` appropriately, or supply an empty aria-label to bypass standard label checks.
  * Adjust heading tags sequentially (h2 -> h3 -> h4).

### 2.6. Apply & Apply for Capital (`https://cherrystone.vc/apply` & `/apply-for-capital`)
* **Discovered Issues / Inconsistencies**:
  1. **Honeypot label omission**: Like the members form, the WordPress application forms contain hidden spam-prevention input boxes without labels.
  2. **Button Targets in Forms**: Submission buttons and form checkbox labels have narrow target heights (`31.4px`).
* **ui-ux-pro-max Guidelines Violated**:
  * `input-labels` (Forms & Feedback - Priority 8)
  * `touch-target-size` (Touch & Interaction - Priority 2)
* **Proposed Improvements**:
  * Standardize form element spacing and button dimensions to conform to the mobile-first touch height of `44px` (or `48px` for Material compliance).

---

## 3. General UI/UX Recommendations & Core Guidelines

### 3.1. Accessibility (WCAG & ui-ux-pro-max §1)
* **Heading Structure**: Standardize document flow. Avoid jumping header levels. Ensure each page starts with `h1` and proceeds down to `h2` and `h3` sequentially.
* **Image Alt Texts**: Ensure that decorative vector motifs on the site are marked with `role="presentation"` or empty alt tags, and structural images have informative alt labels.

### 3.2. Touch & Interaction (ui-ux-pro-max §2)
* **Touch Target Size**: Increase the minimum touch target for all header, footer, bio, and portfolio link elements to `44px` height/width.
* **Visual Press Feedback**: While the site has subtle hover transitions, mobile buttons should support distinct pressed states (opacity or scale drop) to avoid double-tapping.

### 3.3. Typography & Color (ui-ux-pro-max §6)
* **Readable Font Size**: Do not use fonts smaller than `12px` for general text. Standardize micro-text to a minimum of `12px` (preferably `13px` or `14px`) with proper letter spacing.
* **Contrast of Decorative Accents**: The gold accent color (`#9a7a3d`) yields a `3.96:1` contrast ratio on the warm paper background (`#fbfaf7`). According to WCAG AA, this must be bumped to at least `4.5:1` for normal body text. Consider darkening the gold accent slightly to `#8c6f37` (which achieves a `4.6:1` ratio).

### 3.4. Navigation Patterns & Broken Flows (ui-ux-pro-max §9)
* **Resolve 404 Links**: Remove or redirect the 11 broken `/news/` URLs discovered on the site. Navigating to these dead pages breaks back-stack integrity and creates a poor user experience.
