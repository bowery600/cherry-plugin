
## 2024-08-09 - Adding aria-pressed to Filter Buttons
**Learning:** Found a pattern where filter group buttons lack `aria-pressed` state for screen readers, although the container has a `role="group"` and `aria-label`.
**Action:** Always add `aria-pressed="true"` for active filter buttons and `aria-pressed="false"` for inactive ones. Also, update these values dynamically within the component's JavaScript when the filter state changes.
