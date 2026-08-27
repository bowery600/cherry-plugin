## 2024-10-24 - Animated Element Visibility Pattern
**Learning:** Managing visibility with CSS transitions conflicts with the HTML `hidden` attribute. Applying `hidden` immediately on close breaks the closing animation, but omitting it leaves the visually hidden element in the accessibility tree.
**Action:** Remove `hidden` instantly on open, and use `setTimeout` matching the exact CSS transition duration (e.g., 400ms) before applying the `hidden` attribute on close.
