## 2024-07-02 - Server-rendered Filter Group ARIA Sync
**Learning:** When adding ARIA states (like `aria-pressed`) to interactive filter groups rendered by PHP (e.g., `render.php`), the state must be manually synchronized in the companion inline JavaScript that toggles the visual classes (like `.active`). Screen readers will otherwise announce stale states after the first interaction.
**Action:** Always check for and update the associated inline JavaScript when adding ARIA state attributes to server-rendered interactive elements.
