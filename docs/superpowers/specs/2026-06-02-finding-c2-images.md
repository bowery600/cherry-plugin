# Finding C2: Image Optimization & Lazy Loading

## 1. Finding Overview

* **ID**: C2 (derived from C1 limitation)
* **Category**: Image Optimization
* **Severity**: High
* **Target Files**:
  * [portfolio-grid/render.php](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-blocks/src/blocks/portfolio-grid/render.php)
  * [people-grid/render.php](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-blocks/src/blocks/people-grid/render.php)
  * [sponsors/render.php](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-blocks/src/blocks/sponsors/render.php)
  * [testimonials/render.php](file:///c:/Users/Ethan/OneDrive%20-%20Vanderbilt/Desktop/Cherrystone/Cherrystone%20New%20Site/wordpress/cherrystone-blocks/src/blocks/testimonials/render.php)

## 2. Description

Custom blocks render image assets directly via raw `<img>` HTML nodes using database URL fields instead of invoking standard WordPress media helpers.
* **Lack of Lazy Loading**: All below-the-fold assets (e.g. 25+ company logos and member headshots) load synchronously on initial page paint, increasing network payload size and slowing down performance scores.
* **Layout Shifts (CLS)**: Images render without explicit dimensions (`width`, `height`, or wrapper `aspect-ratio` parameters), forcing the browser to recalculate bounding boxes upon image load.
* **Responsive Image Gap**: The browser cannot match screen sizes to different media sizes because no `srcset` list is supplied.

## 3. Implementation Limitation & C1 Fallback

While standard practice recommends converting raw images to `wp_get_attachment_image( $id, $size )` (Finding C1), an audit of the dynamic PHP template blocks shows that **only URL strings** (not attachment IDs) are available in the dynamic block meta. 

Additionally, these blocks use custom JavaScript `onerror` fallback chains (e.g., swapping a broken PNG to SVG, and then to a textual avatar monogram). Converting these to `wp_get_attachment_image` would remove the fallback chain, leading to broken layout states. Thus, manual attribute modification (Finding C2) is the designated remediation route.

## 4. Remediation Strategy

1. **Portfolio and Sponsors Grids**:
   Inject `loading="lazy"` and `decoding="async"` attributes directly into the HTML tags, retaining the custom `onerror` script logic and container rules:
   ```php
   <img
       src="<?php echo esc_url( $logo_url ); ?>"
       alt="<?php echo esc_attr( $name ); ?>"
       loading="lazy"
       decoding="async"
       onerror="<?php echo esc_attr( $on_error ); ?>"
       style="display:block;width:100%;height:100%;object-fit:contain;padding:4px;"
   >
   ```

2. **People Grid (Member Avatars)**:
   Add explicit sizing parameters representing standard medium resolutions (e.g., `width="200" height="200"`) while keeping the flexible container styles responsive to avoid CLS:
   ```php
   <img 
       src="<?php echo esc_url( $photo_url ); ?>" 
       alt="<?php echo esc_attr( $name ); ?>" 
       loading="lazy" 
       decoding="async" 
       width="200" 
       height="200" 
       style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
   >
   ```

3. **Testimonials Grid**:
   Introduce fixed dimension tags matching the visual layout constraints (e.g., `width="40" height="40"`) alongside lazy loading and async decoding properties:
   ```php
   <img 
       src="<?php echo esc_url( $photo_url ); ?>" 
       alt="<?php echo esc_attr( $author ); ?>" 
       loading="lazy" 
       decoding="async" 
       width="40" 
       height="40" 
       style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;"
   >
   ```
