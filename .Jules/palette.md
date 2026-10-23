## 2023-10-24 - ARIA group active state handling
**Learning:** Found a missing `aria-pressed` / `aria-current` sync pattern for group controls (like `.comms-feed-tabs .chip` and `.resource-tabs .chip`). The blocks set `role="group"` on the container and rely on `.active` classes, but the active state isn’t communicated to screen readers.
**Action:** Always sync `aria-pressed="true"` (for buttons) or `aria-current="true"` (for chips acting like tabs/filters) with the `.active` class state.
