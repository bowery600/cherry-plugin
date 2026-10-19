## 2026-10-19 - Accessible Filter Buttons
**Learning:** Filter groups need explicit `role="group"`, an `aria-label`, and individual buttons must sync their visual active state with `aria-pressed` so screen readers understand the active filter.
**Action:** Always pair `.active` state toggling with `aria-pressed` in JS handlers for custom filter buttons.
