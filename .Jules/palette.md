## 2024-10-24 - Accessible Filter Groups
**Learning:** Filter buttons that visually act as toggles need proper ARIA states (`aria-pressed`) and group contexts (`role="group"`) to convey their state to screen readers, especially when server-rendered and synced via inline JS.
**Action:** Always wrap related filter buttons in a container with `role="group"` and `aria-label`, and ensure `aria-pressed` is synchronized with visual active classes in JS.
