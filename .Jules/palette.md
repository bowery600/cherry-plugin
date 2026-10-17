## 2023-10-17 - Portfolio Filter Accessibility
**Learning:** Filter button groups in portfolio grids lack state communication for screen readers; users cannot perceive which filters are active without `aria-pressed`.
**Action:** Added `role="group"` with `aria-label` to containers, and `aria-pressed` synchronized with `.active` class to filter buttons.
