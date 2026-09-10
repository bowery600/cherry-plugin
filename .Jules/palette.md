## 2024-09-10 - Filter Group Accessibility Pattern
**Learning:** Filter groups in server-rendered blocks were relying only on visual `.active` classes without communicating state to screen readers.
**Action:** Always wrap filter buttons in a container with `role="group"` and a descriptive `aria-label`, add `aria-pressed="true/false"` to the buttons, and sync the ARIA state with the visual class via JavaScript.
