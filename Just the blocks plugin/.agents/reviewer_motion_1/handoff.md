# Motion Design Review Report

## 1. Observation
I have performed a thorough review of the motion design changes in the following files:
1. `cherrystone-blocks/assets/js/frontend.js`
2. `cherrystone-blocks/src/style.css`

Here are the direct observations from the code:
- **`assets/js/frontend.js`**:
  - In `initSliderAnimations` (lines 2087–2093), the slider value reset (`slider.value = minVal; slider.dispatchEvent(...)`) happens immediately on page load, rather than inside the `IntersectionObserver` callback.
  - In `animateSlider` (lines 2095–2119), `requestAnimationFrame` runs an 800ms animation loop without any mechanism to check if the user is currently interacting with or dragging the slider. This can override the user's manual dragging for up to 800ms.
  - Line 1483 defines `sectorIndex` in `initPortfolioOrchards` as `const sectorIndex = ( value ) => { ... }`, but this function is never referenced anywhere in the file.
  - Running `wp-scripts lint-js` on `assets/js/frontend.js` results in **23 errors**:
    - 16 instances of `curly`: `Expected { after 'if' condition` (e.g. lines 285, 414, 432, 1179, 1180, 1200, 1259, 1264, 1379, 1385, 1386, 1819, 1834, 1883, 1903, 1908).
    - 5 instances of `@wordpress/no-unused-vars-before-return` (lines 508, 799, 1101, 1102, 1948).
    - 1 instance of `no-undef`: `'Image' is not defined` (line 1245).
    - 1 instance of `no-unused-vars`: `'sectorIndex' is assigned a value but never used` (line 1483).

- **`cherrystone-blocks/src/style.css`**:
  - **Non-composited Transitions**: Many elements transition non-composited properties on hover/active states, which forces style recalculation, paint, and layout passes:
    - `.btn` (line 229) transitions `background-color 0.2s` and `box-shadow 0.2s` on hover.
    - `.split-panel` (line 467) transitions `border-color 0.2s`.
    - `.member-profile-card` (line 4655) and `.membership-tier-card` (line 4763) transition `all 0.2s`, which transitions non-composited properties like `border-color` and `box-shadow`.
    - `.member-profile-circle-avatar` (line 4680) transitions `all 0.2s`, which transitions non-composited `background` and `color`.
    - `.vault-document-card` (line 5090) and `.press-news-card` (line 5248) transition `all 0.2s` on hover, leading to repaints of borders and shadows.
    - `.faq-accordion-panel` (line 5437) transitions `grid-template-rows 0.4s` (a layout property) and `opacity 0.4s`. Transitioning grid template rows forces a full document reflow.
    - Transitions on `width` are defined at lines 5734, 6057, and 6401. Transitioning `width` triggers reflows.
  - **Unused Transitions**: `.hof-card` (line 6533) has a transition for `transform`: `transition: transform 0.2s var(--ease-spring), box-shadow 0.2s ease;`. However, `.hof-card:hover` (lines 6537–6540) only overrides `box-shadow` and does not apply any `transform`. The `transform` transition is completely dead code.
  - **Default Easing on Active/Hover States**: Standard easing (`ease`) is used instead of custom curves for multiple active/hover transitions:
    - `.btn:active` (line 237) uses `transition: transform 0.08s ease;`.
    - `.portfolio-card:active` (line 1008) uses `transition: transform 0.08s ease;`.
    - `.faq-accordion-trigger:active` (line 5410) uses `transition: transform 0.08s ease;`.
  - **Static Border Radius**: No `:hover` rules modify `border-radius`, which means static border-radius is correctly maintained.
  - **Accessibility**: A global media query block (lines 6627–6655) handles `prefers-reduced-motion: reduce` by setting animation durations and transition durations to `0.01ms !important` and removing transforms, which is robust.

---

## 2. Logic Chain
- **Slider Layout Flash**: Resetting the slider's value on load immediately overwrites its initial HTML markup state. If JavaScript is slow to run or the page loads above the fold, the user sees a visual jump to the minimum value and then back to the target value (or it stays at the minimum value if below the fold). Moving this inside the `IntersectionObserver` callback ensures the reset and animation occur in one smooth, contiguous frame when visible.
- **Uninterruptible Animation Loop**: Since `requestAnimationFrame` is not cancelled on user mouse/touch input, a user who grabs the slider during its 800ms count-up will experience a "stuttering" or "fighting" effect as the JS loop forces its calculated value over the user's drag action.
- **Performance recalcs with CSS Variables on Mousemove**: The hover tilt effect in `frontend.js` updates `--px` and `--py` custom properties on the parent `.portfolio-card` style. Because CSS variables cascade, updating them on the parent card triggers style recalculations for the card and all its nested children. Updating the transform directly on the `.logo` element is much more performant.
- **Layout Thrashing**: Transitioning layout-triggering properties like `grid-template-rows` and `width` forces browser reflow. For a complex page, this causes layout thrashing and lower framerates. Transitioning only `transform` and `opacity` prevents these layout calculations.
- **Build & Lint Verification**:
  - `npm run build` compiles successfully, meaning the JavaScript and CSS bundle outputs are correct.
  - `npm run lint:js` failed, and checking `assets/js/frontend.js` returned 23 linting errors. This directly violates the requirement: "Check that the code runs clean, formatted, and passes wp-scripts linting."

---

## 3. Caveats
- This review was conducted statically and with build tools; I did not execute the code inside a live WordPress block editor session, which might surface additional Gutenberg editor-specific hooks or lifecycle bugs.
- I assumed the standard browser globals (`Image`, `window`, etc.) are available, but ESLint flags `Image` as undefined due to the lack of environment configuration in the project's ESLint setup.

