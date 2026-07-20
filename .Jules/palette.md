## 2024-07-20 - Portfolio Grid Filter Accessibility
**Learning:** In the portfolio grid and similar filter components, toggle buttons and filter groups often lack ARIA roles and state (`role="group"`, `aria-pressed`). This is a recurring pattern in the server-rendered blocks.
**Action:** When implementing filter groups, always define the container with `role="group"` and `aria-label`, and use `aria-pressed` synced with the visual `.active` class via inline JavaScript.
