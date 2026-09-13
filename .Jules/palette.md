## 2024-09-13 - [Filter Groups Accessibility]
**Learning:** Found that custom filter button groups in server-rendered templates (like the portfolio grid) lacked semantic grouping and ARIA state management, relying solely on visual `.active` classes.
**Action:** Always wrap custom toggle button groups in `role="group"` with a descriptive `aria-label`, and use inline JavaScript to synchronize `aria-pressed` attributes with the active visual class to ensure screen readers can announce the current state.
