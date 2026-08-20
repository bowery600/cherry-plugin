## 2026-08-20 - Adding aria-pressed to filter buttons
**Learning:** Found a missing accessibility pattern in portfolio grid and page communications filter buttons. While the visual active state is maintained through the `active` class, screen readers are not informed of the pressed state.
**Action:** Adding `role="group"` and `aria-label` to filter containers, and `aria-pressed="true"/"false"` to the buttons. Need to make sure the inline JS updates these attributes when buttons are clicked.
