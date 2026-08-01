## 2024-08-01 - Filter Button Accessibility Pattern
**Learning:** The custom filter buttons in server-rendered blocks (like portfolio-grid) use visual .active classes but lack proper ARIA states and group roles, which makes them inaccessible to screen readers.
**Action:** Add role="group" and aria-label to filter containers, apply aria-pressed="true" / "false" to the filter buttons, and sync this state with the .active class in the inline JavaScript.