---

## 4. Conclusion
**Verdict**: REQUEST_CHANGES
**Overall Code Quality Score**: 68 / 100
While the motion design changes compile and build clean, and accessibility queries are robustly written, the code fails the project's standard JavaScript linting, has an uninterruptible animation frame loop on the slider, and uses non-composited CSS transitions that trigger browser repaints and document reflows.

---

## 5. Verification Method
1. **Compilation**: Run `npm run build` in the `cherrystone-blocks` directory. It compiles clean with no webpack errors.
2. **Linting**: Run `npx wp-scripts lint-js assets/js/frontend.js` inside the `cherrystone-blocks` directory to verify the linting errors.

---

## Review Summary

**Verdict**: REQUEST_CHANGES

## Findings

### [Critical] Finding 1: wp-scripts Linting Failures in `frontend.js`
- **What**: The javascript linter returns 23 errors.
- **Where**: `cherrystone-blocks/assets/js/frontend.js` (various lines).
- **Why**: Expected `{` after `if` condition (16 lines), unused variables like `sectorIndex` (line 1483), and unused variables prior to return (lines 508, 799, 1101, 1102, 1948).
- **Suggestion**: Wrap all single-line `if` statements in braces, remove the unused `sectorIndex` variable, structure variable declarations closer to their usage, and declare `/* global Image */` at the top of the file to fix the undefined global error.

### [Major] Finding 2: Uninterruptible Animation Loop on Slider
- **What**: Slider animation frame loop cannot be cancelled by user interaction.
- **Where**: `cherrystone-blocks/assets/js/frontend.js:2095` (`animateSlider`)
- **Why**: If the user grabs the slider handle while the 800ms count-up is playing, the loop overrides user input, causing handle stutter.
- **Suggestion**: Add a listener for `mousedown`/`touchstart`/`input` on the slider that cancels the `requestAnimationFrame` loop using `cancelAnimationFrame` when triggered.

### [Major] Finding 3: Non-Composited Transitions in CSS
- **What**: Transitioning `background-color`, `border-color`, `box-shadow`, `width`, and `grid-template-rows` causes repaints and reflows.
- **Where**: `cherrystone-blocks/src/style.css` (lines 229, 467, 4655, 4680, 4763, 5090, 5248, 5437, 5734).
- **Why**: Transitioning non-composited properties degrades rendering performance on hover states. E.g. `.faq-accordion-panel` transitions `grid-template-rows`, triggering page reflow.
- **Suggestion**: Avoid transitioning non-composited properties on hover. Use opacity/transform overlays to fade in hover background/border effects, or keep color/border changes instant without transitions.

### [Minor] Finding 4: Dead Transform Transition on `.hof-card`
- **What**: Unused transition rule for `transform`.
- **Where**: `cherrystone-blocks/src/style.css:6533`
- **Why**: The transition property includes `transform 0.2s var(--ease-spring)`, but no hover rule actually applies a transform to `.hof-card`.
- **Suggestion**: Remove `transform` from the transition rule or add a corresponding transform to `.hof-card:hover`.

### [Minor] Finding 5: Slider Reset Layout Flash
- **What**: Slider value reset happens immediately on load.
- **Where**: `cherrystone-blocks/assets/js/frontend.js:2091`
- **Why**: Overwrites value on load, causing a layout flash if the slider is above the fold.
- **Suggestion**: Move the reset logic (`slider.value = minVal`) inside the `IntersectionObserver` callback, right before `animateSlider` is called.

---

## Verified Claims

- **wp-scripts compilation** → verified via running `npm run build` → **PASS** (compiles clean with 3 expected bundle-size warnings)
- **wp-scripts linting** → verified via running `npx wp-scripts lint-js assets/js/frontend.js` → **FAIL** (23 lint errors found)
- **Static border-radius on hover** → verified via searching `style.css` for `border-radius` changes in hover selectors → **PASS** (no changes found)
- **prefers-reduced-motion queries** → verified via checking media query rules in `style.css` (lines 6627–6655) and JS logic (lines 2074, 496, 1110) → **PASS** (disables animations cleanly)

---

## Coverage Gaps
- None. Full coverage of both requested files was achieved.

---

## Challenge Summary

**Overall risk assessment**: MEDIUM

## Challenges

### [High] Challenge 1: Slider Interaction Interruption
- **Assumption challenged**: The user will not interact with the slider during the first 800ms of entering view.
- **Attack scenario**: User scrolls to the calculator and immediately drags the range slider.
- **Blast radius**: The range handle stutters and jumps under the user's cursor for up to 800ms, creating a broken feel.
- **Mitigation**: Add listeners for user interaction to cancel the animation.

### [Medium] Challenge 2: Style Recalculations on Card Mousemove
- **Assumption challenged**: Setting CSS variables on `.portfolio-card` during `mousemove` is cheap.
- **Attack scenario**: User hovers over cards on a page with many portfolio nodes.
- **Blast radius**: Cascading style updates force full subtree style recalculation on every pixel of mouse movement, which can cause micro-stutters.
- **Mitigation**: Set style properties directly on the `.logo` element rather than custom properties on the parent `.portfolio-card`.

---

## Stress Test Results

- **Hover over many cards rapidly** → updates parent CSS variables → style recalculations cascade down entire card tree → potential frame drop on lower-end devices.
- **User grabs slider handle during entry animation** → RAF loop sets slider value 24 times → fights user's cursor → handle snaps back and forth until 800ms elapsed.
