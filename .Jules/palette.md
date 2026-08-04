## 2024-08-04 - Accessible Filter Groups
**Learning:** Filter groups in server-rendered templates lack accessible toggle states and grouping.
**Action:** Wrap filter button groups in a `role="group"` container with a descriptive `aria-label`, and use `aria-pressed` synced via inline JavaScript to indicate the active filter toggle.
