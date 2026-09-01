## 2026-09-01 - Filter Accessibility Pattern
**Learning:** The portfolio grid filter buttons used visual classes (`.active`) for state but lacked screen reader context (`aria-pressed` and `role="group"`). The inline JS needs to sync both visual and ARIA states.
**Action:** When implementing filter groups or toggle buttons in server-rendered templates, always define the container with `role="group"` and `aria-label`, use `aria-pressed` on the buttons, and sync state in JS.
