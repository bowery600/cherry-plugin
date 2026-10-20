## 2026-10-20 - Sync ARIA states for custom filter groups
**Learning:** This app uses custom inline JS and semantic HTML for toggle button filter groups (like portfolio-grid), but often misses `role="group"`, `aria-label`, and syncing `aria-pressed` states, making them invisible to screen reader users.
**Action:** Always add `role="group"` and `aria-label` to filter containers, and ensure the JS syncs `aria-pressed` alongside visual `.active` classes.
