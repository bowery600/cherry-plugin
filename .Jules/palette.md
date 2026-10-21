## 2024-05-15 - ARIA Toggles in Filter Groups
**Learning:** Filter buttons (like those in portfolio-grid) without ARIA pressed states fail to communicate which filter is active to screen readers. Container `role="group"` helps define the boundary of these exclusive choices.
**Action:** Always wrap filter groups in `role="group"` with an `aria-label` and toggle `aria-pressed="true"/"false"` on the buttons in sync with the visual active class.
