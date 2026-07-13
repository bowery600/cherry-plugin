## 2024-07-13 - Syncing ARIA state with filter groups
**Learning:** In the Cherrystone codebase, filter group containers often lack `role="group"` and `aria-label`, and their child filter buttons rely solely on the visual `.active` class without syncing to `aria-pressed`. Screen readers cannot determine which filter is active.
**Action:** Apply `role="group"` and an `aria-label` to the filter containers, and add `aria-pressed` to the toggle buttons. Sync `aria-pressed` state with the `.active` class using inline JavaScript.
