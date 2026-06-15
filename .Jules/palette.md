## 2024-06-15 - [Accessible Accordion Pattern]
**Learning:** Implementing WAI-ARIA standard for accordions requires linking the trigger and panel. The trigger must have `aria-expanded`, `aria-controls`, and an `id`. The panel must have `id`, `role="region"`, and `aria-labelledby` linking back to the trigger.
**Action:** Apply this pattern consistently across all custom interactive disclosure widgets in the project to ensure robust screen reader navigation.
