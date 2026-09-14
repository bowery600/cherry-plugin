## 2024-09-14 - [Filter Group Accessibility Pattern]
**Learning:** In the portfolio grid, filter button groups lacked screen reader context and proper state indicators, making their toggle behavior invisible to assistive technologies.
**Action:** Defined filter containers with `role="group"` and `aria-label`, and synchronized `aria-pressed` with visual `.active` classes via inline JavaScript to expose filter toggle states.
