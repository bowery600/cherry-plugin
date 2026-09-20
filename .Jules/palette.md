## 2023-10-24 - Portfolio Grid Filter Accessibility
**Learning:** The portfolio grid filter buttons lack proper ARIA attributes to convey their active state to screen readers, and the filter groups don't have roles or labels identifying them as a group of filters.
**Action:** Add `role="group"` and `aria-label` to `.filter-group` containers, and `aria-pressed="true/false"` to the `.filter-btn` elements, updating the ARIA state via JavaScript when the visual `active` class is toggled.
