## 2024-05-18 - Server-rendered Filter Accessibility Pattern
**Learning:** Found that `role="group"` and `aria-label` are used on the filter group container, and `aria-pressed="true"`/`false` is expected to manage filter active state on buttons, mirroring `.active` class toggles in WordPress server-rendered inline Javascript blocks.
**Action:** Implement `aria-pressed` for server-rendered filter block logic to ensure accurate state reporting to screen readers, applying it specifically in `portfolio-grid`.
