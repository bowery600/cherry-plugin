## 2024-08-12 - Portfolio Filter Group Accessibility Pattern
**Learning:** In this project, custom client-side filter groups are built using plain buttons. To make these accessible, they must be wrapped in a container with `role="group"` and an `aria-label`, and the buttons themselves must track their state using `aria-pressed="true/false"` synced via JavaScript.
**Action:** Always add `role="group"`, `aria-label` to custom filter button containers, and `aria-pressed` states synced with visual active classes in inline JavaScript.
