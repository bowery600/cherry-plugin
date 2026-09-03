## 2024-09-03 - [Portfolio Grid Filter Accessibility Pattern]
**Learning:** The portfolio grid block uses inline JavaScript to manage filter state via a `.active` class but lacks semantic grouping and ARIA state management, which is a recurring pattern for filter groups in this codebase.
**Action:** Implement `role="group"` and `aria-label` for filter groups in server-rendered templates, and sync `aria-pressed` states with visual classes via inline JS to maintain accessibility.
