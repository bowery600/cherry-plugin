## 2024-08-26 - Accessible Filter Groups
**Learning:** Filter groups using buttons to toggle visibility states were missing `role="group"`, `aria-label`, and `aria-pressed` state synchronization, causing screen readers to miss active filter context.
**Action:** Always wrap filter buttons in a `role="group"` with a descriptive label and sync `aria-pressed` states via JS when toggling visual active classes.
