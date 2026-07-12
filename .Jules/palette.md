## 2026-07-12 - Initializing Palette Journal\n**Learning:** Starting the journal for critical UX/accessibility learnings.\n**Action:** Will log codebase-specific insights here.

## 2026-07-12 - Portfolio Filter Groups Accessibility
**Learning:** Found that custom filter button groups in server-rendered templates lack proper `role="group"`, `aria-label`, and `aria-pressed` state syncing. Without these, screen readers just see scattered buttons without understanding their group context or active state.
**Action:** Always add `role="group"` and `aria-label` to custom filter containers. For the buttons inside, set `aria-pressed="true"` for the default active state and sync the attribute using JavaScript alongside visual class changes (e.g., `.active`).
