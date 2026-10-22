## 2024-10-22 - Missing ARIA pressed and roles in Filter Groups
**Learning:** Filter groups using buttons to filter lists or grids lack `role="group"` and `aria-pressed="true/false"` attributes. This makes it impossible for screen readers to know it is a group of toggles and which one is active.
**Action:** Always add `role="group"` and `aria-label` to the container. Apply `aria-pressed="true"` when the item has the `.active` class and sync via JS.
