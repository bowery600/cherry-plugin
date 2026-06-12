# Handoff Report: Motion Design & Interaction Improvements

## Summary of Findings
- **Range Slider**: Identified exact selectors `#calc-amt-slider` and `.calc-range-slider`. Designed an IntersectionObserver routine that resets the slider to minimum and interpolates it to the default/saved target value using a smooth cubic-bezier approximation (`easeOutQuart`) over 800ms, triggering the existing recomputation logic via `input` events.
- **Stat Counters**: Identified selectors for both the standard `.stats` block and the `.portfolio-stats-dashboard` block. Designed a Vanilla JS regex-based counting parser that extracts prefix, suffix, decimal precision, and formatting (including commas) and counts numbers up from 0 to target over 400ms when scrolled into view.
- **Card Hover & Active States**: Transitioning properties like `border-radius` and `border-color` during card hover was identified as a performance anti-pattern that causes layout repaints. We optimized this by making `border-radius` static and transitioning only composited properties (`transform`, `opacity`, `filter`) using a custom spring deceleration curve (`cubic-bezier(0.16, 1, 0.3, 1)`) with a fast-active tactile press scale-down (`scale(0.96-0.98)`).
- **Portfolio Card Parallax**: Discovered a static implementation of dynamic logo parallax inside `.portfolio-card`. The CSS uses variables `--px` and `--py` which were initialized to `0` and never updated. We designed a lightweight hover coordinate tracker to restore this interactive depth.
- **Reduced Motion Fallback**: Integrated a comprehensive `@media (prefers-reduced-motion: reduce)` override in CSS and a JS-level guard to instantly set target values for motion-sensitive users.

---

## 1. Observations

### A. Number Inputs & Range Sliders
- In `cherrystone-blocks/assets/js/frontend.js` at line 628–632:
  ```javascript
  const slider = wrapper.querySelector(
      '#calc-amt-slider, .calc-range-slider'
  );
  const amtDisplay =
      wrapper.querySelector( '#calc-amt-display' );
  ```
- In `cherrystone-blocks/src/blocks/pitch-eligibility-calculator/save.js` at line 56–65:
  ```jsx
  <input
      type="range"
      min="100000"
      max="2500000"
      step="50000"
      defaultValue="500000"
      id="calc-amt-slider"
      className="calc-range-slider"
      aria-valuetext="$0.50M"
  />
  ```

### B. Stats Blocks
- **Standard Stats Block**: In `cherrystone-blocks/src/blocks/stats/save.js` at line 60–66:
  ```jsx
  <div className="num">
      <RichText.Content
          tagName="span"
          className="accent"
          value={ stat.value }
      />
  </div>
  ```
  *Selector*: `.stats .stat .num span.accent` (holds composite values like `"45+"`, `"$20M"`, etc.).
- **Dashboard Stats Block**: In `cherrystone-blocks/src/blocks/portfolio-stats-dashboard/save.js` at line 43–54:
  ```jsx
  <div className="stats-number-display">
      <RichText.Content
          tagName="strong"
          className="stats-number-value"
          value={ stat.num }
      />
      <RichText.Content
          tagName="span"
          className="stats-number-suffix"
          value={ stat.suffix }
      />
  </div>
  ```
  *Selector*: `.stats-dashboard-card .stats-number-display strong.stats-number-value` (holds the numeric part, e.g., `"45"`, `"18.5"`).

### C. Interactive CSS Elements
- **Buttons** (`cherrystone-blocks/src/style.css` at line 217–235):
  ```css
  .btn {
    ...
    transition: transform 0.2s var(--ease-spring), background-color 0.2s ease, box-shadow 0.2s ease;
  }
  .btn:hover {}
  .btn:active { transition-duration: 0.08s; }
  ```
- **Portfolio Cards** (`cherrystone-blocks/src/style.css` at line 972–1011):
  ```css
  .portfolio-card {
    --px: 0;
    --py: 0;
    ...
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-radius 0.2s ease;
  }
  .portfolio-card:hover, .portfolio-card:focus-visible {
    ...
    box-shadow: var(--shadow-soft);
    border-radius: var(--radius-lg);
  }
  .portfolio-card:hover .logo {
    transform: translate3d(calc(var(--px) * 8px), calc(var(--py) * 8px), 0);
  }
  ```
- **Member Cards** (`cherrystone-blocks/src/style.css` at line 1640–1661):
  ```css
  .member-card {
    ...
    transition: transform 0.2s var(--ease-smooth), box-shadow 0.2s var(--ease-smooth), border-radius 0.2s ease;
  }
  .member-card:hover {
    transform: translateY(var(--lift));
    box-shadow: var(--shadow-strong);
    border-radius: var(--radius-lg);
  }
  ```
- **Sponsor Cards** (`cherrystone-blocks/src/style.css` at line 4403–4436):
  ```css
  .sponsor-card {
    ...
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  }
  .sponsor-card:hover, .sponsor-card:focus-within {
    border-color: var(--accent-gold);
    box-shadow: var(--shadow-soft);
  }
  ```
