## 2024-05-14 - Accessible Filter Groups
**Learning:** In server-rendered WordPress blocks (like portfolio-grid), custom filter buttons lack native accessible states, making it impossible for screen reader users to understand their selected state or grouping.
**Action:** When implementing filter UI, always wrap buttons in a `role="group"` with an `aria-label`, and ensure the active state toggle script updates both `.active` CSS classes and `aria-pressed="true/false"` attributes concurrently.
