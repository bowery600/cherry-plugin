## 2024-07-08 - Accessible Filter Groups
**Learning:** In the Cherrystone server-rendered blocks (like `portfolio-grid`), filter groups are constructed using `button` elements with visual `active` classes tied together via inline JS.
**Action:** Always ensure filter groups apply `role="group"` with an `aria-label` to group buttons for screen readers, and synchronize `aria-pressed` state with the visual `active` class via the block's inline JavaScript.
