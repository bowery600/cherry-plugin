## 2024-07-23 - Portfolio Grid Filter Accessibility
**Learning:** Adding `role="group"` and `aria-label` to server-rendered filter groups (e.g. portfolio-filters), along with `aria-pressed` states on the individual buttons, makes the filtering interaction more accessible.
**Action:** When creating or modifying server-rendered filter groups, apply `role="group"`, an appropriate `aria-label`, and use inline JS to sync `aria-pressed` state changes alongside visual `.active` classes.
