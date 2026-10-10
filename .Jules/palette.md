## 2024-10-10 - ARIA States for Filter Groups
**Learning:** Filter button groups in the custom blocks (like portfolio grid) often rely solely on visual classes (`.active`) for state, which is not announced to screen readers.
**Action:** Always wrap filter buttons in a container with `role="group"` and an `aria-label`, and sync `aria-pressed` state with the visual `.active` class via JavaScript to ensure screen reader users understand the current filter state.
