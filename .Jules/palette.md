
## 2026-10-06 - [Portfolio Grid Filter Accessibility]
**Learning:** Filter buttons missing `role="group"` and ARIA pressed states reduce screen reader accessibility, confusing users on the active filter state.
**Action:** Add `role="group"` with `aria-label` to filter containers and sync `aria-pressed` states via JS for accessibility.
