## 2024-10-18 - Sync ARIA Pressed State in Filter Groups
**Learning:** When using custom toggle button groups for filtering (like in portfolio grids or resource tabs), assistive technologies need both the `role="group"` container and dynamically updating `aria-pressed` states on the buttons to understand which filter is active.
**Action:** Always sync `aria-pressed` with visual active classes (`.active`) in the JavaScript click handlers for custom filter groups.
