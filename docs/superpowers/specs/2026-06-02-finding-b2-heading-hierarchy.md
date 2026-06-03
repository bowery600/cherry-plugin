# Finding B2: Heading Hierarchy & Layout Structure

## 1. Finding Overview

* **ID**: B2
* **Category**: Accessibility (A11y)
* **Severity**: Medium
* **Target Files**:
  * [cherrystone-blocks/src/blocks/portfolio-grid/render.php](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-blocks/src/blocks/portfolio-grid/render.php)
  * [cherrystone-blocks/src/blocks/people-grid/render.php](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-blocks/src/blocks/people-grid/render.php)
  * [cherrystone-blocks/src/blocks/sponsors/render.php](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-blocks/src/blocks/sponsors/render.php)
  * [cherrystone-blocks/src/style.css](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-blocks/src/style.css)
  * [cherrystone-theme/templates/front-page.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-theme/templates/front-page.html)
  * [cherrystone-theme/templates/page.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-theme/templates/page.html)

## 2. Description

The headings structure skipped levels on multiple core templates and custom grids, making navigation confusing for screen readers:
* **Home Page**: Section headings skip from `H1` to `H3` ("Capital plus operators..."), bypassing `H2`.
* **About / Portfolio Pages**: Grids skipped from `H2` (section titles) to `H4` (individual names).
* **Sponsors Page**: Heading levels skipped from `H1` to `H3` ("Our Ecosystem").
* **Apply Page**: Contained no headings (`H1`–`H4`) in the main page content, presenting only a footer `H5`.

## 3. Template Divergence Analysis

The layout wrappers in FSE templates diverge between production and the test backup, causing variations in how block contents inherit width settings:

* **Live Templates** (e.g. [cherrystone-theme/templates/front-page.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-theme/templates/front-page.html) and [page.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-theme/templates/page.html)):
  * Enforces the `"layout":{"type":"default"}` setting:
    ```html
    <!-- wp:group {"tagName":"main","metadata":{"name":"Main"},"layout":{"type":"default"}} -->
    ```
  * Blocks fill container widths based on custom block stylesheet rules.
* **Test Copy** (e.g. [test_unzip/templates/front-page.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/test_unzip/templates/front-page.html) and [page.html](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/test_unzip/templates/page.html)):
  * Enforces constrained Gutenberg layout sizing (`"layout":{"type":"constrained"}`):
    ```html
    <!-- wp:group {"tagName":"main","metadata":{"name":"Main"},"layout":{"type":"constrained"}} -->
    ```
  * Requires setting content bounds inside block properties, which restricts nested element rendering widths.

## 4. Remediation Strategy

1. **Promote Grids Headings**:
   In `portfolio-grid/render.php` and `people-grid/render.php`, change company and member name headings from `<h4>` to `<h3>` to follow section `<h2>` containers:
   ```php
   <h3><?php echo esc_html( $name ); ?></h3>
   ```

2. **Promote Sponsors Heading**:
   In `sponsors/render.php`, change the block heading from `<h3>` to `<h2>` to follow the site title `H1`:
   ```php
   <h2 style="margin-top: 16px; font-size: 22px; max-width: 30ch;"><?php echo wp_kses_post( $heading ); ?></h2>
   ```

3. **Update CSS Selectors**:
   In the blocks stylesheet `src/style.css`, align class overrides with the retagged headings:
   * Select and replace `.portfolio-card h4` with `.portfolio-card h3`.
   * Select and replace `.member-card h4` with `.member-card h3`.

4. **Correct Apply-Page Header**:
   Ensure the Apply page template/pattern includes a semantically valid `<h1>` leading the main content container, retaining visual sizes using appropriate classes or block properties.