- **Tab Chips & Resource Tabs** (`cherrystone-blocks/src/style.css` at line 912–924, 1778–1785):
  ```css
  .chip { ... transition: all 0.2s; }
  .member-portal-tab { ... }
  ```
- **FAQ Accordion Triggers** (`cherrystone-blocks/src/style.css` at line 5358–5407):
  ```css
  .faq-accordion-trigger { ... transition: color 0.2s ease; }
  .faq-accordion-icon { ... transition: all 0.2s var(--ease-smooth); }
  .faq-accordion-panel { ... transition: grid-template-rows 0.2s ease-out, opacity 0.2s ease-out; }
  ```

---

## 2. Logic Chain

1. **Scroll-triggered animations**: Since numbers should trigger smoothly when they become visible, we wrap the slider initialization and stats count-ups in an `IntersectionObserver` with appropriate thresholds (`0.15` and `0.1`), ensuring the animation only fires when they enter the viewport and runs once.
2. **Slider Animation**: The range slider's value change dictates the dilution/alignment calculations. Setting the input's value dynamically via JS and calling `dispatchEvent(new Event('input'))` forces the browser to calculate intermediate scoring values and redraw the SVGs and text labels synchronously, preserving the existing computation codebase.
3. **Regex Parser for Stats**: Standard stats values include formatting (`+`, `M+`, `%`, `$`). Stripping commas and matching against `/^([^0-9\.\-]*)([0-9\.\-]+)(.*)$/` ensures we isolate the numeric string, prefix, and suffix. Counting decimal characters (`.split('.')[1].length`) ensures we format the count-up with exact decimal matching (e.g. `18.5` counts up via `.toFixed(1)` to avoid layout jitter).
4. **Static border-radius**: Card elements initially have no border-radius defined, but acquire `var(--radius-lg)` on hover. Animating this causes layout reflows (non-composited). By declaring the border-radius statically on both state rules, we remove layout paint cost during the translation.
5. **Dynamic Parallax**: The CSS uses `--px` and `--py` to shift the `.logo` relative to card hover, but these variables are never modified. Adding mouse tracking relative to the card's center maps client coordinates to `-1.0` to `1.0` dynamically, unlocking the 3D depth.
6. **Eases / Beziers**: Overriding `--ease-smooth` and `--ease-spring` in `:root` to a spring deceleration curve `cubic-bezier(0.16, 1, 0.3, 1)` applies a high-end, smooth physics deceleration across all transitions referencing those variables.
7. **Vestibular Safety**: Wrapping JS animations in a `prefers-reduced-motion` check and supplying a fallback CSS block ensures that users with motion sensitivity receive static, instantly loaded content.

---

## 3. Caveats
- **Browser Compatibility**: `IntersectionObserver` is standard in modern browsers. Fallback logic is provided so that if the media query matches `reduce`, or if the browser lacks observer support, the system defaults immediately to normal text and slider rendering without failures.
- **Scroll Speed Independence**: The JS counts up over a fixed time duration of `400ms` (stats) and `800ms` (slider) rather than scroll speed, ensuring consistency regardless of scroll accelerations.

---

## 4. Conclusion
We recommend modifying:
1. `cherrystone-blocks/assets/js/frontend.js`: Define and trigger `initMotionImprovements()` which handles slider and stats scroll observers, along with portfolio card hover parallax.
2. `cherrystone-blocks/src/style.css`: Redefine ease tokens, optimize hover/active transitions, keep border-radii static, and add reduced motion media query block.

The precise modifications are details in the `.patch` files generated in the workspace folder:
- `frontend.js.patch`
- `style.css.patch`

---

## 5. Verification Method

### A. Automatic Code Quality Checks
Run the following build and lint scripts in the `cherrystone-blocks` folder to verify compilation and syntax:
```powershell
# Navigate to plugin folder (DO NOT run cd in final task execution)
npm run build
npm run lint:js
```

### B. Visual & Functional Inspection
1. **Stats Block Count-up**: Scroll down to the stats block. The number should count up from 0 to the target (e.g., `45+` or `18.5`) over 400ms using a smooth ease-out curve.
2. **Calculator Slider**: Scroll down to the Pitch Eligibility Calculator. The round size slider thumb should glide from `$100k` (minimum) to `$0.50M` (or default value) over 800ms, and the dilution dial SVG circle (`#calc-score-ring`) and alignment percentages should animate dynamically in tandem.
3. **Card Tilt Parallax**: Hover over a company card in the portfolio grid. Moving the mouse across the card should tilt/translate the logo icon inside relative to mouse coordinates.
4. **Tactile Clicks**: Click and hold buttons, cards, or tab chips. They should scale down (`scale(0.96)`) on active state, returning instantly to scale on release.
5. **Accessibility**: Toggle Windows Reduced Motion or emulate `prefers-reduced-motion: reduce` in DevTools. All counters, sliders, hover lifts, and scale active effects must instantly show their end-states with zero translation or counts.
