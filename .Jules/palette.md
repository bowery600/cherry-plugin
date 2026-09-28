
## 2024-05-18 - Filter Button ARIA State Desync
**Learning:** Multiple blocks (e.g., portfolio-grid) use a `.active` class for toggleable filter buttons but lack `aria-pressed` state synchronization and `role="group"` wrappers, leaving screen reader users unaware of the active filter.
**Action:** Wrap filter button sets in `role="group"` with an `aria-label`, and ensure the JavaScript toggling the `.active` class also toggles `aria-pressed="true"/"false"`.
