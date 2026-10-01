
## 2026-10-01 - Adding ARIA states to filter groups
**Learning:** Filter buttons using a container need `role="group"` and `aria-label` to be properly identified by screen readers, and inline JavaScript toggling `.active` classes must also toggle `aria-pressed` states.
**Action:** Whenever adding custom UI filter buttons without a library, ensure the container has `role="group"` and sync the active class with `aria-pressed`.
