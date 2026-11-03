## 2024-05-24 - Missing ARIA states on custom filter chips
**Learning:** Custom filter chip implementations (like `.resource-tabs`) frequently rely only on visual classes (e.g., `.active`) to indicate state, leaving screen reader users without context of the current selection or the group's purpose.
**Action:** Always ensure filter containers have `role="group"` and a descriptive `aria-label`, and sync the `aria-pressed` state on the buttons themselves via JavaScript.
