## 2023-10-31 - [Adding ARIA groups for filters]
**Learning:** We can apply `role="group"` and `aria-label` to container elements wrapping related toggle buttons. This is helpful for screen readers. Using `aria-pressed` or `aria-current` state is also best practice. Since the project uses active class names we sync these states.
**Action:** Add proper a11y labels and sync states in custom JavaScript logic for WordPress block inline scripts.
