## 2024-07-03 - [Filter Groups Accessibility]
**Learning:** Filter groups and toggle buttons in server-rendered templates (like render.php) need explicit ARIA states to indicate active filters, since visual classes (like `.active`) don't communicate this to screen readers.
**Action:** When implementing filter groups or toggle buttons, define the container with `role="group"` and an `aria-label`, use `aria-pressed="true"` for active states, and update `aria-pressed` synchronously with the visual `.active` class via inline JavaScript.
