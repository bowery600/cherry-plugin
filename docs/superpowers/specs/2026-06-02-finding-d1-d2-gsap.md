# Finding D1 & D2: GSAP Script Loading & ScrollTrigger Alignment

## 1. Finding Overview

* **ID**: D1 & D2
* **Category**: JavaScript Script Reliability
* **Severity**: High
* **Target Files**:
  * [cherrystone-blocks/assets/js/frontend.js](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-blocks/assets/js/frontend.js)

## 2. Description

The frontend animation controller script contains execution risks and display layout bugs during script loading and resize events:
* **D1 (Infinite Loop)**: When initializing the image sequence hero component, if GSAP or ScrollTrigger are not immediately available, `initGSAPScrollTrigger()` loops infinitely by rescheduling a `setTimeout(initGSAPScrollTrigger, 50)` block. If script loading fails due to network dropouts or user adblockers, the page enters a memory-leaking loop.
* **D2 (Bound Misalignment)**: When the window width is resized, the canvas scaling function handles the redraw correctly but fails to trigger GSAP's scroll tracking recalculations. This causes the parallax scrubbing pin and scroll regions to remain anchored to the old viewport bounds.

## 3. Script Environment Note

Unlike other parts of the compiled plugin codebase, `frontend.js` is loaded directly by the browser from `assets/js/` (it is not bundled or compiled by `wp-scripts`). Changes must be applied directly to the source file in order to update the live component.

## 4. Remediation Strategy

1. **GSAP Retry Counter and Exit Cap (D1)**:
   Add a counter variables block to tracking scopes and limit maximum retries. If the script fails to locate GSAP libraries within 30 attempts (~1.5s), log a warning console message, stop looping, and fall back to displaying the static hero banner elements:
   ```js
   let gsapRetries = 0;
   const initGSAPScrollTrigger = () => {
       if ( ! window.gsap || ! window.ScrollTrigger ) {
           gsapRetries += 1;
           if ( gsapRetries > 30 ) {
               console.warn( 'Cherrystone hero: GSAP/ScrollTrigger did not load; showing static hero.' );
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
       // ... standard GSAP initialization follows ...
   };
   ```

2. **Recalculating Scroll Boundaries on Resize (D2)**:
   Add a check to verify that ScrollTrigger exists, then execute a layout refresh inside the debounced `handleResize()` function after rendering the frame:
   ```js
   renderFrame( Math.round( sequence.frame ) );
   
   if ( window.ScrollTrigger ) {
       window.ScrollTrigger.refresh();
   }
   ```
