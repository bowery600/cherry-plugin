=== Cherrystone ===
Contributors: cherrystoneangelgroup
Requires at least: 6.5
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GNU General Public License v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A full-site-editing block theme that hosts the Cherrystone Blocks plugin.

== Description ==

Cherrystone is the host shell for the Cherrystone Blocks plugin (cherrystone/* blocks).
It provides:

* A sticky, translucent brand navbar (Site Logo + Navigation + "Apply for capital" CTA).
* A matching compact footer with brand columns.
* Full-width page and front-page templates so the Cherrystone section/page blocks
  render edge-to-edge.
* A theme.json design system matching the Cherrystone palette (navy + coral) and
  type (Inter Tight / JetBrains Mono), so the editor canvas matches the front end.

This theme is intentionally minimal — section styling lives in the Cherrystone Blocks
plugin. Install and activate that plugin to access the full layout library.

== Installation ==

1. In WordPress admin go to Appearance > Themes > Add New > Upload Theme.
2. Upload cherrystone-theme.zip and click Install Now, then Activate.
3. Install and activate the "Cherrystone Blocks" plugin (Plugins > Add New > Upload).
4. Appearance > Editor:
   - Upload your logo under the Site Logo in the header (use assets/img/logo-full.png).
   - Build your Primary and Footer navigation menus.
5. Create a Page, insert the "Home Page Template" block (or individual Cherrystone
   blocks), then set Settings > Reading > "Your homepage displays" to that page.

== Recommended page setup ==

* Home: insert "Home Page Template" (cherrystone/page-home), set as the static front page.
* Member Portal: insert "Member Portal Page" (cherrystone/page-member-portal).
* Portfolio / About / News / Apply: compose from individual Cherrystone blocks.

For block pages, use the "Blank Full-Width Canvas" template (Page > Template) to remove
the constrained content width.

== Changelog ==

= 1.0.0 =
* Initial release.
