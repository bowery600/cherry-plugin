## 2026-06-30 - Added accessible filter states to portfolio grid
**Learning:** The standard method for applying visually interactive server-side filters using role="group", aria-label, and dynamically synced aria-pressed via inline JS creates excellent keyboard accessibility. Applying standard ARIA attributes alongside semantic classes allows screen readers to correctly read states.
**Action:** Prioritize verifying role and active-state syncing when modifying visual group filter sets.
