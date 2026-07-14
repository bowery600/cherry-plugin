## 2024-07-14 - ARIA States in Server-Rendered Block Filters
**Learning:** Found a pattern in `portfolio-grid` where filter buttons use `active` classes for state but lack `aria-pressed` or `role="group"` on the container. Since these blocks rely on inline vanilla JS for interaction, accessibility needs to be added both to the server-side markup (HTML) and the client-side JavaScript logic.
**Action:** Add ARIA roles to filter containers and sync `aria-pressed` states alongside `active` classes in the inline script for server-rendered filter components.
