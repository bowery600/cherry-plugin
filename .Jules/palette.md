## 2026-07-06 - Added proper ARIA states for filter groups
**Learning:** For interactive filter buttons that toggle states visually via '.active' classes, screen readers need explicitly declared 'role="group"', 'aria-label' on wrappers, and dynamically updated 'aria-pressed' attributes.
**Action:** Always sync 'aria-pressed' with visual state toggling in inline JS.
