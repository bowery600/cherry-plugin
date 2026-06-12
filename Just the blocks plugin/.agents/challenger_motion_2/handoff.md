# Challenger Motion Report — Verify Motion Design

## Challenge Summary

**Overall risk assessment**: MEDIUM

- The overall correctness and robustness of the motion design enhancements are high.
- Accessibility support via `prefers-reduced-motion` is properly handled on both the video scroll hero and the overall layout.
- The assets build successfully, and the Javascript linting is completely clean.
- A medium-priority performance risk exists due to layout thrashing on portfolio card mouse movements, caused by querying the client bounding rect on every frame.

---

## 1. Observation

### Slider Animation Interruption
In `cherrystone-blocks/assets/js/frontend.js` lines 2135-2188:
```javascript
					const animateSlider = ( start, end ) => {
						const duration = 800; // ms
						let startTime = null;

						const step = ( timestamp ) => {
							if ( ! startTime ) {
								startTime = timestamp;
							}
							const elapsed = timestamp - startTime;
							const progress = Math.min( elapsed / duration, 1 );

							// cubic-bezier(0.16, 1, 0.3, 1) approximation (easeOutQuart)
							const ease = 1 - Math.pow( 1 - progress, 4 );

							slider.value = Math.round(
								start + ( end - start ) * ease
							);
							isProgrammatic = true;
							slider.dispatchEvent( new Event( 'input' ) );
							isProgrammatic = false;

							if ( progress < 1 ) {
								animationFrameId =
									requestAnimationFrame( step );
							} else {
								animationFrameId = null;
							}
						};
						animationFrameId = requestAnimationFrame( step );
						return animationFrameId;
					};

					const cancelAnimation = () => {
						if ( ! isProgrammatic && animationFrameId ) {
							cancelAnimationFrame( animationFrameId );
							animationFrameId = null;
						}
					};

					slider.addEventListener( 'mousedown', cancelAnimation );
					slider.addEventListener( 'touchstart', cancelAnimation );
					slider.addEventListener( 'input', cancelAnimation );
```

### Mobile WebP Sequence prefers-reduced-motion
In `cherrystone-blocks/assets/js/frontend.js` lines 1256-1274:
```javascript
				// Mobile prefers-reduced-motion optimized loading
				if ( reducedMotion ) {
					const img = new Image();
					img.decoding = 'async';
					img.src = frameUrl( frameStart );
					img.onload = () => {
						firstDrawable = img;
						frames[ 0 ] = img;
						resize();
						drawFrame( img );
						hidePreloader();
					};
					img.onerror = () => {
						hidePreloader();
					};
					window.addEventListener( 'resize', resize, {
						passive: true,
					} );
					return;
				}
```

### Portfolio Card Parallax and Layout Recalculation
In `cherrystone-blocks/assets/js/frontend.js` lines 2305-2325:
```javascript
					card.addEventListener( 'mousemove', ( e ) => {
						const rect = card.getBoundingClientRect();
						const x = e.clientX - rect.left;
						const y = e.clientY - rect.top;

						const px = ( x / rect.width ) * 2 - 1;
						const py = ( y / rect.height ) * 2 - 1;

						if ( rAFId ) {
							cancelAnimationFrame( rAFId );
						}

						rAFId = requestAnimationFrame( () => {
							logo.style.transform =
								'translate3d(' +
								( px * 8 ).toFixed( 3 ) +
								'px, ' +
								( py * 8 ).toFixed( 3 ) +
								'px, 0)';
						} );
					} );
```

In `cherrystone-blocks/src/style.css` line 1020:
```css
.portfolio-card .logo {
  ...
  transition: transform 0.2s var(--ease-spring-decel);
}
```

### Linting and Build Verification Results
- Ran `npx wp-scripts lint-js assets/js/frontend.js` inside `cherrystone-blocks`:
  - Result: Completed successfully with 0 linting warnings or errors.
- Ran `npm run build` inside `cherrystone-blocks`:
  - Result: Webpack compilation succeeded in `4436 ms`. Standard asset size warnings on `index.js` were shown, but 0 compilation errors were encountered.

---

## 2. Logic Chain

### Slider Animation Interruption
1. **Assertion**: Programmatic updates must not abort the requestAnimationFrame loop, but user actions (mousedown, touchstart, input) must instantly interrupt it.
2. **Step**: When the requestAnimationFrame step function updates `slider.value`, it sets `isProgrammatic = true` and dispatches an `'input'` event.
3. **Step**: The `'input'` event listener calls `cancelAnimation()` synchronously.
4. **Step**: Inside `cancelAnimation()`, the check `! isProgrammatic` evaluates to `false` because `isProgrammatic` is `true`. The animation is not cancelled.
5. **Step**: When a user clicks, touches, or drags the slider, `isProgrammatic` remains `false`.
6. **Step**: The user action fires the listener, `cancelAnimation()` runs, `! isProgrammatic` evaluates to `true`, and `cancelAnimationFrame(animationFrameId)` executes, successfully stopping the loop.
7. **Conclusion**: The slider animation interruption is correctly and robustly implemented.

