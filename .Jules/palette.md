## 2024-05-20 - Filter Group Accessibility Pattern
**Learning:** Server-rendered portfolio filter groups in this codebase lack native ARIA state tracking for toggle buttons. Without `role="group"`, `aria-label`, and synced `aria-pressed` attributes, screen readers cannot perceive the filter groups or identify which filter is currently active.
**Action:** Always wrap filter button groups in `role="group"` with a descriptive `aria-label`, and use inline JavaScript to synchronize `aria-pressed` state with the visual `.active` class when toggling filters.
