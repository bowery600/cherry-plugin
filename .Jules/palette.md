## 2026-07-09 - Filter Group Accessibility Pattern
**Learning:** Filter groups in server-rendered templates often lack proper ARIA semantics for groups and toggle buttons (missing `role="group"`, `aria-label`, and `aria-pressed`).
**Action:** When implementing or updating filter groups, ensure the container has `role="group"` and a descriptive `aria-label`. Individual toggle buttons should use `aria-pressed` synchronized with the visual active class (e.g., `.active`) via inline JavaScript.
