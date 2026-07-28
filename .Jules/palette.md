## 2024-07-28 - ARIA state toggling on filter buttons
**Learning:** Filter groups (like `.filter-group`) should use `role="group"` and `aria-label` to provide context. The active state of the filter buttons should be represented with `aria-pressed="true"`, and toggled with inline JS alongside visual active classes (`.active`).
**Action:** Always add `role="group"`, `aria-label`, and initialize `aria-pressed` when building filter tabs or toggles, and sync `aria-pressed` with class changes.
