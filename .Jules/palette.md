
## 2024-05-18 - Missing ARIA State on Interactive Filters
**Learning:** Found a recurring accessibility issue where interactive filter buttons (in `portfolio-grid`, etc.) visually indicate active state via classes (e.g. `.active`) but lack screen reader context (`aria-pressed`). Grouping them without a `role="group"` and `aria-label` also prevents screen readers from understanding their purpose.
**Action:** When creating filter groups, always wrap them in `role="group"` with a descriptive `aria-label`, initialize active elements with `aria-pressed="true"`, and synchronize the ARIA state with visual classes in JS.
