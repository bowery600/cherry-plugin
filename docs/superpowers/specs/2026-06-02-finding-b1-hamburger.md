# Finding B1: Mobile Navigation Touch Target & Header Branding

## 1. Finding Overview

* **ID**: B1
* **Category**: Accessibility (A11y)
* **Severity**: High
* **Target Files**:
  * [cherrystone-theme/parts/header.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-theme/parts/header.html)
  * [cherrystone-theme/assets/css/theme.css](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-theme/assets/css/theme.css)

## 2. Description

The mobile navigation trigger button (`Open menu` toggle button) measures only **24x24px** on Mobile viewports (375px wide). This is a critical violation of WCAG 2.1 Success Criterion 2.5.5 (Target Size) and Apple/Google HIG guidelines, which mandate touch targets to be at least **44x44px** (or 48x48px) to accommodate tap gestures accurately without accidental clicks.

Additionally, the brand header contains divergent structural markup.

## 3. Template Divergence Analysis

The header template part has two implementations between the backup and production:

* **Live Header** ([cherrystone-theme/parts/header.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-theme/parts/header.html)):
  * Uses hardcoded HTML wrapper elements to embed a custom logo:
    ```html
    <a class="cs-brand-link" href="/" aria-label="Cherrystone Angel Group home">
        <img class="cs-brand-logo" src="/wp-content/themes/cherrystone-theme/assets/img/logo-official.png" alt="Cherrystone Angel Group" width="220" height="59" />
    </a>
    ```
  * Enforces fixed width/height values directly in HTML.
  * Contains fully populated custom navigation lists inside `wp:navigation`.
* **Test Copy** ([test_unzip/parts/header.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/test_unzip/parts/header.html)):
  * Employs standard WordPress block grammar:
    ```html
    <!-- wp:site-logo {"width":34} /-->
    <!-- wp:site-title {"level":0} /-->
    ```
  * Site title and logo are loaded dynamically via theme customizer settings.
  * Features an empty `wp:navigation` placeholder.

## 4. Remediation Strategy

1. **Expanding Mobile Touch Target**:
   Append styling guidelines to the main `theme.css` sheet to increase the active click area without scaling up the hamburger icon itself. Add padding and flex alignment attributes:
   ```css
   /* A11y mobile nav toggle padding */
   .wp-block-navigation__responsive-container-open,
   .wp-block-navigation__responsive-container-close {
       min-width: 44px;
       min-height: 44px;
       display: inline-flex;
       align-items: center;
       justify-content: center;
       padding: 10px;
   }
   ```

2. **Logo Alignment**:
   Maintain the live theme's HTML logo structure (`logo-official.png` image element) to ensure exact aspect ratios and custom styling classes are applied, while applying the touch-area remediation to its sibling navigation elements.
