## 2024-06-20 - Adding ARIA labels to Gutenberg Blocks
**Learning:** When adding `aria-label`s or modifying HTML in a Gutenberg block's `save.js` (like in the Document Diligence Vault), you MUST create a deprecation object in `index.js`. Modifying serialized HTML without a deprecation causes validation errors for existing blocks in the WordPress editor.
**Action:** Always include a `deprecated` array in the `registerBlockType` call whenever changing the `save` function's output structure or attributes to ensure backwards compatibility.
