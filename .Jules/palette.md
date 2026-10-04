# Palette Journal

## 2026-10-04 - Missing aria-pressed state on filter group buttons
**Learning:** Filter buttons in custom blocks (like portfolio-grid) rely heavily on visual classes (e.g., `.active`) for state but lack `aria-pressed` attributes. Furthermore, the button groups lack a semantic `role="group"` and `aria-label`.
**Action:** Always verify that interactive filter groups include `role="group"` on the container and sync the `aria-pressed` state with the visual `.active` class via JavaScript for screen reader support.
