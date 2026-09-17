# Palette Journal

## 2026-09-17 - Filter Group Accessibility
**Learning:** Filter groups using button elements need explicit ARIA states to be accessible. A container needs `role="group"` and `aria-label`, while the buttons require `aria-pressed` states that sync with visual active classes.
**Action:** Always add `role="group"`, descriptive `aria-label`, and JS-synced `aria-pressed` attributes when creating custom filter button groups.
