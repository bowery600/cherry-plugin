## 2024-08-31 - Filter Button Accessibility Pattern
**Learning:** Filter button groups in server-rendered templates lack ARIA roles and state. Standard project pattern uses `role="group"` with `aria-label` for containers and `aria-pressed` for buttons, toggled via inline JS.
**Action:** Always check filter groups for `role="group"`, `aria-label` and `aria-pressed` synchronization when implementing or reviewing server-rendered UI components.
