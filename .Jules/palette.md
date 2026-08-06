
## 2024-08-06 - Filter Button Accessibility Pattern
**Learning:** For server-rendered toggle buttons that filter content without page reloads, relying solely on visual `.active` classes leaves screen reader users unaware of the active filter state. Grouping them and toggling `aria-pressed` state is essential.
**Action:** Always wrap related toggle buttons in a `role="group"` with an `aria-label`, initialize `aria-pressed` on the server, and sync it with visual classes in JavaScript when the user interacts.
