## 2024-07-11 - Server-Rendered Filter Groups Need ARIA State Management
**Learning:** In server-rendered WordPress blocks like the Portfolio Grid, interactive filter groups often rely entirely on visual classes (`.active`) and inline JavaScript, missing critical semantic roles (`role="group"`) and accessible state indicators (`aria-pressed`).
**Action:** Always add `role="group"` with an `aria-label` to filter containers, and ensure inline JavaScript syncs `aria-pressed` state alongside visual classes to keep assistive technologies informed.
