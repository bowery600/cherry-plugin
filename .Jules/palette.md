## 2024-07-26 - Filter Group Accessibility
**Learning:** Filter buttons acting as toggles in this app's components need `role="group"`, `aria-label`, and dynamic `aria-pressed` state to be properly accessible to screen readers, instead of relying purely on visual `.active` classes.
**Action:** Ensure all button-based filter groups implement `aria-pressed` syncing in inline JavaScript alongside visual class toggles.
