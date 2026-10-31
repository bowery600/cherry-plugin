
## 2024-10-31 - Filter Group ARIA State Management
**Learning:** Portfolio filters in this app's server-rendered blocks use inline JavaScript and visual CSS classes (`.active`) for toggle states but lack ARIA communication, meaning screen reader users cannot perceive the active filter state.
**Action:** Apply `role="group"` and `aria-label` to filter containers and sync `aria-pressed` attributes with the `.active` class toggles in the inline JS for all custom filter components.
