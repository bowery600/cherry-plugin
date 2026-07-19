## 2024-07-19 - FAQ Accordion Accessibility Fix
**Learning:** HTML 'hidden' attribute removes elements from the accessibility tree and visually hides them with display: none, which breaks CSS grid/opacity transitions.
**Action:** When creating animated elements that need to be hidden from screen readers, remove the hidden attribute right before opening to allow the transition, and add the hidden attribute back after the transition completes using setTimeout.
