## 2026-08-28 - [Filter Group Accessibility Pattern]
**Learning:** Filter groups in server-rendered templates (like `portfolio-grid`) lack semantic grouping (`role="group"`) and active state indications (`aria-pressed`).
**Action:** When creating or modifying filter groups, always define the container with `role="group"` and a descriptive `aria-label`. Use `aria-pressed` on the toggle buttons to indicate active state, and sync the ARIA state with visual classes (e.g., `.active`) via inline JavaScript.
