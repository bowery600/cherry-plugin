## 2024-07-30 - ARIA Pattern for Filters
**Learning:** Found that `aria-pressed` should be kept in sync with the `active` visual class on filter buttons (`<button class="filter-btn">`) inside a `<div role="group">` container for accessibility.
**Action:** Always add `aria-pressed="true"`/`"false"` and container grouping attrs when managing filter state visually in JS.
