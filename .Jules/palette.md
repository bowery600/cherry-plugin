## 2024-05-24 - Filter Accessibility Pattern
**Learning:** Filter buttons in server-rendered templates like the portfolio grid lack screen reader feedback for active state selection when toggling visual classes.
**Action:** Define containers with `role="group"` and `aria-label`, set `aria-pressed` attributes on toggle buttons, and sync them with `.active` classes via inline JS to ensure state changes are announced.
