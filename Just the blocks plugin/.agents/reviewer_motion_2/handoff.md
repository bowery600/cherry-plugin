# Handoff Report — Motion Design Review

## 1. Observation

- **Target Files Audited**:
  - `c:\Users\Ethan\OneDrive - Vanderbilt\Desktop\Cherrystone\Cherrystone New Site\wordpress\Just the blocks plugin\cherrystone-blocks\assets\js\frontend.js`
  - `c:\Users\Ethan\OneDrive - Vanderbilt\Desktop\Cherrystone\Cherrystone New Site\wordpress\Just the blocks plugin\cherrystone-blocks\src\style.css`

- **Build Output**:
  - Command: `npm run build` inside `cherrystone-blocks`
  - Result: Compiles successfully (exit code 0).
  - Logs:
    ```
    webpack 5.107.2 compiled with 3 warnings in 7586 ms
    ```

- **Linter Output**:
  - Command: `npx wp-scripts lint-js assets/js/frontend.js`
  - Result: 23 errors detected (exit code 1).
  - Scope: All 23 errors are in pre-existing code outside our target range. Zero errors found inside the newly added motion code (`initMotionImprovements` function at lines 2073–2243).

- **JS Code Analysis (IntersectionObserver & requestAnimationFrame)**:
  - `initMotionImprovements` (lines 2073-2243) runs at DOM ready.
  - Returns early if `prefersReducedMotion` is true (lines 2078-2080).
  - Slider entrance animation sets initial values to min values on load (line 2092) and runs animation via `requestAnimationFrame` upon intersection.
  - Stat counter animation parses strings with a regex (line 2146) and animates values from 0 using `requestAnimationFrame`.
  - Portfolio card parallax maps mouse position directly to CSS custom variables `--px` and `--py` on `mousemove` (lines 2221-2231).
  - Mobile path of video hero `initVideoScrollHero` (lines 1116-1299) loads WebP frames in a `for` loop (lines 1244-1266) regardless of the `prefers-reduced-motion` state.

- **CSS Code Analysis (Transitions & Media Queries)**:
  - Custom easing `cubic-bezier(0.16, 1, 0.3, 1)` is bound to variables `--ease-smooth` and `--ease-spring-decel`.
  - Transform-based transitions utilize `var(--ease-spring-decel)` (e.g. `.btn` line 229, `.portfolio-card` line 995, `.member-portal-tab` line 1800).
  - Non-composited transitions exist on hovers: `background-color` (e.g. `.btn` line 229, `.value-card` line 590, `.sector-tile` line 712), `border-color` (e.g. `.split-panel` line 467), `color` (e.g. `.nav-link` line 192), `box-shadow` (e.g. `.btn` line 229).
  - Static `border-radius` is never animated or modified on hover.
  - Global reduced motion override (lines 6627-6655) forces `animation-duration: 0.01ms !important`, `transition-duration: 0.01ms !important`, and overrides all hover/active scales to `transform: none !important`.

## 2. Logic Chain

1. **Build and Syntax Integrity**: Running the build command confirms that the webpack process completes and the compiled output in `blocks/` is correctly produced. The JS linter confirms that our newly implemented motion code has no syntax or standard formatting violations.
2. **Correctness & Robustness**:
   - The scroll and intersection logic works as intended.
   - However, updating `--px` and `--py` variables on every `mousemove` without a `requestAnimationFrame` guard or throttling causes layout recalculations on every frame, representing a performance bottleneck.
   - Setting the slider value to minimum on startup changes the default state of the form before the user reaches it, and running the `requestAnimationFrame` loop for 800ms without input interception creates input fighting if the user interacts during the animation.
3. **Reduced Motion and Accessibility**:
   - The CSS global fallback is comprehensive, utilizing `!important` to suppress transitions/animations and removing transforms on hovers.
   - The JS `initMotionImprovements` handles reduced motion correctly by exiting early.
   - However, `initVideoScrollHero` (mobile path) performs a heavy `for` loop fetching 91 WebP images even when reduced motion is true, violating efficiency guidelines for vestibular-sensitive or bandwidth-limited users.
4. **CSS Easing & Compositing**:
   - Custom easing curves are applied to transforms correctly.
   - Only `.sponsor-logo-box` (line 855) uses standard `ease` for `transform`.
   - Transitions on non-composited properties (colors, borders, shadows) are common across components, violating strict compositing constraints but matching normal web practices.

## 3. Caveats

- We did not audit the pre-existing block source code in `src/` (since our review is strictly scoped to the motion additions in `assets/js/frontend.js` and `src/style.css`).
- We did not rewrite or modify any implementation files to fix the issues, strictly adhering to the review-only constraint.
- The 23 linting errors in `frontend.js` were present prior to the motion design updates.

