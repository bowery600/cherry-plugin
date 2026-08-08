## 2024-08-08 - Filter Button Accessibility Pattern
**Learning:** Filter groups in this server-rendered application frequently use `.active` classes without corresponding ARIA states.
**Action:** When implementing filter groups or toggle buttons, define the container with `role="group"` and a descriptive `aria-label`, use `aria-pressed="true"/"false"` to indicate active state, and sync the ARIA state alongside visual classes via JavaScript.
