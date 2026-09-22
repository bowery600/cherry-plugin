## 2026-09-22 - Sync toggle button accessibility state
**Learning:** Filter groups and toggle buttons in server-rendered templates often rely solely on CSS classes (e.g., '.active') to convey state visually. Without 'aria-pressed' synchronized to these visual states, and 'role="group"' with descriptive labels on their containers, screen reader users miss crucial context about the active filter.
**Action:** Always wrap toggle button groups in a container with 'role="group"' and an 'aria-label', and ensure inline JavaScript updates the 'aria-pressed' attribute alongside the visual active class.
