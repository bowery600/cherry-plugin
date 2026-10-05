

## 2024-10-05 - Filter Groups Missing ARIA Pressed State
**Learning:** Filter groups (like in `portfolio-grid`) across this codebase often use visual classes (e.g., `.active`) to indicate state but omit `role="group"`, descriptive `aria-label`s, and `aria-pressed` attributes, leaving screen reader users without context or state feedback.
**Action:** When implementing or updating filter buttons or tabs, always wrap them in a `role="group"` with an `aria-label`, and synchronize the `aria-pressed` state with the visual active class via JavaScript.
