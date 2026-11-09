1. **Identify the missing ARIA attribute issue**: The filter buttons in `portfolio-grid` and `page-communications` blocks toggle visual `.active` classes when clicked, but lack the accessible `aria-pressed` or `aria-current` state. This makes it impossible for screen reader users to know which filter is currently active.
2. **Add `aria-pressed` attribute to `page-communications`**:
   - Edit `Just the blocks plugin/cherrystone-blocks/src/blocks/page-communications/render.php` to set `aria-pressed="true"` on the initial active "All" button, and `aria-pressed="false"` on the rest.
   - Edit `Just the blocks plugin/cherrystone-blocks/assets/js/frontend.js` to toggle `aria-pressed` to `'true'` on the clicked chip and `'false'` on the others.
3. **Add `aria-pressed` attribute to `portfolio-grid`**:
   - Edit `Just the blocks plugin/cherrystone-blocks/src/blocks/portfolio-grid/render.php` to set `aria-pressed="true"` on the initially active buttons, and `aria-pressed="false"` on the rest.
   - Update the inline JS in `portfolio-grid/render.php` to sync `aria-pressed` state when toggling the active classes.
4. **Build and test the blocks**:
   - Navigate to `Just the blocks plugin/cherrystone-blocks` and run `pnpm install`, `pnpm build`, `pnpm format`, `pnpm lint:js --fix`.
5. **Pre-commit**: Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
6. **Submit PR**: Submit the changes with the Persona format.
