
## 2026-10-08 - Standardized ARIA States for Filter Groups
**Learning:** When implementing filter groups or toggle buttons in server-rendered WordPress templates, the active state is often purely visual (.active class). Screen readers need corresponding ARIA attributes (like `aria-pressed`) to understand the selected state, and the container needs a descriptive `role="group"`.
**Action:** Add `role="group"` and `aria-label` to filter containers, apply `aria-pressed="true|false"` on buttons initially, and ensure the inline JS toggles the ARIA attribute alongside the visual class.
