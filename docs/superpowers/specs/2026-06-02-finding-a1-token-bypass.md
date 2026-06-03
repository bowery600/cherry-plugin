# Finding A1 & A2: Design System Token Bypass & Footer Inline Styles

## 1. Finding Overview

* **ID**: A1 & A2
* **Category**: Styles & Tokens
* **Severity**: Medium
* **Target Files**:
  * [cherrystone-theme/assets/css/theme.css](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-theme/assets/css/theme.css)
  * [cherrystone-blocks/src/style.css](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-blocks/src/style.css)
  * [cherrystone-theme/parts/footer.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-theme/parts/footer.html)

## 2. Description

The theme and block custom stylesheets bypass the theme design presets defined in `theme.json` by redeclaring colors and fonts in `:root` with hardcoded fallback hex codes and font families. These hardcoded variables (`--ink`, `--paper`, `--accent-ink`, `--font-sans`) insulate components from layout-level shifts and style changes made inside the WordPress Global Styles Site Editor.

Furthermore, the live theme footer features hardcoded `<img>` tags and a list-based inline structure (`<ul>`) rather than leveraging block-based layout structures and attributes.

## 3. Template Divergence Analysis

There is a direct divergence between the live theme implementation and the `test_unzip/` backup copy:

* **Live Footer** ([cherrystone-theme/parts/footer.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-theme/parts/footer.html)):
  * Uses hardcoded layout classes (`cs-footer-bottom`, `cs-footer-brand`).
  * Embeds raw `<img>` tags with absolute paths (`/wp-content/themes/cherrystone-theme/assets/img/logo-full-white.png`).
  * Features a hardcoded, list-based HTML menu (`<ul>`) for Site/Founders/Contact columns, bypassing dynamic block navigation.
  * Lacks preset-based styling configuration blocks.
* **Test Copy** ([test_unzip/parts/footer.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/test_unzip/parts/footer.html)):
  * Implements `cs-footer-grid` for layout formatting.
  * Uses block-based dynamic headers and navigation:
    ```html
    <!-- wp:site-title {"level":0,"style":{"typography":{"fontSize":"18px","fontWeight":"600"},"elements":{"link":{"color":{"text":"#ffffff"}}}},"textColor":"surface"} /-->
    <!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","orientation":"vertical","justifyContent":"left"}} /-->
    ```
  * Declares inline CSS settings inside block parameters (e.g. `{"style":{"typography":{"fontSize":"13px","lineHeight":"2"}}}`).

## 4. Remediation Strategy

1. **Preset Fallback Mapping**:
   Redefine the `:root` variables inside both theme and block stylesheets to read WP custom property values while keeping hardcoded values as fallback settings.
   
   Update CSS declarations in `theme.css` and block `style.css` to:
   ```css
   :root {
       --paper: var(--wp--preset--color--paper, #fafaf7);
       --ink: var(--wp--preset--color--ink, #0a4266);
       --accent-ink: var(--wp--preset--color--accent-ink, #c44a31);
       --font-sans: var(--wp--preset--font-family--sans, 'Inter Tight', 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif);
   }
   ```

2. **Footer Realignment**:
   Keep the live theme's brand badge, address structure, and custom ACA membership logo group, but ensure any inline style blocks mapped to serialized output arrays are validated. Since A2's inline structures represent serialized Gutenberg structures generated in the block editor, leave non-supported overrides as-is to prevent parsing breaking during block template rendering.
