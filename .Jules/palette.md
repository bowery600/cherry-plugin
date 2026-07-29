## 2024-07-29 - Accessible Filter Groups
**Learning:** Filter groups in server-rendered blocks use `.filter-group` containers and `.active` classes on buttons, but they lack ARIA semantic meaning.
**Action:** When working with filter groups, add `role="group"` and a descriptive `aria-label` to the container, and use `aria-pressed` to indicate active state (synced with the `.active` class via JS).
