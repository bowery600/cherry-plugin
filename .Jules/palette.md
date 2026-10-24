## 2026-10-24 - ARIA States in Filter Groups
**Learning:** Filter groups in cherrystone-blocks rely purely on visual CSS classes (`.active`) for toggle state, leaving screen readers unaware of the selected filter.
**Action:** Always add `role="group"` with descriptive `aria-label` to filter containers and sync `aria-pressed` states with the visual classes in the inline JavaScript.
