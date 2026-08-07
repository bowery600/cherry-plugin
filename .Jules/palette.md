## 2024-08-07 - Add ARIA attributes to portfolio filter groups
**Learning:** The portfolio filters in server-rendered templates use active visual classes but miss screen reader context, appearing as unrelated buttons instead of stateful toggle groups.
**Action:** Apply `role="group"` and `aria-label` to containers, and toggle `aria-pressed` in sync with visual active states.
