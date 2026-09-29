## 2024-05-24 - Portfolio Grid Filter Accessibility
**Learning:** Filter groups in the portfolio grid were missing `role="group"` and `aria-pressed` states, making them difficult to use for screen reader users as they wouldn't know which filters are active.
**Action:** Added `role="group"` and descriptive `aria-label`s to the filter containers, and synced `aria-pressed` state with the visual `.active` class via inline JavaScript.
