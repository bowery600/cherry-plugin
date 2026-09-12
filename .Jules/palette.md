
## 2026-09-12 - Accessible Filter Groups
**Learning:** Filter groups in this project (like portfolio grid or resource cards) frequently use `.active` classes for visual toggle states without corresponding ARIA attributes.
**Action:** Always wrap filter buttons in a container with `role="group"` and an `aria-label`, and use inline JavaScript to synchronize the `.active` class with `aria-pressed="true"/"false"` on the buttons to ensure screen readers announce the toggle state correctly.
