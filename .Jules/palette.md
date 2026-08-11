## 2024-08-11 - Accessible Filter Groups
**Learning:** For interactive filter UI (like portfolio sector filters) that act as toggle buttons, setting `.active` class alone doesn't convey state to screen readers. The buttons must have `aria-pressed="true/false"` that syncs with JS, and their container needs `role="group"` with an `aria-label` to group related filters.
**Action:** Always wrap grouped filters in `role="group"` + `aria-label` and toggle `aria-pressed` in tandem with the visual active class via JavaScript.
