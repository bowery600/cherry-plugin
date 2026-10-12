
## 2026-10-12 - Add ARIA attributes to portfolio grid filters
**Learning:** When creating custom filter button groups in server-rendered templates, it is essential to use `role="group"` and `aria-label` on the container, and `aria-pressed` on the buttons, keeping them in sync with the visual state via JS.
**Action:** Always add semantic grouping and pressed states to custom filter buttons.
