## 2024-08-16 - Filter Toggle Group Accessibility Pattern
**Learning:** In cherrystone-blocks server-rendered templates, visual filter toggles often rely solely on CSS classes (e.g. `.active`) without exposing their state to screen readers.
**Action:** Always wrap filter buttons in a container with `role="group"` and a descriptive `aria-label`. Use `aria-pressed="true/false"` on the buttons, and sync this attribute with the visual `.active` class via inline JavaScript.
