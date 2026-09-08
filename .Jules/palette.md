## 2024-09-08 - Filter Group Accessibility
**Learning:** Filter groups using buttons need explicit ARIA grouping and state management because visual `.active` classes are invisible to screen readers.
**Action:** Always add `role="group"` with an `aria-label` to filter containers, and synchronize `aria-pressed` state with the visual active class in JavaScript.
