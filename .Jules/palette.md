## 2024-05-19 - Filter Groups Missing ARIA
**Learning:** Filter groups in `portfolio-grid` lack `role="group"`, `aria-label`, and their buttons lack `aria-pressed` to communicate the active state to screen readers.
**Action:** When implementing filter groups or toggle buttons in server-rendered templates, follow the project pattern: define the container with `role="group"` and a descriptive `aria-label`, use `aria-pressed` to indicate active state, and sync the ARIA state with visual classes (e.g., `.active`) via inline JavaScript.
