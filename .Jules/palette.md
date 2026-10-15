## 2026-10-15 - Sync ARIA states with visual filter toggles
**Learning:** Filter groups using CSS classes for visual state (`.active`) often miss programmatic accessibility states (`aria-pressed`). For custom filter controls, screen readers need explicit state management synced with visual changes.
**Action:** Always add `role="group"` and descriptive `aria-label` to the container, initialize default `aria-pressed` states in HTML, and ensure JavaScript updates both the visual class and the ARIA attribute on toggle.
