## 2024-10-25 - Missing ARIA attributes for custom filter buttons
**Learning:** In cherrystone-blocks server-rendered blocks, custom filter UI buttons use standard visual `.active` classes but frequently omit ARIA attributes (role="group", aria-label, aria-pressed), making state changes invisible to screen readers.
**Action:** Always wrap filter groups with role="group" and aria-label, initialize buttons with aria-pressed, and synchronize aria-pressed="true"/"false" with the .active CSS class in frontend JavaScript toggle handlers.
