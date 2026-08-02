## 2024-08-02 - Accessible Filter Groups
**Learning:** Filter groups in this design system must use `role="group"` with a descriptive `aria-label`, and toggle buttons need `aria-pressed` synced with their active state visual classes via inline JavaScript.
**Action:** Always apply `role="group"`, `aria-label`, and dynamic `aria-pressed` attributes when building or modifying filter toggles to maintain screen reader accessibility.
