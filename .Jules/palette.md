## 2024-06-18 - Missing ARIA attributes for custom validated forms
**Learning:** Forms that use custom JS validation and omit the native `required` attribute (often to avoid default browser tooltips) frequently forget to add `aria-required="true"`, leaving screen reader users without explicit indications of which fields are required.
**Action:** Always check custom forms to ensure `aria-required="true"` is manually added to fields with visual indicators like asterisks or `data-required` attributes.
