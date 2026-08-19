## 2024-08-20 - Filter Accessibility Pattern
**Learning:** Server-rendered filter groups (like in `portfolio-grid`) lack semantic grouping and state communication for assistive tech out-of-the-box, meaning screen readers just see a list of unrelated buttons.
**Action:** Always wrap filter buttons in a container with `role="group"` and `aria-label`. Use `aria-pressed="true/false"` on the buttons, and ensure the `aria-pressed` state is synchronized with the visual active class (e.g., `.active`) via JavaScript.
