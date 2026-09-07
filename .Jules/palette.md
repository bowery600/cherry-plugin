## 2024-09-07 - Add ARIA attributes to portfolio filter groups
**Learning:** Custom filter groups in server-rendered templates (like the portfolio grid) are visually styled using `active` classes but lack accessibility semantics. They need `role="group"`, an `aria-label`, and `aria-pressed` to communicate toggle state to screen readers.
**Action:** Always add `role="group"` to filter containers and sync `aria-pressed` with visual active classes in inline JavaScript.
