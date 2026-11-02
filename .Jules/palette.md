## 2024-11-02 - Missing aria-pressed and role='group' on portfolio filters
**Learning:** Found an accessibility issue pattern specific to this app's components: filter buttons in the portfolio-grid lack `aria-pressed` states to indicate selection to screen readers, and the filter groups lack `role="group"` and `aria-label`.
**Action:** Add `role="group"` and descriptive `aria-label` to `.filter-group` containers. Sync `aria-pressed` attribute with the visual `.active` class in inline JavaScript.
