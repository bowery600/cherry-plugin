## 2024-10-02 - Ensure Filter Groups are Accessible
**Learning:** Filter groups in `portfolio-grid` are visually implemented using buttons but lack ARIA attributes (like `role="group"`, `aria-label`, and `aria-pressed`) to convey the grouping and current selection state to screen reader users.
**Action:** Add `role="group"` and `aria-label` to `.filter-group` containers, and `aria-pressed="true"` (or `false`) synced with the visual `.active` class for the buttons.
