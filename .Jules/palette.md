## 2026-11-04 - Accessible Filter Chips
**Learning:** Filter chips used across the site (like in resource cards and communications feed) lacked `aria-pressed` states and group roles, making it difficult for screen reader users to understand which filter is active.
**Action:** Always add `role="group"` and an `aria-label` to the container of filter chips, and sync `aria-pressed` (true/false) with the visual active class on the chips in both PHP templates and JavaScript.
