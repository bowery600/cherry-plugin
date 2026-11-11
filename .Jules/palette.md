## 2026-11-11 - Sync ARIA states on server-rendered filter groups
**Learning:** Filter groups in WordPress blocks often rely on inline JavaScript or global scripts to toggle visual classes (like `.active`) without updating ARIA states.
**Action:** Always ensure filter containers have `role="group"` with an `aria-label`, and that the toggle script explicitly syncs `aria-pressed="true/false"` alongside visual active classes.
