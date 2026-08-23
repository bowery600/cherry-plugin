## 2024-10-18 - Accessible Filter Groups
**Learning:** Filter groups using custom buttons require explicit ARIA grouping (`role="group"`, `aria-label`) and state management (`aria-pressed`).
**Action:** Always wrap filter buttons in a semantic group and sync `aria-pressed` states when toggling active classes via JavaScript.
