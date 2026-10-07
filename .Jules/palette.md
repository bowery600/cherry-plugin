## 2026-10-07 - Filter Group ARIA State Sync
**Learning:** Filter groups in this codebase (like portfolio-grid) rely on `.active` CSS classes without `aria-pressed` or `role="group"`, making their selected states invisible to screen readers.
**Action:** Always wrap filter buttons in `role="group"` with an `aria-label`, and sync `aria-pressed` attributes dynamically with the `.active` visual class in the accompanying JavaScript.
