## 2024-11-01 - Add ARIA roles and pressed states to filter groups
**Learning:** Custom filter buttons without native `<fieldset>`/radio or tab patterns require explicit `role="group"` on containers and `aria-pressed` states toggled via inline JS to communicate their purpose and active state to screen readers.
**Action:** Always add `role="group"` and an `aria-label` to filter button containers, and synchronize `aria-pressed` in JS when the `active` class changes.
