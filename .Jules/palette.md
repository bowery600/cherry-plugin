
## 2023-10-25 - ARIA States for Filter Groups
**Learning:** Server-rendered filter buttons (like in `portfolio-grid`) rely on visual active classes (`.active`) but lack ARIA state (`aria-pressed`) and group semantics (`role="group"`, `aria-label`).
**Action:** Always pair `.active` visual states on filter buttons with `aria-pressed="true"`/`false` and wrap them in `<div role="group" aria-label="...">` to provide context and state for screen readers.
