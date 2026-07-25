## 2026-07-25 - Adding ARIA semantics to portfolio filters
**Learning:** Missing ARIA group roles and `aria-pressed` state for toggle buttons breaks keyboard accessibility and screen reader support for filters.
**Action:** Always add `role="group"`, `aria-label`, and sync `aria-pressed` to active visual state for groups of toggle buttons in `render.php`.
