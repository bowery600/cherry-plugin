
## 2026-11-06 - Portfolio Grid Filter Buttons A11y
**Learning:** Filter button groups in server-rendered templates lacked proper ARIA roles and aria-pressed states, impacting screen reader clarity.
**Action:** Add role="group" to containers and sync aria-pressed state with the active visual class via inline JavaScript.
