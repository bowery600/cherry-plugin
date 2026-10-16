## 2024-10-16 - Accessible Filter Groups
**Learning:** Found that custom filter button groups in server-rendered blocks (like portfolio-grid) lacked appropriate `role="group"`, `aria-label`, and `aria-pressed` state attributes, which makes keyboard navigation and screen reader usage confusing.
**Action:** When implementing custom filter tabs or buttons, always wrap them in a `role="group"` with a descriptive `aria-label`, initialize the active button with `aria-pressed="true"` (others `false`), and sync this state in the click handler alongside the visual `.active` class.
