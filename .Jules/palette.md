## 2024-09-19 - Filter Button Accessibility Pattern
**Learning:** Custom toggle buttons in filter groups (e.g., portfolio grid) lack ARIA states by default, unlike native radio buttons.
**Action:** Always wrap filter groups in `role="group"` with an `aria-label`, and sync `aria-pressed` with `.active` classes in JavaScript.