### Mobile WebP Sequence early exit
1. **Assertion**: Users with `prefers-reduced-motion: reduce` on mobile must see a static hero state and avoid downloading redundant WebP frame files.
2. **Step**: The code checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
3. **Step**: If true on mobile, the code creates a single `Image` instance for the start frame, draws it once onto the canvas, hides the preloader, and calls `return;`.
4. **Step**: The early `return;` prevents the subsequent loops that fetch the remaining ~90 WebP frames and prevents setting up any event scroll triggers or requestAnimationFrame render loops.
5. **Conclusion**: The mobile WebP sequence hero handles reduced motion optimally and exits early.

### Layout Recalculation / Thrashing during Mouse Movements
1. **Assertion**: Mouse movements should not trigger forced synchronous layouts or thrashing.
2. **Step**: On every `mousemove` event, the event handler immediately reads the card's dimensions with `card.getBoundingClientRect()`.
3. **Step**: Inside `requestAnimationFrame`, a write operation updates `logo.style.transform`.
4. **Step**: The style change is applied, dirtying the layout of the document.
5. **Step**: When the next `mousemove` event fires in the next tick (before the browser's next paint/layout phase completes, or after it has dirtied layout), `card.getBoundingClientRect()` is called. Because the layout has been dirtied by the transform update, the browser is forced to perform a synchronous reflow (layout recalculation) to compute the correct dimensions.
6. **Step**: This write-then-read cycle repeating on every high-frequency `mousemove` event causes layout thrashing.
7. **Step**: Additionally, `src/style.css` defines a transition on the transform property (`transition: transform 0.2s var(--ease-spring-decel);`). The browser is forced to resolve this transition along with javascript-driven transform updates at high frequency, which may cause paint stutters or a laggy response.
8. **Conclusion**: While the parallax changes are correctly throttled using requestAnimationFrame, layout thrashing is present during mouse movements due to querying the client rect on every event.

---

## 3. Caveats

- The layout thrashing assessment is based on static analysis of the runtime interactions. The real-world impact (frame drops) will vary depending on device capabilities, CPU load, and the density of DOM nodes surrounding the portfolio grid.
- We did not modify the implementation source files to correct this finding, per our review-only constraint.

---

## 4. Conclusion

The motion enhancements are correctly designed, syntactically clean, and build successfully. However, we identify a medium performance risk on the portfolio card hover parallax effect:

### Parallax Hover Performance Issue
- **Assumption challenged**: Querying `card.getBoundingClientRect()` inside a high-frequency event handler is safe when styling updates are throttled.
- **Failure Scenario**: Moving the mouse over the portfolio cards triggers high-frequency forced synchronous layouts because the style update from requestAnimationFrame dirties layout, which is immediately read by the next mouse event's `getBoundingClientRect()` invocation.
- **Blast Radius**: Increased CPU utilization, stuttering scroll, and delayed hover response on lower-end devices.
- **Mitigation**: Cache the bounding rect on the card's `mouseenter` event, and reuse it during `mousemove`. Clear/reset the cache on `mouseleave`. For example:
```javascript
					let rect = null;
					card.addEventListener( 'mouseenter', () => {
						rect = card.getBoundingClientRect();
					} );
					card.addEventListener( 'mousemove', ( e ) => {
						if ( ! rect ) {
							rect = card.getBoundingClientRect();
						}
						const x = e.clientX - rect.left;
						const y = e.clientY - rect.top;
						const px = ( x / rect.width ) * 2 - 1;
						const py = ( y / rect.height ) * 2 - 1;
						...
					} );
					card.addEventListener( 'mouseleave', () => {
						rect = null;
						...
					} );
```

---

## 5. Verification Method

To verify these findings:
1. **Lint Check**: Run `npx wp-scripts lint-js assets/js/frontend.js` in `cherrystone-blocks` to confirm no syntax or styling issues.
2. **Build Check**: Run `npm run build` in `cherrystone-blocks` to ensure the compilation completes cleanly.
3. **Reflow Profiling**: Open the site in Chrome DevTools, record a Performance profile, move the mouse over a portfolio card, and observe the "Forced Reflow" warning flags associated with `mousemove` events pointing to `frontend.js`.
