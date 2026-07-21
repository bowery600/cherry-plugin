
## 2024-07-21 - Filter Groups Accessibility Pattern
**Learning:** Filter controls in server-rendered templates using `.active` classes need explicit ARIA states to be accessible. A pattern of adding `role="group"`, `aria-label`, and toggling `aria-pressed` based on `.active` state was discovered for filter chips/buttons.
**Action:** Always apply `role="group"` with a descriptive `aria-label` to filter containers and sync `aria-pressed` with visual active classes in inline JavaScript.
