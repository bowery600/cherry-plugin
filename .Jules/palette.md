## 2024-05-18 - Missing ARIA pressed states on filter groups
**Learning:** The filter and tab groups across `portfolio-grid`, `page-communications`, and `resource-cards` lack `aria-pressed` states, rendering the active state invisible to screen reader users. The CSS `.active` class is correctly toggled, but accessibility state isn't synced.
**Action:** Add `aria-pressed="true"` for active chips/buttons and `aria-pressed="false"` for inactive ones, and ensure JavaScript click handlers sync these attributes along with class toggling.
