## 2024-05-15 - Delaying hidden attribute for CSS transitions
**Learning:** Using the HTML `hidden` attribute immediately on close applies `display: none` and breaks CSS grid/opacity transitions (like in the FAQ accordion).
**Action:** Remove `hidden` instantly on open, and use `setTimeout` matching the exact CSS transition duration before applying the `hidden` attribute on close.
