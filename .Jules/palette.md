## 2026-10-28 - ARIA state synchronization for filter groups
**Learning:** Filter buttons in portfolio-grid use `.active` classes for styling but lack `aria-pressed` and `role="group"` attributes, obscuring their state from screen readers.
**Action:** When implementing filter groups, always define the container with `role="group"` and an `aria-label`, initialize `aria-pressed="true"` on the active button, and synchronize the ARIA state with the visual classes in the inline JavaScript.
