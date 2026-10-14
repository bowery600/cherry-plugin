## 2024-10-14 - Filter Groups ARIA Pattern
**Learning:** Filter groups (like portfolio filters and communications feed tabs) are implemented using standard buttons but lack aria-pressed or aria-current states to convey which filter is currently active to screen readers.
**Action:** Add aria-pressed attributes that sync with the '.active' class state on filter buttons across server-rendered templates (render.php) and frontend.js logic to improve accessibility.
