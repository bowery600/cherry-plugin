## 2026-07-07 - Accessible Filter Pattern in render.php
**Learning:** When implementing accessible filters in server-rendered `render.php` blocks, the ARIA state (`aria-pressed`) must be initialized in the PHP template and manually synced within the embedded inline JavaScript alongside visual classes like `.active`. This pattern bypasses Gutenberg's `save.js` avoiding deprecation issues.
**Action:** Use `role="group"` on filter containers and explicitly toggle `aria-pressed` via `setAttribute()` in vanilla JS click handlers for similar frontend filtering components.
