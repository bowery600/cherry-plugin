## 2024-05-24 - Filter Group Accessibility Pattern
**Learning:** This app frequently uses filter toggle buttons within `.filter-group` or `.resource-tabs` container patterns without semantic grouping or state context for screen readers.
**Action:** Always wrap filter buttons in `role="group"` with a descriptive `aria-label`. Apply `aria-pressed="true"` on the `.active` button and `aria-pressed="false"` on others. Ensure the inline or global JavaScript syncing visually `.active` states also explicitly toggles the `aria-pressed` attributes simultaneously.