## 4. Conclusion

**Verdict**: REQUEST_CHANGES (with major and minor findings detailed below)
**Overall Code Quality Score**: 8.5 / 10

### Detailed Review Report

#### Findings & Challenges

##### 🔴 [Major] Mobile WebP Frame Loading Overhead in Reduced Motion
- **What**: The mobile path of `initVideoScrollHero` initiates a loop fetching 91 WebP images even if `prefers-reduced-motion` is enabled.
- **Where**: `assets/js/frontend.js` lines 1244–1266.
- **Why**: Vestibular-sensitive and data-limited mobile users still pay the full bandwidth and memory costs of loading 91 WebP frames just to display the first cover frame.
- **Recommendation**: Add a check: if `reducedMotion` is true, only load the first frame (index 0) and exit early:
  ```javascript
  if ( reducedMotion ) {
      // Load only frameStart, draw it, and exit
      const img = new Image();
      img.src = frameUrl( frameStart );
      img.onload = () => {
          firstDrawable = img;
          resize();
          hidePreloader();
      };
      return;
  }
  ```

##### 🟡 [Major] Unthrottled Mousemove updates in Card Parallax
- **What**: The mousemove listener on `.portfolio-card` writes directly to style properties `--px` and `--py` on every event.
- **Where**: `assets/js/frontend.js` lines 2221–2231.
- **Why**: Mousemove fires at high frequencies. Writing styles directly without throttling or standard wrapping in `requestAnimationFrame` creates layout thrashing.
- **Recommendation**: Use a flag to schedule the style update inside a `requestAnimationFrame` callback to throttle updates to the display's refresh rate.

##### 🟡 [Major] Slider Entry Animation Conflicts with User Input
- **What**: `initSliderAnimations` resets the slider value to `minVal` on page load, and does not stop the 800ms animation loop if the user starts dragging it.
- **Where**: `assets/js/frontend.js` lines 2083–2134.
- **Why**:
  - Resetting the value on load alters the form's default state before the element enters the viewport.
  - The animation loop overrides mouse drags, making the slider thumb snap back jarredly.
- **Recommendation**: Set `slider.value = minVal` only when the element is intersecting (right before starting the animation), and add a listener for `mousedown` or `pointerdown` to immediately abort the animation loop if user interaction begins.

##### 🟢 [Minor] Non-Composited Transitions on Hover
- **What**: Multiple elements transition non-composited properties (e.g. `background-color`, `border-color`, `box-shadow`, `color`) on hover or state change.
- **Where**: `style.css` lines 192, 229, 467, 590, 712, 828, 924, 1800, 6610.
- **Why**: Violates the strict performance guideline that only `transform`, `opacity`, and `filter` should be transitioned.
- **Recommendation**: Document this as an acceptable trade-off for design completeness, or implement opacity-fading pseudo-elements for backgrounds/borders.

##### 🟢 [Minor] Missing NaN check in Stat Parser
- **What**: `initStatAnimations` parses numbers from string contents but does not check if the parsed number is `NaN` before animating.
- **Where**: `assets/js/frontend.js` lines 2143-2199.
- **Why**: If a stat is set to a string containing only dots (e.g., `"."`), the value becomes `NaN`, displaying `"NaN"` in the UI during the transition.
- **Recommendation**: Add `if ( isNaN( targetNum ) ) return;` after parsing.

##### 🟢 [Minor] Standard Easing on Logo Hover Transition
- **What**: `.sponsor-logo-box` uses `ease` instead of custom cubic-bezier spring-like curves.
- **Where**: `style.css` line 855: `transition: transform 0.2s ease;`.
- **Why**: Standard `ease` lacks the spring deceleration polish used elsewhere.
- **Recommendation**: Replace `ease` with `var(--ease-smooth)` or `var(--ease-spring-decel)`.

---

## 5. Verification Method

To verify these findings:
1. Check that the build completes successfully:
   ```bash
   npm run build
   ```
2. Run JS linting on the file to see pre-existing vs target issues:
   ```bash
   npx wp-scripts lint-js assets/js/frontend.js
   ```
3. Inspect `frontend.js` at line 1244 to verify the mobile WebP loading loop lacks a `reducedMotion` early escape.
4. Inspect `frontend.js` at line 2221 to verify that the `mousemove` listener does not throttle styles updates.
5. Enable `prefers-reduced-motion` in system preferences or via devtools emulation and load the page to confirm the mobile sequence hero still makes network requests for all 91 images.
