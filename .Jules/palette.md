## 2023-10-27 - Accessible Filter Groups for Custom Blocks
**Learning:** Custom interactive filter blocks (like portfolio grids) often manage visual state using classes (e.g. '.active') but omit the 'aria-pressed' attribute and 'role="group"' container.
**Action:** Ensure server-rendered filter groups include 'role="group"' and 'aria-label', and sync the 'aria-pressed' state explicitly via inline JS alongside visual class toggles.
