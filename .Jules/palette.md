## 2026-08-03 - Missing Filter ARIA States Pattern
**Learning:** Found a common accessibility pattern missing across custom blocks (`portfolio-grid`, `resource-cards`, `page-communications`) where filter controls use `.active` classes visually but lack `role="group"`, `aria-label`, and synced `aria-pressed` attributes.
**Action:** Always add `role="group"` and `aria-label` to filter containers and sync `aria-pressed` with `.active` visual classes in JS.
