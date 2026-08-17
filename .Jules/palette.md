## 2024-08-17 - Server-rendered Filter Group Accessibility
**Learning:** Filter buttons in server-rendered blocks (like `portfolio-grid`) sometimes rely only on CSS classes (`.active`) for visual state, lacking ARIA states and group context.
**Action:** When creating or modifying filter groups, define the container with `role="group"` and a descriptive `aria-label`, use `aria-pressed` to indicate active state, and sync the ARIA state with visual classes via inline JavaScript.
