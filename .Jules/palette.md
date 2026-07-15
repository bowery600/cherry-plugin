## 2024-07-16 - [Filter Button ARIA States]
**Learning:** Filter groups in server-rendered templates (like `portfolio-grid`) rely entirely on visual `.active` classes to indicate state, making the selected filter invisible to screen readers.
**Action:** When implementing or fixing filter buttons, always wrap them in a `role="group"` with an `aria-label`, and use `aria-pressed="true/false"` synced with the `.active` class via inline JavaScript.
