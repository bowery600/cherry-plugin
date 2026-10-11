## 2026-10-11 - Added ARIA roles and pressed states to Portfolio filter groups
**Learning:** Filter groups in this project use visual classes (`.active`) for state, which isn't communicated to screen readers. Applying `role="group"` to containers and `aria-pressed` to toggle buttons makes these filters accessible.
**Action:** When creating or modifying filter button groups, always include a group role with an aria-label on the container and sync `aria-pressed` states with the visual active class via JavaScript.
