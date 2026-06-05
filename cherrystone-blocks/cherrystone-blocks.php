<?php
/**
 * Plugin Name:       Cherrystone Blocks
 * Description:       A tidy Cherrystone block toolbox for landing pages, investor workflows, founder FAQs, and other polished little bits of venture-site magic.
 * Version:           6.7
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            Cherrystone Angel Group
 * Text Domain:       cherrystone-blocks
 *
 * @package CherrystoneBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CHERRYSTONE_BLOCKS_PATH', plugin_dir_path( __FILE__ ) );
define( 'CHERRYSTONE_BLOCKS_URL', plugin_dir_url( __FILE__ ) );
define( 'CHERRYSTONE_BLOCKS_VERSION', '6.8' );
define( 'CHERRYSTONE_MEMBER_PORTAL_COOKIE', 'cherry_member_auth' );
define( 'CHERRYSTONE_MEMBER_PORTAL_PASSWORD', 'cherrystone2004' );

require_once CHERRYSTONE_BLOCKS_PATH . 'includes/seed-data.php';

/**
 * Return the expected member portal password.
 *
 * @return string
 */
function cherrystone_blocks_member_portal_password() {
	return (string) apply_filters( 'cherrystone_blocks_member_portal_password', CHERRYSTONE_MEMBER_PORTAL_PASSWORD );
}

/**
 * Return the signed cookie value used for member portal access.
 *
 * @return string
 */
function cherrystone_blocks_member_portal_cookie_value() {
	return wp_hash( 'cherrystone-member-portal-access' );
}

/**
 * Check whether the visitor has unlocked the member portal.
 *
 * @return bool
 */
function cherrystone_blocks_member_portal_is_authenticated() {
	if ( is_user_logged_in() && current_user_can( 'read' ) ) {
		return true;
	}

	if ( empty( $_COOKIE[ CHERRYSTONE_MEMBER_PORTAL_COOKIE ] ) ) {
		return false;
	}

	return hash_equals(
		cherrystone_blocks_member_portal_cookie_value(),
		(string) wp_unslash( $_COOKIE[ CHERRYSTONE_MEMBER_PORTAL_COOKIE ] )
	);
}

/**
 * Handle member portal password submissions before page output begins.
 */
function cherrystone_blocks_handle_member_portal_login() {
	if ( isset( $_GET['cs_member_logout'] ) && '1' === sanitize_key( wp_unslash( $_GET['cs_member_logout'] ) ) ) {
		if ( ! defined( 'DONOTCACHEPAGE' ) ) {
			define( 'DONOTCACHEPAGE', true );
		}
		do_action( 'litespeed_control_set_nocache', 'cherrystone_member_portal' );
		setcookie( CHERRYSTONE_MEMBER_PORTAL_COOKIE, '', time() - HOUR_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true );
		wp_safe_redirect( remove_query_arg( array( 'cs_member_logout', 'cs_member_login' ) ) );
		exit;
	}

	if ( empty( $_POST['cherrystone_member_portal_login'] ) ) {
		return;
	}

	if ( ! defined( 'DONOTCACHEPAGE' ) ) {
		define( 'DONOTCACHEPAGE', true );
	}
	do_action( 'litespeed_control_set_nocache', 'cherrystone_member_portal' );

	$current_path = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '/member-login/';
	$redirect     = wp_get_referer() ? wp_get_referer() : home_url( $current_path );
	$redirect = remove_query_arg( array( 'cs_member_login', 'cs_member_logout' ), $redirect );

	if (
		empty( $_POST['cherrystone_member_portal_nonce'] ) ||
		! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['cherrystone_member_portal_nonce'] ) ), 'cherrystone_member_portal_login' )
	) {
		wp_safe_redirect( add_query_arg( 'cs_member_login', 'failed', $redirect ) );
		exit;
	}

	$password = isset( $_POST['cherrystone_member_portal_password'] )
		? trim( (string) wp_unslash( $_POST['cherrystone_member_portal_password'] ) )
		: '';

	if ( hash_equals( strtolower( cherrystone_blocks_member_portal_password() ), strtolower( $password ) ) ) {
		setcookie(
			CHERRYSTONE_MEMBER_PORTAL_COOKIE,
			cherrystone_blocks_member_portal_cookie_value(),
			time() + DAY_IN_SECONDS,
			COOKIEPATH,
			COOKIE_DOMAIN,
			is_ssl(),
			true
		);
		wp_safe_redirect( $redirect );
		exit;
	}

	wp_safe_redirect( add_query_arg( 'cs_member_login', 'failed', $redirect ) );
	exit;
}
add_action( 'init', 'cherrystone_blocks_handle_member_portal_login', 1 );

/**
 * Keep shared-password portal pages out of public page caches.
 */
function cherrystone_blocks_member_portal_no_cache() {
	if ( ! is_page( array( 'member-login', 'member-portal', 'member-directory' ) ) ) {
		return;
	}

	if ( ! defined( 'DONOTCACHEPAGE' ) ) {
		define( 'DONOTCACHEPAGE', true );
	}

	do_action( 'litespeed_control_set_nocache', 'cherrystone_member_portal' );
	nocache_headers();
}
add_action( 'template_redirect', 'cherrystone_blocks_member_portal_no_cache', 0 );

/**
 * Build the slug used to locate a bundled company logo, mirroring the
 * getLogoSlug() helper in the block editor scripts so PHP-rendered grids and
 * editor previews resolve the same asset.
 *
 * @param string $name Company or partner name.
 * @return string
 */
function cherrystone_blocks_logo_slug( $name ) {
	$dict = array(
		'DiSanto Priest & Co'                                  => 'disanto-priest-co',
		'Adler Pollock & Sheehan P.C.'                         => 'adler-pollock-sheehan-p-c',
		'BROWN UNIVERSITY NELSON CENTER FOR ENTREPRENEURSHIP'  => 'brown-university-nelson-center-for-entrepreneurship',
		'RHODE ISLAND BIO (RIBIO)'                             => 'rhode-island-bio-ribio',
		'RHODE ISLAND-ISRAEL COLLABORATIVE (RIIC)'             => 'rhode-island-israel-collaborative-riic',
		'SMöLTAP'                                              => 'smoltap',
		'SMÖLTAP'                                              => 'smoltap',
	);

	if ( isset( $dict[ $name ] ) ) {
		return $dict[ $name ];
	}

	$slug = strtolower( $name );
	$slug = remove_accents( $slug );
	$slug = preg_replace( '/[^a-z0-9]+/', '-', $slug );

	return trim( $slug, '-' );
}

/**
 * Add a dedicated inserter category for the Cherrystone layout library.
 *
 * @param array $categories Existing block categories.
 * @return array
 */
function cherrystone_blocks_categories( $categories ) {
	return array_merge(
		array(
			array(
				'slug'  => 'cherrystone-core',
				'title' => __( 'Cherrystone — Brand & Layout', 'cherrystone-blocks' ),
				'icon'  => 'admin-home',
			),
			array(
				'slug'  => 'cherrystone-founders',
				'title' => __( 'Cherrystone — Founder Tools', 'cherrystone-blocks' ),
				'icon'  => 'welcome-learn-more',
			),
			array(
				'slug'  => 'cherrystone-investors',
				'title' => __( 'Cherrystone — Investor Tools', 'cherrystone-blocks' ),
				'icon'  => 'chart-line',
			),
			array(
				'slug'  => 'cherrystone-content',
				'title' => __( 'Cherrystone — Editorial & News', 'cherrystone-blocks' ),
				'icon'  => 'megaphone',
			),
			array(
				'slug'  => 'cherrystone-pages',
				'title' => __( 'Cherrystone — Full Page Templates', 'cherrystone-blocks' ),
				'icon'  => 'welcome-widgets-menus',
			),
		),
		$categories
	);
}
add_filter( 'block_categories_all', 'cherrystone_blocks_categories' );


/**
 * Register scripts, styles, and every block.json in src/blocks.
 */
function cherrystone_blocks_register_blocks() {
	$asset_file = CHERRYSTONE_BLOCKS_PATH . 'build/index.asset.php';
	$asset      = file_exists( $asset_file )
		? include $asset_file
		: array(
			'dependencies' => array(),
			'version'      => filemtime( CHERRYSTONE_BLOCKS_PATH . 'src/index.js' ),
		);

	if ( file_exists( CHERRYSTONE_BLOCKS_PATH . 'build/index.js' ) ) {
		wp_register_script(
			'cherrystone-blocks-editor',
			CHERRYSTONE_BLOCKS_URL . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Expose the plugin's bundled-assets URL so logo previews resolve in
		// the editor canvas. Saved markup still uses the portable "/assets/"
		// path, which is rewritten to this URL on render (see render_block).
		wp_add_inline_script(
			'cherrystone-blocks-editor',
			'window.cherrystoneBlocks = window.cherrystoneBlocks || {}; window.cherrystoneBlocks.assetsUrl = ' . wp_json_encode( CHERRYSTONE_BLOCKS_URL . 'assets/' ) . ';',
			'before'
		);
	}

	$style_candidates = array(
		'build/style-index.css',
		'build/index.css',
		'src/style.css',
	);
	$editor_candidates = array(
		'build/index.css',
		'build/style-index.css',
		'src/editor.css',
	);

	foreach ( $style_candidates as $candidate ) {
		if ( file_exists( CHERRYSTONE_BLOCKS_PATH . $candidate ) ) {
			wp_register_style(
				'cherrystone-blocks-style',
				CHERRYSTONE_BLOCKS_URL . $candidate,
				array(),
				filemtime( CHERRYSTONE_BLOCKS_PATH . $candidate )
			);
			break;
		}
	}

	foreach ( $editor_candidates as $candidate ) {
		if ( file_exists( CHERRYSTONE_BLOCKS_PATH . $candidate ) ) {
			wp_register_style(
				'cherrystone-blocks-editor',
				CHERRYSTONE_BLOCKS_URL . $candidate,
				array( 'wp-edit-blocks', 'cherrystone-blocks-style' ),
				filemtime( CHERRYSTONE_BLOCKS_PATH . $candidate )
			);
			break;
		}
	}

	$blocks_dir       = is_dir( CHERRYSTONE_BLOCKS_PATH . 'build/blocks' ) ? 'build/blocks' : 'src/blocks';
	$block_json_files = glob( CHERRYSTONE_BLOCKS_PATH . $blocks_dir . '/*/block.json' );

	foreach ( $block_json_files as $block_json_file ) {
		$args = array(
			'style'        => 'cherrystone-blocks-style',
			'editor_style' => 'cherrystone-blocks-editor',
		);

		if ( wp_script_is( 'cherrystone-blocks-editor', 'registered' ) ) {
			$args['editor_script'] = 'cherrystone-blocks-editor';
		}

		register_block_type( dirname( $block_json_file ), $args );
	}
}
add_action( 'init', 'cherrystone_blocks_register_blocks' );

/**
 * Resolve bundled asset paths inside Cherrystone blocks.
 *
 * The blocks store logo images as site-root-relative paths
 * ( "/assets/logos/x.png" ), which suited the original static site. Inside a
 * WordPress plugin those files live under the plugin directory, so rewrite the
 * path to the plugin URL whenever a Cherrystone block renders. This keeps the
 * saved post content portable (no hard-coded domain) while ensuring the bundled
 * assets resolve on any install.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Parsed block data.
 * @return string
 */
function cherrystone_blocks_resolve_asset_urls( $block_content, $block ) {
	if ( empty( $block['blockName'] ) || 0 !== strpos( $block['blockName'], 'cherrystone/' ) ) {
		return $block_content;
	}

	if ( false === strpos( $block_content, '/assets/' ) ) {
		return $block_content;
	}

	$assets_url = CHERRYSTONE_BLOCKS_URL . 'assets/';

	return str_replace(
		array( '"/assets/', "'/assets/" ),
		array( '"' . $assets_url, "'" . $assets_url ),
		$block_content
	);
}
add_filter( 'render_block', 'cherrystone_blocks_resolve_asset_urls', 10, 2 );

/**
 * Inject dynamic brand settings into form blocks on render.
 *
 * Checks if a block is a founder application form or member interest form,
 * and if so, overrides the default recipient address with the admin setting if configured.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Parsed block data.
 * @return string
 */
function cherrystone_blocks_inject_form_recipients( $block_content, $block ) {
	if ( empty( $block['blockName'] ) ) {
		return $block_content;
	}

	$brand_settings = cherrystone_blocks_get_brand_settings();

	if ( 'cherrystone/founder-application-form' === $block['blockName'] ) {
		$default_email = ! empty( $brand_settings['founder_application_email'] ) ? $brand_settings['founder_application_email'] : '';
		if ( $default_email ) {
			$recipient = isset( $block['attrs']['recipient'] ) ? $block['attrs']['recipient'] : 'info@cherrystoneangelgroup.com';
			if ( 'info@cherrystoneangelgroup.com' === $recipient || empty( $recipient ) ) {
				$block_content = str_replace(
					array( 'data-recipient="info@cherrystoneangelgroup.com"', 'data-recipient=""' ),
					'data-recipient="' . esc_attr( $default_email ) . '"',
					$block_content
				);
			}
		}
	}

	if ( 'cherrystone/member-interest-form' === $block['blockName'] ) {
		$default_email = ! empty( $brand_settings['member_interest_email'] ) ? $brand_settings['member_interest_email'] : '';
		if ( $default_email ) {
			$recipient = isset( $block['attrs']['recipient'] ) ? $block['attrs']['recipient'] : 'info@cherrystoneangelgroup.com';
			if ( 'info@cherrystoneangelgroup.com' === $recipient || empty( $recipient ) ) {
				$block_content = str_replace(
					array( 'data-recipient="info@cherrystoneangelgroup.com"', 'data-recipient=""' ),
					'data-recipient="' . esc_attr( $default_email ) . '"',
					$block_content
				);
			}
		}
	}

	return $block_content;
}
add_filter( 'render_block', 'cherrystone_blocks_inject_form_recipients', 10, 2 );

/**
 * Render the founder application block through WPForms when configured.
 *
 * This lets the apply page keep the Cherrystone page design while using the
 * site's installed WPForms workflow for storage, notifications, and spam
 * handling. If WPForms is unavailable or no form ID is configured, the saved
 * Cherrystone fallback form renders unchanged.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Parsed block data.
 * @return string
 */
function cherrystone_blocks_render_founder_wpforms( $block_content, $block ) {
	if ( empty( $block['blockName'] ) || 'cherrystone/founder-application-form' !== $block['blockName'] ) {
		return $block_content;
	}

	if ( ! shortcode_exists( 'wpforms' ) ) {
		return $block_content;
	}

	$brand_settings = cherrystone_blocks_get_brand_settings();
	$form_id        = isset( $block['attrs']['wpformsId'] ) ? absint( $block['attrs']['wpformsId'] ) : 0;

	if ( ! $form_id && ! empty( $brand_settings['founder_wpforms_id'] ) ) {
		$form_id = absint( $brand_settings['founder_wpforms_id'] );
	}

	if ( ! $form_id ) {
		return $block_content;
	}

	$heading = isset( $block['attrs']['heading'] ) ? $block['attrs']['heading'] : __( "Tell us what you're building.", 'cherrystone-blocks' );

	ob_start();
	?>
	<section class="wp-block-cherrystone-founder-application-form block cherrystone-form-block cherrystone-wpforms-block">
		<div class="container">
			<div class="block-head">
				<div>
					<h2><?php echo wp_kses_post( $heading ); ?></h2>
				</div>
			</div>
			<div class="cherrystone-wpforms-embed">
				<?php echo do_shortcode( '[wpforms id="' . absint( $form_id ) . '" title="false" description="false"]' ); ?>
			</div>
		</div>
	</section>
	<?php
	return ob_get_clean();
}
add_filter( 'render_block', 'cherrystone_blocks_render_founder_wpforms', 9, 2 );

/**
 * Load brand fonts wherever blocks render, including the editor canvas.
 */
function cherrystone_blocks_enqueue_fonts() {
	wp_enqueue_style(
		'cherrystone-blocks-fonts',
		'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
		array(),
		null
	);
}
add_action( 'enqueue_block_assets', 'cherrystone_blocks_enqueue_fonts' );

/**
 * Load lightweight front-end interactions for static Cherrystone blocks.
 */
function cherrystone_blocks_enqueue_frontend_interactions() {
	$utils_path  = CHERRYSTONE_BLOCKS_PATH . 'assets/js/form-utils.js';
	$script_path = CHERRYSTONE_BLOCKS_PATH . 'assets/js/frontend.js';

	// ── GSAP + ScrollTrigger (desktop scroll-video hero) ──────────────────
	// Loaded from jsDelivr CDN, deferred to footer. frontend.js depends on
	// these being present as window.gsap / window.ScrollTrigger globals.
	wp_register_script(
		'gsap',
		'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',
		array(),
		'3.12.5',
		true
	);
	wp_register_script(
		'gsap-scroll-trigger',
		'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',
		array( 'gsap' ),
		'3.12.5',
		true
	);
	wp_enqueue_script( 'gsap' );
	wp_enqueue_script( 'gsap-scroll-trigger' );
	// ──────────────────────────────────────────────────────────────────────

	if ( file_exists( $utils_path ) ) {
		wp_enqueue_script(
			'cherrystone-blocks-form-utils',
			CHERRYSTONE_BLOCKS_URL . 'assets/js/form-utils.js',
			array(),
			filemtime( $utils_path ),
			true
		);
	}

	if ( ! file_exists( $script_path ) ) {
		return;
	}

	wp_enqueue_script(
		'cherrystone-blocks-frontend',
		CHERRYSTONE_BLOCKS_URL . 'assets/js/frontend.js',
		array( 'cherrystone-blocks-form-utils', 'gsap', 'gsap-scroll-trigger' ),
		filemtime( $script_path ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'cherrystone_blocks_enqueue_frontend_interactions' );

/**
 * Enqueue Unified WebGL Canvas script in both frontend and block editor.
 */
function cherrystone_blocks_enqueue_unified_canvas() {
	$canvas_script_path = CHERRYSTONE_BLOCKS_PATH . 'build/unified-canvas.js';
	$canvas_asset_path  = CHERRYSTONE_BLOCKS_PATH . 'build/unified-canvas.asset.php';

	// The cinematic homepage backdrop is now the scroll-scrubbed hero video
	// (see assets/js/frontend.js). The legacy WebGL canvas is only needed in
	// the block editor preview, not on the public front end.
	if ( ! is_admin() ) {
		return;
	}

	if ( file_exists( $canvas_script_path ) ) {
		$canvas_asset = file_exists( $canvas_asset_path )
			? include $canvas_asset_path
			: array( 'dependencies' => array( 'wp-element' ), 'version' => filemtime( $canvas_script_path ) );

		wp_enqueue_script(
			'cherrystone-unified-canvas',
			CHERRYSTONE_BLOCKS_URL . 'build/unified-canvas.js',
			$canvas_asset['dependencies'],
			$canvas_asset['version'],
			true
		);
	}
}
add_action( 'enqueue_block_assets', 'cherrystone_blocks_enqueue_unified_canvas' );



/**
 * Register operational content types for Cherrystone editors.
 */
/**
 * Register operational content types for Cherrystone editors.
 */
function cherrystone_blocks_register_content_types() {
	register_post_type(
		'cherry_portfolio',
		array(
			'labels'       => array(
				'name'          => __( 'Portfolio Companies', 'cherrystone-blocks' ),
				'singular_name' => __( 'Portfolio Company', 'cherrystone-blocks' ),
				'add_new_item'  => __( 'Add Portfolio Company', 'cherrystone-blocks' ),
				'edit_item'     => __( 'Edit Portfolio Company', 'cherrystone-blocks' ),
			),
			'description'  => __( 'Companies backed by Cherrystone with sector, stage, location, logo, and exit details.', 'cherrystone-blocks' ),
			'menu_icon'    => 'dashicons-portfolio',
			'public'       => true,
			'has_archive'  => true,
			'rewrite'      => array( 'slug' => 'portfolio-company' ),
			'show_in_rest' => true,
			'supports'     => array( 'title', 'thumbnail' ),
		)
	);

	register_post_type(
		'cherry_pitch_event',
		array(
			'labels'       => array(
				'name'          => __( 'Pitch Nights', 'cherrystone-blocks' ),
				'singular_name' => __( 'Pitch Night', 'cherrystone-blocks' ),
				'add_new_item'  => __( 'Add Pitch Night', 'cherrystone-blocks' ),
				'edit_item'     => __( 'Edit Pitch Night', 'cherrystone-blocks' ),
			),
			'description'  => __( 'Pitch Night events with deadlines, agenda details, and registration links.', 'cherrystone-blocks' ),
			'menu_icon'    => 'dashicons-calendar-alt',
			'public'       => true,
			'has_archive'  => false,
			'rewrite'      => array( 'slug' => 'pitch-night' ),
			'show_in_rest' => true,
			'supports'     => array( 'title' ),
		)
	);

	register_post_type(
		'cherry_resource',
		array(
			'labels'       => array(
				'name'          => __( 'Member Resources', 'cherrystone-blocks' ),
				'singular_name' => __( 'Member Resource', 'cherrystone-blocks' ),
				'add_new_item'  => __( 'Add Member Resource', 'cherrystone-blocks' ),
				'edit_item'     => __( 'Edit Member Resource', 'cherrystone-blocks' ),
			),
			'description'  => __( 'Diligence documents, templates, meeting notes, and member-facing resources.', 'cherrystone-blocks' ),
			'menu_icon'    => 'dashicons-lock',
			'public'       => true,
			'has_archive'  => true,
			'rewrite'      => array( 'slug' => 'member-resource' ),
			'show_in_rest' => true,
			'supports'     => array( 'title' ),
		)
	);

	register_post_type(
		'cherry_communication',
		array(
			'labels'       => array(
				'name'          => __( 'Communications', 'cherrystone-blocks' ),
				'singular_name' => __( 'Communication', 'cherrystone-blocks' ),
				'add_new_item'  => __( 'Add Communication', 'cherrystone-blocks' ),
				'edit_item'     => __( 'Edit Communication', 'cherrystone-blocks' ),
			),
			'description'  => __( 'News posts, leadership letters, portfolio updates, and Pitch Night announcements.', 'cherrystone-blocks' ),
			'menu_icon'    => 'dashicons-media-document',
			'public'       => true,
			// Archive disabled so the designed Communications page (cherrystone/page-communications)
			// owns /communications/. Single posts keep the slug at /communications/<post>/, and the
			// page's News section lists these posts via the news-list block.
			'has_archive'  => false,
			'rewrite'      => array( 'slug' => 'communications' ),
			'show_in_rest' => true,
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
		)
	);

	register_post_type(
		'cherry_leader',
		array(
			'labels'       => array(
				'name'          => __( 'Leadership Members', 'cherrystone-blocks' ),
				'singular_name' => __( 'Leadership Member', 'cherrystone-blocks' ),
				'add_new_item'  => __( 'Add Leadership Member', 'cherrystone-blocks' ),
				'edit_item'     => __( 'Edit Leadership Member', 'cherrystone-blocks' ),
			),
			'description'  => __( 'Cherrystone leadership members, directors, and investment leads.', 'cherrystone-blocks' ),
			'menu_icon'    => 'dashicons-businessman',
			'public'       => true,
			'has_archive'  => true,
			'rewrite'      => array( 'slug' => 'leadership-member' ),
			'show_in_rest' => true,
			'supports'     => array( 'title', 'thumbnail' ),
		)
	);

	register_post_type(
		'cherry_member',
		array(
			'labels'       => array(
				'name'          => __( 'Regular Members', 'cherrystone-blocks' ),
				'singular_name' => __( 'Regular Member', 'cherrystone-blocks' ),
				'add_new_item'  => __( 'Add Regular Member', 'cherrystone-blocks' ),
				'edit_item'     => __( 'Edit Regular Member', 'cherrystone-blocks' ),
			),
			'description'  => __( 'Cherrystone regular members, angels, and advisors.', 'cherrystone-blocks' ),
			'menu_icon'    => 'dashicons-businessman',
			'public'       => true,
			'has_archive'  => true,
			'rewrite'      => array( 'slug' => 'regular-member' ),
			'show_in_rest' => true,
			'supports'     => array( 'title', 'thumbnail' ),
		)
	);

	register_post_type(
		'cherry_sponsor',
		array(
			'labels'       => array(
				'name'          => __( 'Sponsors & Partners', 'cherrystone-blocks' ),
				'singular_name' => __( 'Sponsor / Partner', 'cherrystone-blocks' ),
				'add_new_item'  => __( 'Add Sponsor/Partner', 'cherrystone-blocks' ),
				'edit_item'     => __( 'Edit Sponsor/Partner', 'cherrystone-blocks' ),
			),
			'description'  => __( 'Venture ecosystem partners and sponsors for logo tickers and credit lists.', 'cherrystone-blocks' ),
			'menu_icon'    => 'dashicons-groups',
			'public'       => true,
			'has_archive'  => true,
			'rewrite'      => array( 'slug' => 'sponsor' ),
			'show_in_rest' => true,
			'supports'     => array( 'title', 'thumbnail' ),
		)
	);

	register_post_type(
		'cherry_testimonial',
		array(
			'labels'       => array(
				'name'          => __( 'Testimonials', 'cherrystone-blocks' ),
				'singular_name' => __( 'Testimonial', 'cherrystone-blocks' ),
				'add_new_item'  => __( 'Add Testimonial', 'cherrystone-blocks' ),
				'edit_item'     => __( 'Edit Testimonial', 'cherrystone-blocks' ),
			),
			'description'  => __( 'Quotes from backed founders and operators.', 'cherrystone-blocks' ),
			'menu_icon'    => 'dashicons-format-quote',
			'public'       => true,
			'has_archive'  => false,
			'show_in_rest' => true,
			'supports'     => array( 'title', 'editor', 'thumbnail' ),
		)
	);
}
add_action( 'init', 'cherrystone_blocks_register_content_types' );

/**
 * Flush permalinks when the plugin activates so new archives resolve.
 */
function cherrystone_blocks_activate() {
	cherrystone_blocks_register_content_types();
	cherrystone_blocks_register_content_meta();
	cherrystone_blocks_seed_content();
	update_option( 'cherrystone_blocks_version', CHERRYSTONE_BLOCKS_VERSION );
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'cherrystone_blocks_activate' );

/**
 * Run upgrade chores once when the stored version trails the plugin version.
 *
 * Re-runs the idempotent seeder (filling any newly added starter content) and
 * flushes rewrite rules so new archives resolve after an in-place update.
 */
function cherrystone_blocks_maybe_upgrade() {
	$stored = get_option( 'cherrystone_blocks_version' );

	if ( CHERRYSTONE_BLOCKS_VERSION === $stored ) {
		return;
	}

	cherrystone_blocks_seed_content();
	flush_rewrite_rules();
	update_option( 'cherrystone_blocks_version', CHERRYSTONE_BLOCKS_VERSION );
}
add_action( 'admin_init', 'cherrystone_blocks_maybe_upgrade' );

/**
 * One-time migration: move seeded leadership posts from cherry_member → cherry_leader.
 *
 * Seed data incorrectly created leadership members as cherry_member posts. This migration
 * changes their post_type and renames the cs_member_* meta keys to cs_leader_*.
 */
function cherrystone_blocks_migrate_leadership_post_type() {
	if ( get_option( 'cherrystone_leadership_migration_v1' ) ) {
		return;
	}

	global $wpdb;

	$seeded_members = get_posts(
		array(
			'post_type'      => 'cherry_member',
			'post_status'    => 'any',
			'posts_per_page' => -1,
			'meta_key'       => '_cs_seeded',
			'meta_value'     => '1',
			'fields'         => 'ids',
		)
	);

	foreach ( $seeded_members as $post_id ) {
		// Change post_type to cherry_leader.
		$wpdb->update(
			$wpdb->posts,
			array( 'post_type' => 'cherry_leader' ),
			array( 'ID' => $post_id ),
			array( '%s' ),
			array( '%d' )
		);

		// Migrate meta keys from cs_member_* to cs_leader_*.
		$meta_map = array(
			'cs_member_role'         => 'cs_leader_role',
			'cs_member_linkedin_url' => 'cs_leader_linkedin_url',
			'cs_member_photo_url'    => 'cs_leader_photo_url',
			'cs_member_description'  => 'cs_leader_description',
		);

		foreach ( $meta_map as $old_key => $new_key ) {
			$value = get_post_meta( $post_id, $old_key, true );
			if ( '' !== $value ) {
				update_post_meta( $post_id, $new_key, $value );
				delete_post_meta( $post_id, $old_key );
			}
		}

		clean_post_cache( $post_id );
	}

	update_option( 'cherrystone_leadership_migration_v1', '1' );
}
add_action( 'admin_init', 'cherrystone_blocks_migrate_leadership_post_type', 5 );

/**
 * Flush permalinks when the plugin deactivates.
 */
function cherrystone_blocks_deactivate() {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'cherrystone_blocks_deactivate' );

/**
 * Register post meta used by the operational content types.
 */
function cherrystone_blocks_register_content_meta() {
	$meta_fields = array(
		'cherry_portfolio'   => array(
			'cs_logo_url',
			'cs_sector',
			'cs_stage',
			'cs_location',
			'cs_status',
			'cs_exit_details',
			'cs_company_url',
			'cs_initials',
			'cs_company_description',
		),
		'cherry_pitch_event' => array(
			'cs_event_date',
			'cs_application_deadline',
			'cs_event_location',
			'cs_registration_url',
			'cs_agenda',
			'cs_event_type',
			'cs_event_spots',
			'cs_event_image_url',
		),
		'cherry_resource'    => array(
			'cs_resource_url',
			'cs_resource_type',
			'cs_member_only',
			'cs_source',
			'cs_resource_file_url',
			'cs_resource_description',
		),
		'cherry_communication' => array(
			'cs_communication_date',
			'cs_communication_author',
			'cs_communication_category',
			'cs_communication_source_url',
			'cs_communication_image_url',
			'cs_communication_body_json',
		),
		'cherry_leader'      => array(
			'cs_leader_role',
			'cs_leader_linkedin_url',
			'cs_leader_photo_url',
			'cs_leader_description',
		),
		'cherry_member'      => array(
			'cs_member_role',
			'cs_member_linkedin_url',
			'cs_member_photo_url',
			'cs_member_description',
		),
		'cherry_sponsor'     => array(
			'cs_sponsor_url',
			'cs_sponsor_description',
			'cs_sponsor_tier',
			'cs_sponsor_logo_url',
			'cs_sponsor_logo_alt',
		),
		'cherry_testimonial' => array(
			'cs_testimonial_quote',
			'cs_testimonial_author',
			'cs_testimonial_role',
			'cs_testimonial_company',
			'cs_testimonial_round',
			'cs_testimonial_photo_url',
		),
	);

	foreach ( $meta_fields as $post_type => $keys ) {
		foreach ( $keys as $key ) {
			register_post_meta(
				$post_type,
				$key,
				array(
					'auth_callback'     => function() {
						return current_user_can( 'edit_posts' );
					},
					'sanitize_callback' => 'cherrystone_blocks_sanitize_meta_value',
					'show_in_rest'      => true,
					'single'            => true,
					'type'              => 'string',
				)
			);
		}
	}
}
add_action( 'init', 'cherrystone_blocks_register_content_meta' );

/**
 * Sanitize meta values consistently.
 *
 * @param string $value Submitted meta value.
 * @param string $key   Meta key.
 * @return string
 */
function cherrystone_blocks_sanitize_meta_value( $value, $key ) {
	if ( in_array( $key, array( 'cs_logo_url', 'cs_company_url', 'cs_registration_url', 'cs_resource_url', 'cs_linkedin_url', 'cs_sponsor_url', 'cs_testimonial_logo_url', 'cs_people_photo_url', 'cs_sponsor_logo_url', 'cs_testimonial_photo_url', 'cs_leader_photo_url', 'cs_leader_linkedin_url', 'cs_member_photo_url', 'cs_member_linkedin_url' ), true ) ) {
		return esc_url_raw( $value );
	}

	if ( in_array( $key, array( 'cs_agenda', 'cs_company_description', 'cs_people_description', 'cs_resource_description', 'cs_testimonial_quote', 'cs_leader_description', 'cs_member_description' ), true ) ) {
		return sanitize_textarea_field( $value );
	}

	if ( in_array( $key, array( 'cs_member_only', 'cs_is_chair' ), true ) ) {
		return $value ? '1' : '';
	}

	return sanitize_text_field( $value );
}

/**
 * Add meta boxes for the operational content types.
 */
function cherrystone_blocks_add_meta_boxes() {
	add_meta_box(
		'cherrystone-portfolio-details',
		__( 'Company Details', 'cherrystone-blocks' ),
		'cherrystone_blocks_render_portfolio_meta_box',
		'cherry_portfolio',
		'normal',
		'high'
	);

	add_meta_box(
		'cherrystone-pitch-details',
		__( 'Pitch Night Details', 'cherrystone-blocks' ),
		'cherrystone_blocks_render_pitch_meta_box',
		'cherry_pitch_event',
		'normal',
		'high'
	);

	add_meta_box(
		'cherrystone-resource-details',
		__( 'Resource Access', 'cherrystone-blocks' ),
		'cherrystone_blocks_render_resource_meta_box',
		'cherry_resource',
		'normal',
		'high'
	);

	add_meta_box(
		'cherrystone-communication-details',
		__( 'Communication Details', 'cherrystone-blocks' ),
		'cherrystone_blocks_render_communication_meta_box',
		'cherry_communication',
		'normal',
		'high'
	);

	add_meta_box(
		'cherrystone-leader-details',
		__( 'Leadership Member Details', 'cherrystone-blocks' ),
		'cherrystone_blocks_render_leader_meta_box',
		'cherry_leader',
		'normal',
		'high'
	);

	add_meta_box(
		'cherrystone-member-details',
		__( 'Member Details', 'cherrystone-blocks' ),
		'cherrystone_blocks_render_member_meta_box',
		'cherry_member',
		'normal',
		'high'
	);

	add_meta_box(
		'cherrystone-sponsor-details',
		__( 'Sponsor / Partner Details', 'cherrystone-blocks' ),
		'cherrystone_blocks_render_sponsor_meta_box',
		'cherry_sponsor',
		'normal',
		'high'
	);

	add_meta_box(
		'cherrystone-testimonial-details',
		__( 'Testimonial Details', 'cherrystone-blocks' ),
		'cherrystone_blocks_render_testimonial_meta_box',
		'cherry_testimonial',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'cherrystone_blocks_add_meta_boxes' );

/**
 * Enqueue standard WordPress media scripts for custom post type editing screens.
 */
function cherrystone_blocks_get_current_post_type() {
	if ( function_exists( 'get_current_screen' ) ) {
		$screen = get_current_screen();
		if ( $screen && $screen->post_type ) {
			return $screen->post_type;
		}
	}
	
	global $post_type, $post;
	if ( $post_type ) {
		return $post_type;
	}
	if ( $post && $post->post_type ) {
		return $post->post_type;
	}
	if ( isset( $_GET['post_type'] ) ) {
		return sanitize_key( $_GET['post_type'] );
	}
	if ( isset( $_GET['post'] ) ) {
		return get_post_type( intval( $_GET['post'] ) );
	}
	return '';
}

function cherrystone_blocks_admin_media_scripts( $hook ) {
	$pt = cherrystone_blocks_get_current_post_type();
	if ( in_array( $pt, array( 'cherry_portfolio', 'cherry_leader', 'cherry_member', 'cherry_sponsor', 'cherry_pitch_event', 'cherry_resource', 'cherry_communication', 'cherry_testimonial' ), true ) ) {
		wp_enqueue_media();
	}
}
add_action( 'admin_enqueue_scripts', 'cherrystone_blocks_admin_media_scripts' );

/**
 * Render footer JavaScript to activate the native Media Library uploader logic.
 */
function cherrystone_blocks_admin_media_footer_scripts() {
	$pt = cherrystone_blocks_get_current_post_type();
	if ( in_array( $pt, array( 'cherry_portfolio', 'cherry_leader', 'cherry_member', 'cherry_sponsor', 'cherry_pitch_event', 'cherry_resource', 'cherry_communication', 'cherry_testimonial' ), true ) ) {
		?>
		<script>
		jQuery(document).ready(function($){
			// Helper function to update preview dynamically
			function updatePreview(url, wrapper) {
				var img = wrapper.find('.cs-media-preview');
				var docLabel = wrapper.find('.cs-doc-label');
				if (!docLabel.length) {
					wrapper.find('.cs-media-preview-container').append('<span class="cs-doc-label" style="display:none;font-weight:600;padding:8px 12px;background:#f0f0f1;border:1px solid #ccd0d4;border-radius:4px;word-break:break-all;font-family:monospace;font-size:12px;"></span>');
					docLabel = wrapper.find('.cs-doc-label');
				}

				if (url) {
					var ext = url.split('.').pop().split('?')[0].toLowerCase();
					if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].indexOf(ext) !== -1) {
						img.attr('src', url).show();
						docLabel.hide();
					} else {
						img.hide();
						docLabel.text('Attached File: ' + url.split('/').pop()).show();
					}
					wrapper.find('.cs-media-clear-btn').show();
				} else {
					img.hide();
					docLabel.hide();
					wrapper.find('.cs-media-clear-btn').hide();
				}
			}

			// Initialize previews for manual values on load
			$('.cs-media-field-wrapper').each(function() {
				var wrapper = $(this);
				var url = wrapper.find('.cs-media-url').val();
				updatePreview(url, wrapper);
			});

			// Open WP Media Library
			$('body').on('click', '.cs-media-upload-btn', function(e) {
				e.preventDefault();
				var button = $(this);
				var id = button.data('target');
				var wrapper = button.closest('.cs-media-field-wrapper');
				
				var uploader = wp.media({
					title: 'Select or Upload Media File',
					button: { text: 'Use Media File' },
					multiple: false
				}).on('select', function() {
					var attachment = uploader.state().get('selection').first().toJSON();
					var url = attachment.url;
					
					$('#' + id).val(url).trigger('change');
				}).open();
			});

			// Clear selection
			$('body').on('click', '.cs-media-clear-btn', function(e) {
				e.preventDefault();
				var button = $(this);
				var id = button.data('target');
				var wrapper = button.closest('.cs-media-field-wrapper');
				
				$('#' + id).val('').trigger('change');
			});

			// Update preview when input changes
			$('body').on('input change', '.cs-media-url', function() {
				var input = $(this);
				var url = input.val();
				var wrapper = input.closest('.cs-media-field-wrapper');
				updatePreview(url, wrapper);
			});
		});
		</script>
		<?php
	}
}
add_action( 'admin_print_footer_scripts', 'cherrystone_blocks_admin_media_footer_scripts' );

/**
 * Render a reusable text field.
 *
 * @param WP_Post $post  Current post.
 * @param string  $key   Meta key.
 * @param string  $label Field label.
 * @param string  $type  Input type.
 */
function cherrystone_blocks_render_meta_field( $post, $key, $label, $type = 'text' ) {
	$value = get_post_meta( $post->ID, $key, true );
	?>
	<p>
		<label for="<?php echo esc_attr( $key ); ?>"><strong><?php echo esc_html( $label ); ?></strong></label><br>
		<input class="widefat" type="<?php echo esc_attr( $type ); ?>" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $value ); ?>">
	</p>
	<?php
}

/**
 * Render a text field with a media library upload button.
 */
function cherrystone_blocks_render_media_field( $post, $key, $label ) {
	$value = get_post_meta( $post->ID, $key, true );
	$is_image = false;
	$filename = '';
	if ( $value ) {
		$filename = basename( $value );
		$ext = strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) );
		$is_image = in_array( $ext, array( 'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp' ), true );
	}
	?>
	<div class="cs-media-field-wrapper" data-field-id="<?php echo esc_attr( $key ); ?>" style="margin-bottom: 15px;">
		<label for="<?php echo esc_attr( $key ); ?>"><strong><?php echo esc_html( $label ); ?></strong></label><br>
		<div style="display: flex; align-items: center; gap: 8px; margin-top: 5px; margin-bottom: 5px;">
			<input type="text" class="regular-text cs-media-url" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $value ); ?>" style="width: 75%; display: inline-block; vertical-align: middle;">
			<button type="button" class="button cs-media-upload-btn" data-target="<?php echo esc_attr( $key ); ?>" style="display: inline-block; vertical-align: middle;"><?php esc_html_e( 'Select File', 'cherrystone-blocks' ); ?></button>
			<button type="button" class="button cs-media-clear-btn" data-target="<?php echo esc_attr( $key ); ?>" style="display: inline-block; vertical-align: middle; <?php echo $value ? '' : 'display: none;'; ?>"><?php esc_html_e( 'Clear', 'cherrystone-blocks' ); ?></button>
		</div>
		<div class="cs-media-preview-container" style="margin-top: 8px;">
			<img class="cs-media-preview" src="<?php echo esc_url( $value ); ?>" style="max-width: 150px; max-height: 150px; border: 1px solid #ccd0d4; padding: 4px; background: #fff; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); <?php echo ( $value && $is_image ) ? 'display: block;' : 'display: none;'; ?>">
			<span class="cs-doc-label" style="font-weight: 600; padding: 8px 12px; background: #f0f0f1; border: 1px solid #ccd0d4; border-radius: 4px; word-break: break-all; font-family: monospace; font-size: 12px; <?php echo ( $value && ! $is_image ) ? 'display: inline-block;' : 'display: none;'; ?>"><?php echo esc_html( 'Attached File: ' . $filename ); ?></span>
		</div>
	</div>
	<?php
}

/**
 * Render a reusable textarea field.
 *
 * @param WP_Post $post  Current post.
 * @param string  $key   Meta key.
 * @param string  $label Field label.
 */
function cherrystone_blocks_render_meta_textarea( $post, $key, $label ) {
	$value = get_post_meta( $post->ID, $key, true );
	?>
	<p>
		<label for="<?php echo esc_attr( $key ); ?>"><strong><?php echo esc_html( $label ); ?></strong></label><br>
		<textarea class="widefat" rows="5" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key ); ?>"><?php echo esc_textarea( $value ); ?></textarea>
	</p>
	<?php
}

/**
 * Render portfolio company details.
 *
 * @param WP_Post $post Current post.
 */
function cherrystone_blocks_render_portfolio_meta_box( $post ) {
	wp_nonce_field( 'cherrystone_blocks_save_meta', 'cherrystone_blocks_meta_nonce' );
	cherrystone_blocks_render_media_field( $post, 'cs_logo_url', __( 'Logo URL (Optional fallback; prefer Featured Image)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_textarea( $post, 'cs_company_description', __( 'Description', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_sector', __( 'Sector', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_stage', __( 'Stage', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_location', __( 'Location', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_status', __( 'Status', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_exit_details', __( 'Exit Details', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_company_url', __( 'Company URL', 'cherrystone-blocks' ), 'url' );
	cherrystone_blocks_render_meta_field( $post, 'cs_initials', __( 'Initials (logo text fallback)', 'cherrystone-blocks' ) );
}

/**
 * Render Pitch Night details.
 *
 * @param WP_Post $post Current post.
 */
function cherrystone_blocks_render_pitch_meta_box( $post ) {
	wp_nonce_field( 'cherrystone_blocks_save_meta', 'cherrystone_blocks_meta_nonce' );
	cherrystone_blocks_render_media_field( $post, 'cs_event_image_url', __( 'Event Image / Flyer URL (Optional fallback; prefer Featured Image)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_event_date', __( 'Event Date', 'cherrystone-blocks' ), 'date' );
	cherrystone_blocks_render_meta_field( $post, 'cs_application_deadline', __( 'Application Deadline', 'cherrystone-blocks' ), 'date' );
	cherrystone_blocks_render_meta_field( $post, 'cs_event_location', __( 'Location', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_event_type', __( 'Event Type (e.g. In-person)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_event_spots', __( 'Spots / Capacity note', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_registration_url', __( 'Registration URL', 'cherrystone-blocks' ), 'url' );
	cherrystone_blocks_render_meta_textarea( $post, 'cs_agenda', __( 'Agenda Items (one per line)', 'cherrystone-blocks' ) );
}

/**
 * Render member resource details.
 *
 * @param WP_Post $post Current post.
 */
function cherrystone_blocks_render_resource_meta_box( $post ) {
	$member_only = get_post_meta( $post->ID, 'cs_member_only', true );

	wp_nonce_field( 'cherrystone_blocks_save_meta', 'cherrystone_blocks_meta_nonce' );
	cherrystone_blocks_render_media_field( $post, 'cs_resource_file_url', __( 'Resource File / Document URL (Select PDF, document, or image)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_textarea( $post, 'cs_resource_description', __( 'Description', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_resource_url', __( 'Resource URL', 'cherrystone-blocks' ), 'url' );
	cherrystone_blocks_render_meta_field( $post, 'cs_resource_type', __( 'Resource Type / Audience (e.g. Investors)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_source', __( 'Source / Publisher', 'cherrystone-blocks' ) );
	?>
	<p>
		<label>
			<input type="checkbox" name="cs_member_only" value="1" <?php checked( $member_only, '1' ); ?>>
			<?php esc_html_e( 'Require a logged-in member/editor account to view this resource.', 'cherrystone-blocks' ); ?>
		</label>
	</p>
	<?php
}

/**
 * Render communication details.
 *
 * @param WP_Post $post Current post.
 */
function cherrystone_blocks_render_communication_meta_box( $post ) {
	wp_nonce_field( 'cherrystone_blocks_save_meta', 'cherrystone_blocks_meta_nonce' );
	cherrystone_blocks_render_media_field( $post, 'cs_communication_image_url', __( 'Header Image URL (Optional fallback; prefer Featured Image)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_communication_date', __( 'Display Date', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_communication_author', __( 'Author / Byline', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_communication_category', __( 'Category', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_communication_source_url', __( 'Original Source URL', 'cherrystone-blocks' ), 'url' );
	cherrystone_blocks_render_meta_textarea( $post, 'cs_communication_body_json', __( 'Imported Body JSON (optional)', 'cherrystone-blocks' ) );
}

/**
 * Render team member details.
 *
 * @param WP_Post $post Current post.
 */
function cherrystone_blocks_render_leader_meta_box( $post ) {
	wp_nonce_field( 'cherrystone_blocks_save_meta', 'cherrystone_blocks_meta_nonce' );
	cherrystone_blocks_render_media_field( $post, 'cs_leader_photo_url', __( 'Headshot / Photo URL (Optional fallback; prefer Featured Image)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_textarea( $post, 'cs_leader_description', __( 'Description / Bio', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_leader_role', __( 'Role/Title (e.g. Director)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_leader_linkedin_url', __( 'LinkedIn URL', 'cherrystone-blocks' ), 'url' );
}

function cherrystone_blocks_render_member_meta_box( $post ) {
	wp_nonce_field( 'cherrystone_blocks_save_meta', 'cherrystone_blocks_meta_nonce' );
	cherrystone_blocks_render_media_field( $post, 'cs_member_photo_url', __( 'Headshot / Photo URL (Optional fallback; prefer Featured Image)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_textarea( $post, 'cs_member_description', __( 'Description / Bio', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_member_role', __( 'Role/Title (e.g. Angel Investor)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_member_linkedin_url', __( 'LinkedIn URL', 'cherrystone-blocks' ), 'url' );
}

/**
 * Render sponsor and partner details.
 *
 * @param WP_Post $post Current post.
 */
function cherrystone_blocks_render_sponsor_meta_box( $post ) {
	$tier = get_post_meta( $post->ID, 'cs_sponsor_tier', true );

	wp_nonce_field( 'cherrystone_blocks_save_meta', 'cherrystone_blocks_meta_nonce' );
	cherrystone_blocks_render_media_field( $post, 'cs_sponsor_logo_url', __( 'Logo URL (Optional fallback; prefer Featured Image)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_sponsor_logo_alt', __( 'Logo Description (Alt Text)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_sponsor_url', __( 'Sponsor Website URL', 'cherrystone-blocks' ), 'url' );
	cherrystone_blocks_render_meta_textarea( $post, 'cs_sponsor_description', __( 'Sponsor Description', 'cherrystone-blocks' ) );
	?>
	<p>
		<label for="cs_sponsor_tier"><strong><?php esc_html_e( 'Sponsor Tier / Grouping', 'cherrystone-blocks' ); ?></strong></label><br>
		<select class="widefat" id="cs_sponsor_tier" name="cs_sponsor_tier">
			<option value="Sponsors" <?php selected( $tier, 'Sponsors' ); ?>><?php esc_html_e( 'Sponsors', 'cherrystone-blocks' ); ?></option>
			<option value="Partners" <?php selected( $tier, 'Partners' ); ?>><?php esc_html_e( 'Partners', 'cherrystone-blocks' ); ?></option>
		</select>
	</p>
	<?php
}

/**
 * Render testimonial details.
 *
 * @param WP_Post $post Current post.
 */
function cherrystone_blocks_render_testimonial_meta_box( $post ) {
	wp_nonce_field( 'cherrystone_blocks_save_meta', 'cherrystone_blocks_meta_nonce' );
	cherrystone_blocks_render_media_field( $post, 'cs_testimonial_photo_url', __( 'Founder Photo URL (Optional fallback; prefer Featured Image)', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_textarea( $post, 'cs_testimonial_quote', __( 'Quote Content', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_testimonial_author', __( 'Author Name', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_testimonial_role', __( 'Author Role / Title', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_testimonial_company', __( 'Company Name', 'cherrystone-blocks' ) );
	cherrystone_blocks_render_meta_field( $post, 'cs_testimonial_round', __( 'Funding Round / Size (e.g. $1.5M Seed)', 'cherrystone-blocks' ) );
}

/**
 * Save operational content meta.
 *
 * @param int $post_id Current post ID.
 */
function cherrystone_blocks_save_meta( $post_id ) {
	if (
		! isset( $_POST['cherrystone_blocks_meta_nonce'] ) ||
		! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['cherrystone_blocks_meta_nonce'] ) ), 'cherrystone_blocks_save_meta' )
	) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$meta_keys = array(
		'cs_logo_url',
		'cs_sector',
		'cs_stage',
		'cs_location',
		'cs_status',
		'cs_exit_details',
		'cs_company_url',
		'cs_initials',
		'cs_company_description',
		'cs_event_date',
		'cs_application_deadline',
		'cs_event_location',
		'cs_registration_url',
		'cs_agenda',
		'cs_event_type',
		'cs_event_spots',
		'cs_resource_url',
		'cs_resource_type',
		'cs_member_only',
		'cs_source',
		'cs_resource_description',
		'cs_communication_date',
		'cs_communication_author',
		'cs_communication_category',
		'cs_communication_source_url',
		'cs_communication_image_url',
		'cs_communication_body_json',
		'cs_leader_role',
		'cs_leader_linkedin_url',
		'cs_leader_photo_url',
		'cs_leader_description',
		'cs_member_role',
		'cs_member_linkedin_url',
		'cs_member_photo_url',
		'cs_member_description',
		'cs_sponsor_url',
		'cs_sponsor_description',
		'cs_sponsor_tier',
		// Testimonial CPT fields
		'cs_testimonial_quote',
		'cs_testimonial_author',
		'cs_testimonial_role',
		'cs_testimonial_company',
		'cs_testimonial_round',
		'cs_testimonial_photo_url',
		// Added missing media meta keys for full functionality
		'cs_people_photo_url',
		'cs_sponsor_logo_url',
		'cs_sponsor_logo_alt',
		'cs_event_image_url',
		'cs_resource_file_url',
	);

	foreach ( $meta_keys as $key ) {
		$value = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : '';
		update_post_meta( $post_id, $key, cherrystone_blocks_sanitize_meta_value( $value, $key ) );
	}
}
add_action( 'save_post', 'cherrystone_blocks_save_meta' );

/**
 * Add generated event details to Pitch Night event pages.
 *
 * @param string $content Post content.
 * @return string
 */
function cherrystone_blocks_append_pitch_event_details( $content ) {
	if ( ! is_singular( 'cherry_pitch_event' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$post_id      = get_the_ID();
	$event_date   = get_post_meta( $post_id, 'cs_event_date', true );
	$deadline     = get_post_meta( $post_id, 'cs_application_deadline', true );
	$location     = get_post_meta( $post_id, 'cs_event_location', true );
	$registration = get_post_meta( $post_id, 'cs_registration_url', true );
	$agenda       = array_filter( array_map( 'trim', explode( "\n", get_post_meta( $post_id, 'cs_agenda', true ) ) ) );

	ob_start();
	?>
	<section class="cherrystone-event-details">
		<h2><?php esc_html_e( 'Event Details', 'cherrystone-blocks' ); ?></h2>
		<ul>
			<?php if ( $event_date ) : ?>
				<li><strong><?php esc_html_e( 'Date:', 'cherrystone-blocks' ); ?></strong> <?php echo esc_html( date_i18n( get_option( 'date_format' ), strtotime( $event_date ) ) ); ?></li>
			<?php endif; ?>
			<?php if ( $deadline ) : ?>
				<li><strong><?php esc_html_e( 'Application deadline:', 'cherrystone-blocks' ); ?></strong> <?php echo esc_html( date_i18n( get_option( 'date_format' ), strtotime( $deadline ) ) ); ?></li>
			<?php endif; ?>
			<?php if ( $location ) : ?>
				<li><strong><?php esc_html_e( 'Location:', 'cherrystone-blocks' ); ?></strong> <?php echo esc_html( $location ); ?></li>
			<?php endif; ?>
		</ul>
		<?php if ( $agenda ) : ?>
			<h3><?php esc_html_e( 'Agenda', 'cherrystone-blocks' ); ?></h3>
			<ol>
				<?php foreach ( $agenda as $agenda_item ) : ?>
					<li><?php echo esc_html( $agenda_item ); ?></li>
				<?php endforeach; ?>
			</ol>
		<?php endif; ?>
		<?php if ( $registration ) : ?>
			<p><a class="button" href="<?php echo esc_url( $registration ); ?>"><?php esc_html_e( 'Register or apply', 'cherrystone-blocks' ); ?></a></p>
		<?php endif; ?>
	</section>
	<?php

	return $content . ob_get_clean();
}
add_filter( 'the_content', 'cherrystone_blocks_append_pitch_event_details' );

/**
 * Add structured company details to portfolio company pages.
 *
 * @param string $content Post content.
 * @return string
 */
function cherrystone_blocks_append_portfolio_details( $content ) {
	if ( ! is_singular( 'cherry_portfolio' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$post_id     = get_the_ID();
	$logo_url    = get_post_meta( $post_id, 'cs_logo_url', true );
	$company_url = get_post_meta( $post_id, 'cs_company_url', true );
	$desc        = get_post_meta( $post_id, 'cs_company_description', true );

	if ( $desc ) {
		$content = wpautop( esc_html( $desc ) ) . $content;
	}

	$fields      = array(
		__( 'Sector', 'cherrystone-blocks' )       => get_post_meta( $post_id, 'cs_sector', true ),
		__( 'Stage', 'cherrystone-blocks' )        => get_post_meta( $post_id, 'cs_stage', true ),
		__( 'Location', 'cherrystone-blocks' )     => get_post_meta( $post_id, 'cs_location', true ),
		__( 'Status', 'cherrystone-blocks' )       => get_post_meta( $post_id, 'cs_status', true ),
		__( 'Exit Details', 'cherrystone-blocks' ) => get_post_meta( $post_id, 'cs_exit_details', true ),
	);

	ob_start();
	?>
	<section class="cherrystone-company-details">
		<?php if ( $logo_url ) : ?>
			<img src="<?php echo esc_url( $logo_url ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>">
		<?php endif; ?>
		<dl>
			<?php foreach ( $fields as $label => $value ) : ?>
				<?php if ( $value ) : ?>
					<div>
						<dt><?php echo esc_html( $label ); ?></dt>
						<dd><?php echo esc_html( $value ); ?></dd>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</dl>
		<?php if ( $company_url ) : ?>
			<p><a class="button" href="<?php echo esc_url( $company_url ); ?>"><?php esc_html_e( 'Visit company site', 'cherrystone-blocks' ); ?></a></p>
		<?php endif; ?>
	</section>
	<?php

	return $content . ob_get_clean();
}
add_filter( 'the_content', 'cherrystone_blocks_append_portfolio_details' );

/**
 * Add accessible download details to member resource pages.
 *
 * @param string $content Post content.
 * @return string
 */
function cherrystone_blocks_append_resource_details( $content ) {
	if ( ! is_singular( 'cherry_resource' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$resource_url  = get_post_meta( get_the_ID(), 'cs_resource_url', true );
	$resource_type = get_post_meta( get_the_ID(), 'cs_resource_type', true );
	$desc          = get_post_meta( get_the_ID(), 'cs_resource_description', true );

	if ( $desc ) {
		$content = wpautop( esc_html( $desc ) ) . $content;
	}

	$member_portal_authenticated = function_exists( 'cherrystone_blocks_member_portal_is_authenticated' ) && cherrystone_blocks_member_portal_is_authenticated();

	if ( ( ! is_user_logged_in() && ! $member_portal_authenticated ) || ! $resource_url ) {
		return $content;
	}

	ob_start();
	?>
	<section class="cherrystone-resource-details">
		<?php if ( $resource_type ) : ?>
			<p><strong><?php esc_html_e( 'Resource type:', 'cherrystone-blocks' ); ?></strong> <?php echo esc_html( $resource_type ); ?></p>
		<?php endif; ?>
		<p><a class="button" href="<?php echo esc_url( $resource_url ); ?>"><?php esc_html_e( 'Open resource', 'cherrystone-blocks' ); ?></a></p>
	</section>
	<?php

	return $content . ob_get_clean();
}
add_filter( 'the_content', 'cherrystone_blocks_append_resource_details' );

/**
 * Render details for Leadership Members on single page view.
 */
function cherrystone_blocks_append_leader_details( $content ) {
	if ( ! is_singular( 'cherry_leader' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}
	$desc = get_post_meta( get_the_ID(), 'cs_leader_description', true );
	if ( ! $desc ) {
		$desc = $content;
	} else {
		$desc = wpautop( esc_html( $desc ) );
	}
	return $desc;
}
add_filter( 'the_content', 'cherrystone_blocks_append_leader_details' );

/**
 * Render details for Regular Members on single page view.
 */
function cherrystone_blocks_append_member_details( $content ) {
	if ( ! is_singular( 'cherry_member' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}
	$desc = get_post_meta( get_the_ID(), 'cs_member_description', true );
	if ( ! $desc ) {
		$desc = $content;
	} else {
		$desc = wpautop( esc_html( $desc ) );
	}
	return $desc;
}
add_filter( 'the_content', 'cherrystone_blocks_append_member_details' );

/**
 * Gate member-only resource content for logged-out visitors.
 *
 * @param string $content Post content.
 * @return string
 */
function cherrystone_blocks_gate_member_resources( $content ) {
	if ( ! is_singular( 'cherry_resource' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$is_member_only = get_post_meta( get_the_ID(), 'cs_member_only', true );

	$member_portal_authenticated = function_exists( 'cherrystone_blocks_member_portal_is_authenticated' ) && cherrystone_blocks_member_portal_is_authenticated();

	if ( '1' !== $is_member_only || is_user_logged_in() || $member_portal_authenticated ) {
		return $content;
	}

	$login_url = wp_login_url( get_permalink() );

	return sprintf(
		'<div class="cherrystone-resource-gate"><h2>%1$s</h2><p>%2$s</p><p><a class="button" href="%3$s">%4$s</a></p></div>',
		esc_html__( 'Member resource', 'cherrystone-blocks' ),
		esc_html__( 'Please sign in with an approved account to view this diligence resource.', 'cherrystone-blocks' ),
		esc_url( $login_url ),
		esc_html__( 'Sign in', 'cherrystone-blocks' )
	);
}
add_filter( 'the_content', 'cherrystone_blocks_gate_member_resources', 8 );

/**
 * Add admin pages for metrics and newsletter generation.
 */
function cherrystone_blocks_register_tool_pages() {
	add_submenu_page(
		'cherrystone-blocks',
		__( 'Impact Metrics', 'cherrystone-blocks' ),
		__( 'Impact Metrics', 'cherrystone-blocks' ),
		'manage_options',
		'cherrystone-impact-metrics',
		'cherrystone_blocks_render_metrics_page'
	);

	add_submenu_page(
		'cherrystone-blocks',
		__( 'Newsletter Draft', 'cherrystone-blocks' ),
		__( 'Newsletter Draft', 'cherrystone-blocks' ),
		'edit_posts',
		'cherrystone-newsletter-draft',
		'cherrystone_blocks_render_newsletter_page'
	);
}
add_action( 'admin_menu', 'cherrystone_blocks_register_tool_pages', 20 );

/**
 * Sanitize general brand settings.
 *
 * @param array $input Submitted settings.
 * @return array
 */
function cherrystone_blocks_sanitize_brand_settings( $input ) {
	$output = array();
	if ( is_array( $input ) ) {
		$output['founder_application_email'] = isset( $input['founder_application_email'] ) ? sanitize_email( $input['founder_application_email'] ) : '';
		$output['member_interest_email']      = isset( $input['member_interest_email'] ) ? sanitize_email( $input['member_interest_email'] ) : '';
		$output['slack_invite_url']          = isset( $input['slack_invite_url'] ) ? esc_url_raw( $input['slack_invite_url'] ) : '';
		$output['member_portal_banner']      = isset( $input['member_portal_banner'] ) ? sanitize_textarea_field( $input['member_portal_banner'] ) : '';
		$output['pitch_application_url']     = isset( $input['pitch_application_url'] ) ? esc_url_raw( $input['pitch_application_url'] ) : '';
		$output['founder_wpforms_id']        = isset( $input['founder_wpforms_id'] ) ? absint( $input['founder_wpforms_id'] ) : 0;
	}
	return $output;
}

/**
 * Sanitize newsletter settings.
 *
 * @param array $input Submitted settings.
 * @return array
 */
function cherrystone_blocks_sanitize_newsletter_settings( $input ) {
	$output = array();
	if ( is_array( $input ) ) {
		$output['subject_prefix'] = isset( $input['subject_prefix'] ) ? sanitize_text_field( $input['subject_prefix'] ) : '';
		$output['greeting']       = isset( $input['greeting'] ) ? sanitize_text_field( $input['greeting'] ) : '';
		$output['cta_label']      = isset( $input['cta_label'] ) ? sanitize_text_field( $input['cta_label'] ) : '';
		$output['sign_off']       = isset( $input['sign_off'] ) ? sanitize_textarea_field( $input['sign_off'] ) : '';
		$output['hero_image']     = isset( $input['hero_image'] ) ? esc_url_raw( $input['hero_image'] ) : '';
	}
	return $output;
}

/**
 * Get general brand settings with sensible defaults.
 *
 * @return array
 */
function cherrystone_blocks_get_brand_settings() {
	$saved = get_option( 'cherrystone_blocks_brand_settings', array() );
	$defaults = array(
		'founder_application_email' => 'info@cherrystoneangelgroup.com',
		'member_interest_email'      => 'info@cherrystoneangelgroup.com',
		'slack_invite_url'          => 'https://slack.com',
		'member_portal_banner'      => 'Welcome to the Cherrystone Member Portal. Access active diligence and templates below.',
		'pitch_application_url'     => 'https://gust.com',
		'founder_wpforms_id'        => 0,
	);
	return wp_parse_args( is_array( $saved ) ? $saved : array(), $defaults );
}

/**
 * Get newsletter composer settings with sensible defaults.
 *
 * @return array
 */
function cherrystone_blocks_get_newsletter_settings() {
	$saved = get_option( 'cherrystone_blocks_newsletter_settings', array() );
	$defaults = array(
		'subject_prefix' => 'Cherrystone Update',
		'greeting'       => 'Hello Cherrystone community,',
		'cta_label'      => 'Apply for funding or register for events',
		'sign_off'       => "Best,\nCherrystone Angel Group",
		'hero_image'     => 'https://newengland.com/wp-content/uploads/2026/02/YK0326_7-TRAVEL-Providence-RI-Cherry-Blossoms-1024x683.jpg.webp',
	);
	return wp_parse_args( is_array( $saved ) ? $saved : array(), $defaults );
}

/**
 * Register metrics, brand, and newsletter settings.
 */
function cherrystone_blocks_register_settings() {
	register_setting(
		'cherrystone_blocks_metrics',
		'cherrystone_blocks_metrics',
		array(
			'sanitize_callback' => 'cherrystone_blocks_sanitize_metrics',
			'type'              => 'string',
		)
	);

	register_setting(
		'cherrystone_blocks_brand_settings',
		'cherrystone_blocks_brand_settings',
		array(
			'sanitize_callback' => 'cherrystone_blocks_sanitize_brand_settings',
			'type'              => 'array',
		)
	);

	register_setting(
		'cherrystone_blocks_newsletter_settings',
		'cherrystone_blocks_newsletter_settings',
		array(
			'sanitize_callback' => 'cherrystone_blocks_sanitize_newsletter_settings',
			'type'              => 'array',
		)
	);
}
add_action( 'admin_init', 'cherrystone_blocks_register_settings' );

/**
 * Sanitize newline-delimited metrics.
 *
 * @param string $value Submitted value.
 * @return string
 */
function cherrystone_blocks_sanitize_metrics( $value ) {
	$lines = array_filter( array_map( 'trim', explode( "\n", wp_unslash( $value ) ) ) );
	$clean = array();

	foreach ( $lines as $line ) {
		$parts = array_map( 'sanitize_text_field', array_pad( explode( '|', $line, 3 ), 3, '' ) );
		$clean[] = implode( '|', $parts );
	}

	return implode( "\n", $clean );
}

/**
 * Parse saved metrics into structured rows.
 *
 * @return array
 */
function cherrystone_blocks_get_metrics() {
	$saved = get_option(
		'cherrystone_blocks_metrics',
		"25+|Active companies|Across life sciences, software, healthcare, fintech, consumer, and industrial tech.\n6|Investment sectors|A focused lens for early-stage New England opportunities.\n2004|Founded|Two decades of angel investing in the regional ecosystem."
	);
	$rows = array_filter( array_map( 'trim', explode( "\n", $saved ) ) );

	return array_map(
		function( $row ) {
			$parts = array_pad( explode( '|', $row, 3 ), 3, '' );
			return array(
				'value' => $parts[0],
				'label' => $parts[1],
				'note'  => $parts[2],
			);
		},
		$rows
	);
}

/**
 * Render metrics settings page.
 */
function cherrystone_blocks_render_metrics_page() {
	$_GET['tab'] = 'metrics';
	cherrystone_blocks_render_admin_page();
}

/**
 * Render metrics dashboard shortcode.
 *
 * @return string
 */
function cherrystone_blocks_metrics_shortcode() {
	$metrics = cherrystone_blocks_get_metrics();

	ob_start();
	?>
	<div class="cherrystone-metrics-dashboard">
		<?php foreach ( $metrics as $metric ) : ?>
			<article class="cherrystone-metric">
				<strong><?php echo esc_html( $metric['value'] ); ?></strong>
				<span><?php echo esc_html( $metric['label'] ); ?></span>
				<?php if ( $metric['note'] ) : ?>
					<p><?php echo esc_html( $metric['note'] ); ?></p>
				<?php endif; ?>
			</article>
		<?php endforeach; ?>
	</div>
	<?php

	return ob_get_clean();
}
add_shortcode( 'cherrystone_metrics_dashboard', 'cherrystone_blocks_metrics_shortcode' );

/**
 * Build a newsletter-ready draft from recent site updates.
 *
 * @return string
 */
function cherrystone_blocks_generate_newsletter_draft() {
	$portfolio = get_posts(
		array(
			'post_type'      => 'cherry_portfolio',
			'posts_per_page' => 5,
			'post_status'    => 'publish',
		)
	);
	$events = get_posts(
		array(
			'post_type'      => 'cherry_pitch_event',
			'posts_per_page' => 3,
			'post_status'    => 'publish',
			'meta_key'       => 'cs_event_date',
			'orderby'        => 'meta_value',
			'order'          => 'ASC',
		)
	);
	$posts = get_posts(
		array(
			'post_type'      => 'post',
			'posts_per_page' => 3,
			'post_status'    => 'publish',
		)
	);
	$lines = array(
		'Subject: Cherrystone update - portfolio, pitch nights, and member notes',
		'',
		'Hello Cherrystone community,',
		'',
		'Here are the latest updates from the Cherrystone network.',
		'',
		'Portfolio updates',
	);

	foreach ( $portfolio as $company ) {
		$sector = get_post_meta( $company->ID, 'cs_sector', true );
		$stage  = get_post_meta( $company->ID, 'cs_stage', true );
		$lines[] = '- ' . get_the_title( $company ) . ( $sector || $stage ? ' - ' . trim( $sector . ' / ' . $stage, ' /' ) : '' );
	}

	$lines[] = '';
	$lines[] = 'Upcoming events';

	foreach ( $events as $event ) {
		$date = get_post_meta( $event->ID, 'cs_event_date', true );
		$lines[] = '- ' . get_the_title( $event ) . ( $date ? ' - ' . date_i18n( get_option( 'date_format' ), strtotime( $date ) ) : '' );
	}

	$lines[] = '';
	$lines[] = 'News and notes';

	foreach ( $posts as $post ) {
		$lines[] = '- ' . get_the_title( $post ) . ': ' . get_permalink( $post );
	}

	$lines[] = '';
	$lines[] = 'Best,';
	$lines[] = 'Cherrystone Angel Group';

	return implode( "\n", $lines );
}

/**
 * Render newsletter generator page.
 */
function cherrystone_blocks_render_newsletter_page() {
	$_GET['tab'] = 'newsletter';
	cherrystone_blocks_render_admin_page();
}

/**
 * Return a menu-safe SVG icon for the admin page.
 *
 * @return string
 */
function cherrystone_blocks_admin_icon() {
	$icon_path = CHERRYSTONE_BLOCKS_PATH . 'assets/plugin-logo.svg';

	if ( ! file_exists( $icon_path ) ) {
		return 'dashicons-layout';
	}

	return 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( $icon_path ) );
}

/**
 * Handle the "Import / re-sync starter content" admin action.
 */
function cherrystone_blocks_handle_import() {
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_die( esc_html__( 'You are not allowed to do this.', 'cherrystone-blocks' ) );
	}

	check_admin_referer( 'cherrystone_blocks_import' );

	$created = cherrystone_blocks_seed_content();

	$redirect = add_query_arg(
		array(
			'page'            => 'cherrystone-blocks',
			'cs_imported'     => 1,
			'cs_portfolio'    => $created['portfolio'],
			'cs_resources'    => $created['resources'],
			'cs_events'       => $created['events'],
			'cs_leadership'   => isset( $created['leadership'] ) ? $created['leadership'] : 0,
			'cs_sponsors'     => isset( $created['sponsors'] ) ? $created['sponsors'] : 0,
			'cs_testimonials' => isset( $created['testimonials'] ) ? $created['testimonials'] : 0,
			'cs_communications' => isset( $created['communications'] ) ? $created['communications'] : 0,
			'cs_people'       => isset( $created['people'] ) ? $created['people'] : 0,
		),
		admin_url( 'admin.php' )
	);

	wp_safe_redirect( $redirect );
	exit;
}
add_action( 'admin_post_cherrystone_blocks_import', 'cherrystone_blocks_handle_import' );

/**
 * Add a small admin guide so site editors can see what the plugin does.
 */
function cherrystone_blocks_admin_menu() {
	add_menu_page(
		__( 'Cherrystone Blocks', 'cherrystone-blocks' ),
		__( 'Cherrystone Blocks', 'cherrystone-blocks' ),
		'edit_posts',
		'cherrystone-blocks',
		'cherrystone_blocks_render_admin_page',
		cherrystone_blocks_admin_icon(),
		58
	);
}
add_action( 'admin_menu', 'cherrystone_blocks_admin_menu' );

/**
 * Render the plugin guide page.
 */
function cherrystone_blocks_render_admin_page() {
	$logo_url = CHERRYSTONE_BLOCKS_URL . 'assets/plugin-logo.svg';

	// Query Database Stats
	$portfolio_count = wp_count_posts( 'cherry_portfolio' )->publish;
	$pitch_count     = wp_count_posts( 'cherry_pitch_event' )->publish;
	$resource_count  = wp_count_posts( 'cherry_resource' )->publish;
	$leader_count    = wp_count_posts( 'cherry_leader' )->publish;
	$member_count    = wp_count_posts( 'cherry_member' )->publish;
	$sponsor_count   = wp_count_posts( 'cherry_sponsor' )->publish;

	// Count gated/member-only resources
	$resources   = get_posts( array(
		'post_type'      => 'cherry_resource',
		'posts_per_page' => -1,
		'post_status'    => 'publish',
	) );
	$gated_count = 0;
	foreach ( $resources as $res ) {
		if ( '1' === get_post_meta( $res->ID, 'cs_member_only', true ) ) {
			$gated_count++;
		}
	}

	// Fetch next upcoming pitch event
	$upcoming_events = get_posts( array(
		'post_type'      => 'cherry_pitch_event',
		'posts_per_page' => 1,
		'post_status'    => 'publish',
		'meta_key'       => 'cs_event_date',
		'meta_value'     => date( 'Y-m-d' ),
		'meta_compare'   => '>=',
		'orderby'        => 'meta_value',
		'order'          => 'ASC',
	) );
	$next_event_text = __( 'No upcoming events', 'cherrystone-blocks' );
	if ( ! empty( $upcoming_events ) ) {
		$next_date = get_post_meta( $upcoming_events[0]->ID, 'cs_event_date', true );
		if ( $next_date ) {
			$next_event_text = sprintf(
				/* translators: %s: formatted date */
				__( 'Next on %s', 'cherrystone-blocks' ),
				date_i18n( get_option( 'date_format' ), strtotime( $next_date ) )
			);
		}
	}

	// Fetch brand and newsletter settings
	$brand = cherrystone_blocks_get_brand_settings();
	$news  = cherrystone_blocks_get_newsletter_settings();

	// Query content updates for the newsletter composer
	$recent_portfolio = get_posts( array(
		'post_type'      => 'cherry_portfolio',
		'posts_per_page' => 10,
		'post_status'    => 'publish',
	) );

	$recent_events = get_posts( array(
		'post_type'      => 'cherry_pitch_event',
		'posts_per_page' => 5,
		'post_status'    => 'publish',
	) );

	$recent_posts = get_posts( array(
		'post_type'      => 'post',
		'posts_per_page' => 5,
		'post_status'    => 'publish',
	) );

	// Determine active tab
	$active_tab = isset( $_GET['tab'] ) ? sanitize_key( $_GET['tab'] ) : 'dashboard';
	if ( ! in_array( $active_tab, array( 'dashboard', 'metrics', 'newsletter', 'settings' ), true ) ) {
		$active_tab = 'dashboard';
	}
	?>
	<div class="wrap cherrystone-blocks-admin" data-active-tab="<?php echo esc_attr( $active_tab ); ?>">
		<style>
			:root {
				--cs-navy: #0b2233;
				--cs-navy-light: #16354c;
				--cs-navy-dark: #071520;
				--cs-cherry: #a11818;
				--cs-gold: #d4af37;
				--cs-gray-light: #f3f4f6;
				--cs-border: #d2d6dc;
			}
			.cherrystone-blocks-admin {
				max-width: 1200px;
				margin: 20px auto 20px 0;
			}
			/* Header and Hero */
			.cs-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20px;
			}
			.cs-header h1 {
				margin: 0;
				font-size: 24px;
				font-weight: 700;
				color: var(--cs-navy);
			}
			.cherrystone-blocks-hero {
				align-items: center;
				background: var(--cs-navy);
				border-radius: 8px;
				color: #fff;
				display: grid;
				gap: 28px;
				grid-template-columns: 112px 1fr;
				margin-bottom: 24px;
				padding: 28px;
			}
			.cherrystone-blocks-hero img {
				background: #fff;
				border-radius: 8px;
				display: block;
				height: 88px;
				padding: 12px;
				width: 88px;
			}
			.cherrystone-blocks-hero h1 {
				color: #fff;
				margin: 0 0 8px;
			}
			.cherrystone-blocks-hero p {
				color: rgba(255, 255, 255, 0.78);
				font-size: 16px;
				margin: 0;
				max-width: 720px;
			}
			/* Tabs */
			.cs-tabs-header {
				display: flex;
				border-bottom: 1px solid var(--cs-border);
				margin-bottom: 24px;
				background: #fff;
				border-radius: 6px 6px 0 0;
				box-shadow: 0 1px 3px rgba(0,0,0,0.05);
			}
			.cs-tab-btn {
				background: none;
				border: none;
				border-bottom: 3px solid transparent;
				color: #4b5563;
				cursor: pointer;
				font-size: 14px;
				font-weight: 600;
				padding: 16px 24px;
				transition: all 0.2s ease;
				display: flex;
				align-items: center;
				gap: 8px;
			}
			.cs-tab-btn:hover {
				color: var(--cs-navy);
				background: #f9fafb;
			}
			.cs-tab-btn.is-active {
				border-bottom-color: var(--cs-cherry);
				color: var(--cs-navy);
				background: #fff;
			}
			.cs-tab-content {
				display: none;
				animation: csFadeIn 0.2s ease;
			}
			.cs-tab-content.is-active {
				display: block;
			}
			@keyframes csFadeIn {
				from { opacity: 0; transform: translateY(5px); }
				to { opacity: 1; transform: translateY(0); }
			}
			/* Dashboard Layout */
			.cs-dashboard-summary {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
				gap: 20px;
				margin-bottom: 24px;
			}
			.cs-stat-card {
				background: #fff;
				border-radius: 8px;
				border: 1px solid var(--cs-border);
				box-shadow: 0 1px 3px rgba(0,0,0,0.05);
				padding: 24px;
				position: relative;
				overflow: hidden;
				transition: transform 0.2s ease, box-shadow 0.2s ease;
			}
			.cs-stat-card:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 12px rgba(0,0,0,0.08);
			}
			.cs-stat-card::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 4px;
				height: 100%;
				background: var(--cs-navy);
			}
			.cs-stat-card.cherry::before {
				background: var(--cs-cherry);
			}
			.cs-stat-card.gold::before {
				background: var(--cs-gold);
			}
			.cs-stat-icon {
				font-size: 36px;
				position: absolute;
				top: 20px;
				right: 20px;
				opacity: 0.1;
			}
			.cs-stat-number {
				font-size: 32px;
				font-weight: 700;
				color: var(--cs-navy-dark);
				line-height: 1.1;
				margin-bottom: 6px;
			}
			.cs-stat-label {
				font-size: 15px;
				font-weight: 600;
				color: #374151;
				margin-bottom: 4px;
			}
			.cs-stat-desc {
				font-size: 13px;
				color: #6b7280;
				margin-bottom: 16px;
			}
			.cs-card-action {
				display: inline-flex;
				align-items: center;
				gap: 4px;
				color: var(--cs-cherry);
				font-weight: 600;
				text-decoration: none;
				font-size: 13px;
			}
			.cs-card-action:hover {
				text-decoration: underline;
			}
			.cs-dashboard-row {
				display: grid;
				grid-template-columns: 2fr 1fr;
				gap: 20px;
			}
			.cs-card-panel {
				background: #fff;
				border: 1px solid var(--cs-border);
				border-radius: 8px;
				padding: 24px;
				box-shadow: 0 1px 3px rgba(0,0,0,0.05);
			}
			.cs-card-panel h2 {
				margin-top: 0;
				font-size: 18px;
				color: var(--cs-navy);
				border-bottom: 1px solid var(--cs-border);
				padding-bottom: 12px;
				margin-bottom: 16px;
			}
			/* Metrics Tab styling */
			.cs-metrics-manager {
				background: #fff;
				border: 1px solid var(--cs-border);
				border-radius: 8px;
				padding: 24px;
				box-shadow: 0 1px 3px rgba(0,0,0,0.05);
			}
			.cs-metric-table-header {
				display: grid;
				grid-template-columns: 40px 140px 220px 1fr 50px;
				gap: 12px;
				padding: 10px 12px;
				background: var(--cs-gray-light);
				border-radius: 4px;
				font-weight: 600;
				margin-bottom: 12px;
				font-size: 13px;
				color: #4b5563;
			}
			.cs-metric-rows {
				display: flex;
				flex-direction: column;
				gap: 10px;
				margin-bottom: 16px;
			}
			.cs-metric-row {
				display: grid;
				grid-template-columns: 40px 140px 220px 1fr 50px;
				gap: 12px;
				align-items: center;
				padding: 8px 12px;
				background: #fff;
				border: 1px solid var(--cs-border);
				border-radius: 6px;
				box-shadow: 0 1px 2px rgba(0,0,0,0.02);
				transition: background-color 0.2s ease;
			}
			.cs-metric-row:hover {
				background: #fafafa;
			}
			.cs-drag-handle {
				cursor: grab;
				font-size: 18px;
				color: #9ca3af;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.cs-drag-handle:active {
				cursor: grabbing;
			}
			.cs-metric-row input {
				width: 100% !important;
				margin: 0 !important;
			}
			.cs-row-btn {
				border: none;
				background: none;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.cs-btn-delete {
				color: #ef4444;
				font-size: 20px;
				font-weight: bold;
			}
			.cs-btn-delete:hover {
				color: #dc2626;
			}
			.cs-metrics-actions {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20px;
				border-top: 1px solid var(--cs-border);
				padding-top: 16px;
			}
			/* Newsletter Tab styling */
			.cs-newsletter-composer {
				display: grid;
				grid-template-columns: 380px 1fr;
				gap: 24px;
				align-items: start;
			}
			.cs-composer-controls {
				background: #fff;
				border: 1px solid var(--cs-border);
				border-radius: 8px;
				padding: 20px;
				box-shadow: 0 1px 3px rgba(0,0,0,0.05);
			}
			.cs-composer-preview {
				background: #fff;
				border: 1px solid var(--cs-border);
				border-radius: 8px;
				box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
				overflow: hidden;
				display: flex;
				flex-direction: column;
			}
			.cs-preview-header {
				background: #f3f4f6;
				border-bottom: 1px solid var(--cs-border);
				padding: 12px 16px;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.cs-preview-tabs {
				display: flex;
				gap: 8px;
			}
			.cs-preview-tab-btn {
				background: none;
				border: 1px solid transparent;
				border-radius: 4px;
				cursor: pointer;
				font-size: 12px;
				font-weight: 600;
				padding: 6px 12px;
				color: #4b5563;
			}
			.cs-preview-tab-btn.is-active {
				background: #fff;
				border-color: var(--cs-border);
				color: var(--cs-navy);
				box-shadow: 0 1px 2px rgba(0,0,0,0.05);
			}
			.cs-preview-client-bar {
				background: #f3f4f6;
				border-bottom: 1px solid var(--cs-border);
				padding: 10px 16px;
				font-size: 12px;
				color: #374151;
				font-family: monospace;
			}
			.cs-preview-client-row {
				margin-bottom: 4px;
			}
			.cs-preview-client-row:last-child {
				margin-bottom: 0;
			}
			.cs-preview-client-row strong {
				color: #6b7280;
				display: inline-block;
				width: 65px;
			}
			.cs-preview-body {
				flex-grow: 1;
				min-height: 520px;
				background: #f9fafb;
				display: none;
			}
			.cs-preview-body.is-active {
				display: block;
			}
			.cs-preview-body iframe {
				width: 100%;
				height: 520px;
				border: none;
				display: block;
			}
			.cs-preview-text-output {
				display: none;
				width: 100%;
				height: 520px;
				box-sizing: border-box;
				padding: 16px;
				font-family: "Courier New", Courier, monospace;
				font-size: 13px;
				line-height: 1.4;
				border: none;
				resize: none;
				background: #fafafa;
			}
			.cs-preview-text-output.is-active {
				display: block;
			}
			.cs-preview-html-output {
				display: none;
				width: 100%;
				height: 520px;
				box-sizing: border-box;
				padding: 16px;
				font-family: "Courier New", Courier, monospace;
				font-size: 12px;
				line-height: 1.4;
				border: none;
				resize: none;
				background: #fafafa;
			}
			.cs-preview-html-output.is-active {
				display: block;
			}
			.cs-composer-section {
				margin-bottom: 20px;
				border-bottom: 1px solid #f3f4f6;
				padding-bottom: 16px;
			}
			.cs-composer-section:last-child {
				margin-bottom: 0;
				border-bottom: none;
				padding-bottom: 0;
			}
			.cs-composer-section h3 {
				margin-top: 0;
				font-size: 14px;
				color: var(--cs-navy);
				margin-bottom: 10px;
			}
			.cs-checklist {
				max-height: 150px;
				overflow-y: auto;
				border: 1px solid var(--cs-border);
				border-radius: 4px;
				padding: 8px 12px;
				background: #f9fafb;
			}
			.cs-checklist-item {
				display: flex;
				align-items: flex-start;
				gap: 8px;
				margin-bottom: 8px;
				font-size: 12px;
			}
			.cs-checklist-item:last-child {
				margin-bottom: 0;
			}
			.cs-checklist-item input {
				margin-top: 2px;
			}
			.cs-field-group {
				margin-bottom: 12px;
			}
			.cs-field-group label {
				display: block;
				font-size: 12px;
				font-weight: 600;
				color: #374151;
				margin-bottom: 4px;
			}
			.cs-field-group input, .cs-field-group textarea {
				width: 100% !important;
				margin: 0 !important;
			}
			/* Brand Settings panel styling */
			.cs-settings-panel {
				background: #fff;
				border: 1px solid var(--cs-border);
				border-radius: 8px;
				padding: 24px;
				box-shadow: 0 1px 3px rgba(0,0,0,0.05);
				max-width: 640px;
			}
			.cs-settings-form-row {
				margin-bottom: 20px;
			}
			.cs-settings-form-row label {
				display: block;
				font-weight: 600;
				font-size: 14px;
				color: var(--cs-navy);
				margin-bottom: 6px;
			}
			.cs-settings-form-row input, .cs-settings-form-row textarea {
				width: 100% !important;
				max-width: 500px;
				margin: 0 !important;
			}
			.cs-settings-form-row p.description {
				margin-top: 6px;
				font-size: 12px;
				color: #6b7280;
			}
			@media (max-width: 900px) {
				.cs-newsletter-composer {
					grid-template-columns: 1fr;
				}
				.cs-dashboard-row {
					grid-template-columns: 1fr;
				}
			}
		</style>

		<!-- Header -->
		<div class="cs-header">
			<h1><?php esc_html_e( 'Cherrystone Blocks Dashboard', 'cherrystone-blocks' ); ?></h1>
		</div>

		<?php if ( isset( $_GET['cs_imported'] ) ) : ?>
			<div class="notice notice-success is-dismissible">
				<p>
					<?php
					printf(
						/* translators: 1: portfolio count, 2: resources count, 3: events count, 4: leadership count, 5: sponsors count, 6: testimonials count, 7: regular members count, 8: communications count. */
						esc_html__( 'Starter content synced. Added %1$d portfolio companies, %2$d member resources, %3$d Pitch Night events, %4$d leadership members, %5$d sponsors, %6$d testimonials, %7$d regular members, and %8$d communications. Existing items were left untouched.', 'cherrystone-blocks' ),
						isset( $_GET['cs_portfolio'] ) ? (int) $_GET['cs_portfolio'] : 0,
						isset( $_GET['cs_resources'] ) ? (int) $_GET['cs_resources'] : 0,
						isset( $_GET['cs_events'] ) ? (int) $_GET['cs_events'] : 0,
						isset( $_GET['cs_leadership'] ) ? (int) $_GET['cs_leadership'] : 0,
						isset( $_GET['cs_sponsors'] ) ? (int) $_GET['cs_sponsors'] : 0,
						isset( $_GET['cs_testimonials'] ) ? (int) $_GET['cs_testimonials'] : 0,
						isset( $_GET['cs_people'] ) ? (int) $_GET['cs_people'] : 0,
						isset( $_GET['cs_communications'] ) ? (int) $_GET['cs_communications'] : 0
					);
					?>
				</p>
			</div>
		<?php endif; ?>

		<?php if ( isset( $_GET['settings-updated'] ) && 'true' === $_GET['settings-updated'] ) : ?>
			<div class="notice notice-success is-dismissible">
				<p><?php esc_html_e( 'Settings updated successfully.', 'cherrystone-blocks' ); ?></p>
			</div>
		<?php endif; ?>

		<!-- Tabs Header -->
		<div class="cs-tabs-header">
			<button type="button" class="cs-tab-btn" data-tab="dashboard">
				<span class="dashicons dashicons-dashboard"></span> <?php esc_html_e( 'Overview', 'cherrystone-blocks' ); ?>
			</button>
			<button type="button" class="cs-tab-btn" data-tab="metrics">
				<span class="dashicons dashicons-chart-bar"></span> <?php esc_html_e( 'Impact Metrics', 'cherrystone-blocks' ); ?>
			</button>
			<button type="button" class="cs-tab-btn" data-tab="newsletter">
				<span class="dashicons dashicons-email-alt"></span> <?php esc_html_e( 'Newsletter Draft', 'cherrystone-blocks' ); ?>
			</button>
			<button type="button" class="cs-tab-btn" data-tab="settings">
				<span class="dashicons dashicons-admin-generic"></span> <?php esc_html_e( 'Brand Settings', 'cherrystone-blocks' ); ?>
			</button>
		</div>

		<!-- TAB 1: DASHBOARD -->
		<div class="cs-tab-content" id="tab-dashboard">
			<!-- Hero widget -->
			<div class="cherrystone-blocks-hero">
				<img src="<?php echo esc_url( $logo_url ); ?>" alt="<?php esc_attr_e( 'Cherrystone Blocks logo', 'cherrystone-blocks' ); ?>">
				<div>
					<h1><?php esc_html_e( 'Cherrystone Blocks Toolbox', 'cherrystone-blocks' ); ?></h1>
					<p><?php esc_html_e( 'A tidy Cherrystone block toolbox for landing pages, investor workflows, founder FAQs, and other polished little bits of venture-site magic.', 'cherrystone-blocks' ); ?></p>
				</div>
			</div>

			<!-- Dynamic Stats -->
			<div class="cs-dashboard-summary">
				<div class="cs-stat-card">
					<div class="cs-stat-icon dashicons dashicons-portfolio"></div>
					<div class="cs-stat-number"><?php echo (int) $portfolio_count; ?></div>
					<div class="cs-stat-label"><?php esc_html_e( 'Portfolio Companies', 'cherrystone-blocks' ); ?></div>
					<div class="cs-stat-desc"><?php esc_html_e( 'Backed and tracked venture companies.', 'cherrystone-blocks' ); ?></div>
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=cherry_portfolio' ) ); ?>" class="cs-card-action">
						<?php esc_html_e( 'Manage Portfolio', 'cherrystone-blocks' ); ?> <span class="dashicons dashicons-arrow-right-alt2" style="font-size:16px;"></span>
					</a>
				</div>

				<div class="cs-stat-card cherry">
					<div class="cs-stat-icon dashicons dashicons-calendar-alt"></div>
					<div class="cs-stat-number"><?php echo (int) $pitch_count; ?></div>
					<div class="cs-stat-label"><?php esc_html_e( 'Pitch Nights', 'cherrystone-blocks' ); ?></div>
					<div class="cs-stat-desc"><?php echo esc_html( $next_event_text ); ?></div>
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=cherry_pitch_event' ) ); ?>" class="cs-card-action">
						<?php esc_html_e( 'Manage Events', 'cherrystone-blocks' ); ?> <span class="dashicons dashicons-arrow-right-alt2" style="font-size:16px;"></span>
					</a>
				</div>

				<div class="cs-stat-card gold">
					<div class="cs-stat-icon dashicons dashicons-lock"></div>
					<div class="cs-stat-number"><?php echo (int) $resource_count; ?></div>
					<div class="cs-stat-label"><?php esc_html_e( 'Member Resources', 'cherrystone-blocks' ); ?></div>
					<div class="cs-stat-desc"><?php printf( /* translators: %d: count */ esc_html__( '%d gated for members', 'cherrystone-blocks' ), (int) $gated_count ); ?></div>
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=cherry_resource' ) ); ?>" class="cs-card-action">
						<?php esc_html_e( 'Manage Resources', 'cherrystone-blocks' ); ?> <span class="dashicons dashicons-arrow-right-alt2" style="font-size:16px;"></span>
					</a>
				</div>

				<div class="cs-stat-card">
					<div class="cs-stat-icon dashicons dashicons-businessman"></div>
					<div class="cs-stat-number"><?php echo (int) $leader_count; ?></div>
					<div class="cs-stat-label"><?php esc_html_e( 'Leadership Members', 'cherrystone-blocks' ); ?></div>
					<div class="cs-stat-desc"><?php esc_html_e( 'Managing directors and screening leads.', 'cherrystone-blocks' ); ?></div>
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=cherry_leader' ) ); ?>" class="cs-card-action">
						<?php esc_html_e( 'Manage Leadership', 'cherrystone-blocks' ); ?> <span class="dashicons dashicons-arrow-right-alt2" style="font-size:16px;"></span>
					</a>
				</div>

				<div class="cs-stat-card cherry">
					<div class="cs-stat-icon dashicons dashicons-businessman"></div>
					<div class="cs-stat-number"><?php echo (int) $member_count; ?></div>
					<div class="cs-stat-label"><?php esc_html_e( 'Regular Members', 'cherrystone-blocks' ); ?></div>
					<div class="cs-stat-desc"><?php esc_html_e( 'Angel investors and advisory members.', 'cherrystone-blocks' ); ?></div>
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=cherry_member' ) ); ?>" class="cs-card-action">
						<?php esc_html_e( 'Manage Members', 'cherrystone-blocks' ); ?> <span class="dashicons dashicons-arrow-right-alt2" style="font-size:16px;"></span>
					</a>
				</div>

				<div class="cs-stat-card gold">
					<div class="cs-stat-icon dashicons dashicons-groups"></div>
					<div class="cs-stat-number"><?php echo (int) $sponsor_count; ?></div>
					<div class="cs-stat-label"><?php esc_html_e( 'Sponsors & Partners', 'cherrystone-blocks' ); ?></div>
					<div class="cs-stat-desc"><?php esc_html_e( 'Venture ecosystem network supporters.', 'cherrystone-blocks' ); ?></div>
					<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=cherry_sponsor' ) ); ?>" class="cs-card-action">
						<?php esc_html_e( 'Manage Sponsors', 'cherrystone-blocks' ); ?> <span class="dashicons dashicons-arrow-right-alt2" style="font-size:16px;"></span>
					</a>
				</div>
			</div>

			<div class="cs-dashboard-row">
				<div class="cs-card-panel">
					<h2><?php esc_html_e( 'Starter Content Import', 'cherrystone-blocks' ); ?></h2>
					<p><?php esc_html_e( 'Need to reset or load the baseline venture content? The seeder reads portfolio records, templates, and pitch nights, then populates lists dynamically. Existing custom edits are never overwritten.', 'cherrystone-blocks' ); ?></p>
					<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-top:16px;">
						<input type="hidden" name="action" value="cherrystone_blocks_import">
						<?php wp_nonce_field( 'cherrystone_blocks_import' ); ?>
						<button type="submit" class="button button-primary"><?php esc_html_e( 'Import / Sync starter content', 'cherrystone-blocks' ); ?></button>
					</form>
				</div>
				<div class="cs-card-panel">
					<h2><?php esc_html_e( 'Active Block Features', 'cherrystone-blocks' ); ?></h2>
					<p style="font-size:13px; margin-bottom:8px;"><strong><?php esc_html_e( 'Searchable FAQ Accordion', 'cherrystone-blocks' ); ?></strong></p>
					<p style="font-size:12px; color:#6b7280; margin-top:0; margin-bottom:14px;"><?php esc_html_e( 'Filterable accordions ideal for FAQs.', 'cherrystone-blocks' ); ?></p>
					
					<p style="font-size:13px; margin-bottom:8px;"><strong><?php esc_html_e( 'Deal Scorecard Comparison', 'cherrystone-blocks' ); ?></strong></p>
					<p style="font-size:12px; color:#6b7280; margin-top:0;"><?php esc_html_e( 'Side-by-side matrices comparing stages and sectors.', 'cherrystone-blocks' ); ?></p>
				</div>
			</div>
		</div>

		<!-- TAB 2: IMPACT METRICS MANAGER -->
		<div class="cs-tab-content" id="tab-metrics">
			<div class="cs-metrics-manager">
				<h2><?php esc_html_e( 'Visual Impact Metrics Manager', 'cherrystone-blocks' ); ?></h2>
				<p class="description" style="margin-bottom:20px;"><?php esc_html_e( 'Design metrics representing key impact achievements. Add, delete, and re-order metrics visually below. Changes immediately update where shortcode [cherrystone_metrics_dashboard] is rendered.', 'cherrystone-blocks' ); ?></p>
				
				<form method="post" action="options.php" id="cs-metrics-form">
					<?php settings_fields( 'cherrystone_blocks_metrics' ); ?>
					
					<!-- Table Headers -->
					<div class="cs-metric-table-header">
						<div></div>
						<div><?php esc_html_e( 'Metric Value', 'cherrystone-blocks' ); ?></div>
						<div><?php esc_html_e( 'Metric Label', 'cherrystone-blocks' ); ?></div>
						<div><?php esc_html_e( 'Explanatory Notes (optional)', 'cherrystone-blocks' ); ?></div>
						<div></div>
					</div>

					<!-- Draggable / Editable Rows -->
					<div class="cs-metric-rows" id="cs-metric-rows-container">
						<?php
						$metrics_list = cherrystone_blocks_get_metrics();
						foreach ( $metrics_list as $index => $m ) :
							?>
							<div class="cs-metric-row" data-index="<?php echo (int) $index; ?>">
								<div class="cs-drag-handle">☰</div>
								<div>
									<input type="text" class="cs-metric-val" placeholder="e.g. 25+" value="<?php echo esc_attr( $m['value'] ); ?>">
								</div>
								<div>
									<input type="text" class="cs-metric-lbl" placeholder="e.g. Active companies" value="<?php echo esc_attr( $m['label'] ); ?>">
								</div>
								<div>
									<input type="text" class="cs-metric-nte" placeholder="e.g. Across software and life sciences" value="<?php echo esc_attr( $m['note'] ); ?>">
								</div>
								<div>
									<button type="button" class="cs-row-btn cs-btn-delete" title="<?php esc_attr_e( 'Remove Row', 'cherrystone-blocks' ); ?>">×</button>
								</div>
							</div>
						<?php endforeach; ?>
					</div>

					<!-- Hidden Serialized Target Textarea -->
					<textarea name="cherrystone_blocks_metrics" id="cs-metrics-textarea" style="display:none;"><?php echo esc_textarea( get_option( 'cherrystone_blocks_metrics', '' ) ); ?></textarea>

					<div class="cs-metrics-actions">
						<button type="button" class="button" id="cs-add-metric-row-btn">+ <?php esc_html_e( 'Add Metric Row', 'cherrystone-blocks' ); ?></button>
						<?php submit_button( __( 'Save Metrics', 'cherrystone-blocks' ), 'button-primary', 'submit', false ); ?>
					</div>
				</form>
			</div>
		</div>

		<!-- TAB 3: NEWSLETTER COMPOSER -->
		<div class="cs-tab-content" id="tab-newsletter">
			<div class="cs-newsletter-composer">
				
				<!-- Controls Panel (Left Column) -->
				<div class="cs-composer-controls">
					<h2><?php esc_html_e( 'Composer Settings', 'cherrystone-blocks' ); ?></h2>
					
					<!-- Template variables -->
					<form method="post" action="options.php" id="cs-newsletter-settings-form" style="margin-bottom:20px; border-bottom:1px solid #f3f4f6; padding-bottom:16px;">
						<?php settings_fields( 'cherrystone_blocks_newsletter_settings' ); ?>
						
						<div class="cs-field-group">
							<label for="cs_news_subject_prefix"><?php esc_html_e( 'Subject Prefix', 'cherrystone-blocks' ); ?></label>
							<input type="text" id="cs_news_subject_prefix" name="cherrystone_blocks_newsletter_settings[subject_prefix]" value="<?php echo esc_attr( $news['subject_prefix'] ); ?>">
						</div>
						
						<div class="cs-field-group">
							<label for="cs_news_greeting"><?php esc_html_e( 'Email Greeting', 'cherrystone-blocks' ); ?></label>
							<input type="text" id="cs_news_greeting" name="cherrystone_blocks_newsletter_settings[greeting]" value="<?php echo esc_attr( $news['greeting'] ); ?>">
						</div>

						<div class="cs-field-group">
							<label for="cs_news_cta_label"><?php esc_html_e( 'Call-To-Action (CTA) Label', 'cherrystone-blocks' ); ?></label>
							<input type="text" id="cs_news_cta_label" name="cherrystone_blocks_newsletter_settings[cta_label]" value="<?php echo esc_attr( $news['cta_label'] ); ?>">
						</div>

						<div class="cs-field-group">
							<label for="cs_news_sign_off"><?php esc_html_e( 'Email Sign-off Signature', 'cherrystone-blocks' ); ?></label>
							<textarea id="cs_news_sign_off" name="cherrystone_blocks_newsletter_settings[sign_off]" rows="3"><?php echo esc_textarea( $news['sign_off'] ); ?></textarea>
						</div>

						<div class="cs-field-group">
							<label for="cs_news_hero_image"><?php esc_html_e( 'Hero Image URL', 'cherrystone-blocks' ); ?></label>
							<input type="text" id="cs_news_hero_image" name="cherrystone_blocks_newsletter_settings[hero_image]" value="<?php echo esc_attr( $news['hero_image'] ); ?>">
						</div>

						<button type="submit" class="button button-secondary" style="width:100%;"><?php esc_html_e( 'Save Template Defaults', 'cherrystone-blocks' ); ?></button>
					</form>

					<!-- Content Selections -->
					<div class="cs-composer-section">
						<h3><?php esc_html_e( 'Portfolio Companies', 'cherrystone-blocks' ); ?></h3>
						<div class="cs-checklist">
							<?php if ( empty( $recent_portfolio ) ) : ?>
								<span style="font-size:11px; color:#9ca3af;"><?php esc_html_e( 'No portfolio companies found.', 'cherrystone-blocks' ); ?></span>
							<?php else : ?>
								<?php foreach ( $recent_portfolio as $company ) : 
									$sect = get_post_meta( $company->ID, 'cs_sector', true );
									$stag = get_post_meta( $company->ID, 'cs_stage', true );
									$logo = get_post_meta( $company->ID, 'cs_logo_url', true );
									$status = get_post_meta( $company->ID, 'cs_status', true );
									$desc = get_post_meta( $company->ID, 'cs_company_description', true );
									if ( ! $desc ) {
										$desc = $company->post_content;
									}
									$desc = wp_trim_words( $desc, 25 );
									?>
									<label class="cs-checklist-item">
										<input type="checkbox" class="cs-check-portfolio" checked
											data-title="<?php echo esc_attr( $company->post_title ); ?>"
											data-sector="<?php echo esc_attr( $sect ); ?>"
											data-stage="<?php echo esc_attr( $stag ); ?>"
											data-logo="<?php echo esc_attr( $logo ); ?>"
											data-status="<?php echo esc_attr( $status ); ?>"
											data-desc="<?php echo esc_attr( $desc ); ?>">
										<span><?php echo esc_html( $company->post_title ); ?></span>
									</label>
								<?php endforeach; ?>
							<?php endif; ?>
						</div>
					</div>

					<div class="cs-composer-section">
						<h3><?php esc_html_e( 'Pitch Nights', 'cherrystone-blocks' ); ?></h3>
						<div class="cs-checklist">
							<?php if ( empty( $recent_events ) ) : ?>
								<span style="font-size:11px; color:#9ca3af;"><?php esc_html_e( 'No pitch events found.', 'cherrystone-blocks' ); ?></span>
							<?php else : ?>
								<?php foreach ( $recent_events as $event ) : 
									$edate = get_post_meta( $event->ID, 'cs_event_date', true );
									$formatted_edate = $edate ? date_i18n( get_option( 'date_format' ), strtotime( $edate ) ) : '';
									$desc = wp_trim_words( $event->post_content, 25 );
									$url = get_post_meta( $event->ID, 'cs_registration_url', true );
									?>
									<label class="cs-checklist-item">
										<input type="checkbox" class="cs-check-event" checked
											data-title="<?php echo esc_attr( $event->post_title ); ?>"
											data-date="<?php echo esc_attr( $formatted_edate ); ?>"
											data-desc="<?php echo esc_attr( $desc ); ?>"
											data-url="<?php echo esc_url( $url ); ?>">
										<span><?php echo esc_html( $event->post_title ); ?></span>
									</label>
								<?php endforeach; ?>
							<?php endif; ?>
						</div>
					</div>

					<div class="cs-composer-section">
						<h3><?php esc_html_e( 'News Posts', 'cherrystone-blocks' ); ?></h3>
						<div class="cs-checklist">
							<?php if ( empty( $recent_posts ) ) : ?>
								<span style="font-size:11px; color:#9ca3af;"><?php esc_html_e( 'No posts found.', 'cherrystone-blocks' ); ?></span>
							<?php else : ?>
								<?php foreach ( $recent_posts as $post ) : 
									$desc = wp_trim_words( $post->post_content, 25 );
									?>
									<label class="cs-checklist-item">
										<input type="checkbox" class="cs-check-news" checked
											data-title="<?php echo esc_attr( $post->post_title ); ?>"
											data-desc="<?php echo esc_attr( $desc ); ?>"
											data-url="<?php echo esc_url( get_permalink( $post ) ); ?>">
										<span><?php echo esc_html( $post->post_title ); ?></span>
									</label>
								<?php endforeach; ?>
							<?php endif; ?>
						</div>
					</div>
				</div>

				<!-- Visual Preview Panel (Right Column) -->
				<div class="cs-composer-preview">
					<div class="cs-preview-header">
						<span style="font-weight:700; font-size:14px; color:var(--cs-navy);"><?php esc_html_e( 'Interactive Draft Preview', 'cherrystone-blocks' ); ?></span>
						<div class="cs-preview-tabs">
							<button type="button" class="cs-preview-tab-btn is-active" data-preview-tab="visual"><?php esc_html_e( 'Visual Email Preview', 'cherrystone-blocks' ); ?></button>
							<button type="button" class="cs-preview-tab-btn" data-preview-tab="text"><?php esc_html_e( 'Plain Text Output', 'cherrystone-blocks' ); ?></button>
							<button type="button" class="cs-preview-tab-btn" data-preview-tab="html"><?php esc_html_e( 'HTML Source', 'cherrystone-blocks' ); ?></button>
						</div>
					</div>
					
					<!-- Simulated email headers -->
					<div class="cs-preview-client-bar">
						<div class="cs-preview-client-row">
							<strong><?php esc_html_e( 'Subject:', 'cherrystone-blocks' ); ?></strong> <span id="cs-news-preview-subject"></span>
						</div>
						<div class="cs-preview-client-row">
							<strong><?php esc_html_e( 'From:', 'cherrystone-blocks' ); ?></strong> info@cherrystoneangelgroup.com
						</div>
					</div>

					<!-- Visual body preview (rendered inside iframe) -->
					<div class="cs-preview-body is-active" id="cs-news-preview-visual-container">
						<iframe id="cs-newsletter-preview-iframe"></iframe>
					</div>

					<!-- Plain text output -->
					<textarea class="cs-preview-text-output" id="cs-newsletter-text-textarea" readonly></textarea>

					<!-- HTML source code output -->
					<textarea class="cs-preview-html-output" id="cs-newsletter-html-textarea" readonly></textarea>

					<!-- Action buttons -->
					<div class="cs-preview-header" style="background:#fff; border-top:1px solid var(--cs-border); border-bottom:none; padding:16px;">
						<div></div>
						<div>
							<button type="button" class="button" id="cs-copy-plain-btn" style="margin-right:8px;"><?php esc_html_e( 'Copy Plain Text', 'cherrystone-blocks' ); ?></button>
							<button type="button" class="button button-primary" id="cs-copy-html-btn"><?php esc_html_e( 'Copy HTML Code', 'cherrystone-blocks' ); ?></button>
						</div>
					</div>
				</div>

			</div>
		</div>

		<!-- TAB 4: GENERAL & BRAND SETTINGS -->
		<div class="cs-tab-content" id="tab-settings">
			<div class="cs-settings-panel">
				<h2><?php esc_html_e( 'General & Brand Settings', 'cherrystone-blocks' ); ?></h2>
				<p class="description" style="margin-bottom:24px;"><?php esc_html_e( 'Define central application emails, portal descriptions, and resource links used across Cherrystone Blocks.', 'cherrystone-blocks' ); ?></p>
				
				<form method="post" action="options.php">
					<?php settings_fields( 'cherrystone_blocks_brand_settings' ); ?>
					
					<div class="cs-settings-form-row">
						<label for="brand_founder_email"><?php esc_html_e( 'Default Founder Application Email', 'cherrystone-blocks' ); ?></label>
						<input type="email" id="brand_founder_email" name="cherrystone_blocks_brand_settings[founder_application_email]" value="<?php echo esc_attr( $brand['founder_application_email'] ); ?>" class="regular-text">
						<p class="description"><?php esc_html_e( 'Default email destination when founders submit the Application block.', 'cherrystone-blocks' ); ?></p>
					</div>

					<div class="cs-settings-form-row">
						<label for="brand_founder_wpforms_id"><?php esc_html_e( 'Founder Application WPForms ID', 'cherrystone-blocks' ); ?></label>
						<input type="number" min="1" step="1" id="brand_founder_wpforms_id" name="cherrystone_blocks_brand_settings[founder_wpforms_id]" value="<?php echo $brand['founder_wpforms_id'] ? esc_attr( $brand['founder_wpforms_id'] ) : ''; ?>" class="small-text">
						<p class="description"><?php esc_html_e( 'Optional. When set, the Apply page renders this WPForms form inside the Cherrystone application section. Leave blank to use the built-in email-draft fallback form.', 'cherrystone-blocks' ); ?></p>
					</div>

					<div class="cs-settings-form-row">
						<label for="brand_member_email"><?php esc_html_e( 'Default Member Interest Email', 'cherrystone-blocks' ); ?></label>
						<input type="email" id="brand_member_email" name="cherrystone_blocks_brand_settings[member_interest_email]" value="<?php echo esc_attr( $brand['member_interest_email'] ); ?>" class="regular-text">
						<p class="description"><?php esc_html_e( 'Default email destination when prospective angels submit the Member Interest block.', 'cherrystone-blocks' ); ?></p>
					</div>

					<div class="cs-settings-form-row">
						<label for="brand_slack_url"><?php esc_html_e( 'Slack Invite link', 'cherrystone-blocks' ); ?></label>
						<input type="url" id="brand_slack_url" name="cherrystone_blocks_brand_settings[slack_invite_url]" value="<?php echo esc_attr( $brand['slack_invite_url'] ); ?>" class="regular-text">
						<p class="description"><?php esc_html_e( 'URL for internal Slack community access buttons.', 'cherrystone-blocks' ); ?></p>
					</div>

					<div class="cs-settings-form-row">
						<label for="brand_pitch_url"><?php esc_html_e( 'External Pitch Application Link', 'cherrystone-blocks' ); ?></label>
						<input type="url" id="brand_pitch_url" name="cherrystone_blocks_brand_settings[pitch_application_url]" value="<?php echo esc_attr( $brand['pitch_application_url'] ); ?>" class="regular-text">
						<p class="description"><?php esc_html_e( 'Redirect URL for pitch applications if utilizing external pipelines.', 'cherrystone-blocks' ); ?></p>
					</div>

					<div class="cs-settings-form-row">
						<label for="brand_portal_banner"><?php esc_html_e( 'Member Portal Welcome Announcement', 'cherrystone-blocks' ); ?></label>
						<textarea id="brand_portal_banner" name="cherrystone_blocks_brand_settings[member_portal_banner]" rows="3" class="large-text"><?php echo esc_textarea( $brand['member_portal_banner'] ); ?></textarea>
						<p class="description"><?php esc_html_e( 'Welcome announcement displayed dynamically at the top of the Member Portal dashboard.', 'cherrystone-blocks' ); ?></p>
					</div>

					<?php submit_button(); ?>
				</form>
			</div>
		</div>

		<!-- self-contained Javascript interaction script -->
		<script>
			document.addEventListener('DOMContentLoaded', function() {
				// ── TAB SWITCHING LOGIC ──
				const container = document.querySelector('.cherrystone-blocks-admin');
				let activeTab = container.dataset.activeTab || 'dashboard';

				const tabBtns = document.querySelectorAll('.cs-tab-btn');
				const tabContents = document.querySelectorAll('.cs-tab-content');

				function switchTab(tabId) {
					tabBtns.forEach(btn => {
						if (btn.dataset.tab === tabId) {
							btn.classList.add('is-active');
						} else {
							btn.classList.remove('is-active');
						}
					});

					tabContents.forEach(content => {
						if (content.id === `tab-${tabId}`) {
							content.classList.add('is-active');
						} else {
							content.classList.remove('is-active');
						}
					});

					// Update URL parameters without reloading
					const url = new URL(window.location);
					url.searchParams.set('tab', tabId);
					window.history.replaceState({}, '', url);
				}

				tabBtns.forEach(btn => {
					btn.addEventListener('click', function() {
						switchTab(btn.dataset.tab);
					});
				});

				// Initialize
				switchTab(activeTab);


				// ── IMPACT METRICS ROW BUILDER LOGIC ──
				const metricsContainer = document.getElementById('cs-metric-rows-container');
				const addMetricBtn = document.getElementById('cs-add-metric-row-btn');
				const metricsForm = document.getElementById('cs-metrics-form');

				// Bind existing remove buttons
				function bindRemoveButtons() {
					document.querySelectorAll('.cs-btn-delete').forEach(btn => {
						btn.onclick = function() {
							const row = btn.closest('.cs-metric-row');
							if (row) row.remove();
						};
					});
				}
				bindRemoveButtons();

				// Add row function
				if (addMetricBtn && metricsContainer) {
					addMetricBtn.addEventListener('click', function() {
						const index = metricsContainer.children.length;
						const rowHtml = `
							<div class="cs-metric-row" data-index="${index}">
								<div class="cs-drag-handle">☰</div>
								<div>
									<input type="text" class="cs-metric-val" placeholder="e.g. 25+">
								</div>
								<div>
									<input type="text" class="cs-metric-lbl" placeholder="e.g. Active companies">
								</div>
								<div>
									<input type="text" class="cs-metric-nte" placeholder="e.g. Across software and life sciences">
								</div>
								<div>
									<button type="button" class="cs-row-btn cs-btn-delete" title="<?php esc_attr_e( 'Remove Row', 'cherrystone-blocks' ); ?>">×</button>
								</div>
							</div>
						`;
						metricsContainer.insertAdjacentHTML('beforeend', rowHtml);
						bindRemoveButtons();
					});
				}

				// Form Serialization before submit
				if (metricsForm) {
					metricsForm.addEventListener('submit', function() {
						const rows = document.querySelectorAll('.cs-metric-row');
						const lines = [];
						rows.forEach(row => {
							const val = row.querySelector('.cs-metric-val').value.trim();
							const lbl = row.querySelector('.cs-metric-lbl').value.trim();
							const nte = row.querySelector('.cs-metric-nte').value.trim();
							// Only add if val or lbl is entered
							if (val || lbl) {
								lines.push(`${val}|${lbl}|${nte}`);
							}
						});
						document.getElementById('cs-metrics-textarea').value = lines.join('\n');
					});
				}


				// ── NEWSLETTER COMPOSER INTERACTIVE LOGIC ──
				const subjectInput = document.getElementById('cs_news_subject_prefix');
				const greetingInput = document.getElementById('cs_news_greeting');
				const ctaInput = document.getElementById('cs_news_cta_label');
				const signoffInput = document.getElementById('cs_news_sign_off');
				const heroInput = document.getElementById('cs_news_hero_image');

				function escapeHtml(text) {
					return text
						.replace(/&/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;")
						.replace(/"/g, "&quot;")
						.replace(/'/g, "&#039;");
				}

				function updateNewsletter() {
					if (!subjectInput) return;

					const prefix  = subjectInput.value.trim();
					const greeting = greetingInput.value.trim();
					const cta      = ctaInput.value.trim();
					const signoff  = signoffInput.value.trim();
					const heroImage = heroInput ? heroInput.value.trim() : 'https://newengland.com/wp-content/uploads/2026/02/YK0326_7-TRAVEL-Providence-RI-Cherry-Blossoms-1024x683.jpg.webp';

					const subject = `${prefix} - portfolio, pitch nights, and member notes`;
					document.getElementById('cs-news-preview-subject').textContent = subject;

					// Category structures
					let portfolioCategories = {};
					let portfolioText = '';
					document.querySelectorAll('.cs-check-portfolio:checked').forEach(cb => {
						const title = cb.dataset.title || '';
						const sector = cb.dataset.sector || '';
						const stage = cb.dataset.stage || '';
						const logo = cb.dataset.logo || '';
						const desc = cb.dataset.desc || '';
						let status = cb.dataset.status || 'Portfolio Updates';
						if (!status.trim()) { status = 'Portfolio Updates'; }

						if (!portfolioCategories[status]) { portfolioCategories[status] = []; }

						const details = [sector, stage].filter(Boolean).join(' / ');
						
						let itemHtml = `
    <tr>
      <td style="padding:0 36px 24px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-left:3px solid #C8A05C;padding:2px 0 2px 14px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:top;">
                    <p style="font-family:Georgia,serif;font-size:18px;line-height:24px;color:#094266;margin:0 0 4px 0;font-weight:bold;">
                      ${escapeHtml(title)}
                    </p>
                    <p style="font-family:Georgia,serif;font-size:13px;color:#6B6B6B;margin:0 0 8px 0;font-style:italic;">
                      ${escapeHtml(details)}
                    </p>
                    <p style="font-family:Georgia,serif;font-size:15px;line-height:24px;color:#2A2A2A;margin:0;">
                      ${escapeHtml(desc)}
                    </p>
                  </td>`;
                  		if (logo) {
						itemHtml += `
                  <td style="vertical-align:middle;text-align:center;padding-left:12px;width:130px;">
                    <img src="${escapeHtml(logo)}" alt="${escapeHtml(title)}" width="80" style="display:block;max-width:80px;height:auto;border:0;margin:0 auto;">
                  </td>`;
                  		}
                  		itemHtml += `
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

						portfolioCategories[status].push(itemHtml);
						portfolioText += `- ${title} - ${details}\n`;
					});

					// Events Selection
					let eventsHtml = '';
					let eventsText = '';
					document.querySelectorAll('.cs-check-event:checked').forEach(cb => {
						const title = cb.dataset.title;
						const date = cb.dataset.date;
						const desc = cb.dataset.desc || '';
						const url = cb.dataset.url || '';
						
						eventsHtml += `
    <tr>
      <td style="padding:0 36px 24px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-left:3px solid #C8A05C;padding:2px 0 2px 14px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:top;">
                    <p style="font-family:Georgia,serif;font-size:18px;line-height:24px;color:#094266;margin:0 0 4px 0;font-weight:bold;">
                      ${escapeHtml(title)}
                    </p>
                    <p style="font-family:Georgia,serif;font-size:13px;color:#6B6B6B;margin:0 0 8px 0;font-style:italic;">
                      ${escapeHtml(date)}
                    </p>
                    <p style="font-family:Georgia,serif;font-size:15px;line-height:24px;color:#2A2A2A;margin:0;">
                      ${escapeHtml(desc)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
						eventsText += `- ${title} - ${date}\n`;
					});

					// News Selection
					let newsHtml = '';
					let newsText = '';
					document.querySelectorAll('.cs-check-news:checked').forEach(cb => {
						const title = cb.dataset.title;
						const desc = cb.dataset.desc || '';
						const url = cb.dataset.url;
						
						newsHtml += `
    <tr>
      <td style="padding:0 36px 24px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-left:3px solid #C8A05C;padding:2px 0 2px 14px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:top;">
                    <p style="font-family:Georgia,serif;font-size:18px;line-height:24px;color:#094266;margin:0 0 4px 0;font-weight:bold;">
                      <a href="${escapeHtml(url)}" style="color:#094266;text-decoration:none;">${escapeHtml(title)}</a>
                    </p>
                    <p style="font-family:Georgia,serif;font-size:15px;line-height:24px;color:#2A2A2A;margin:0;">
                      ${escapeHtml(desc)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
						newsText += `- ${title}: ${url}\n`;
					});

					// Build Plain Text Output
					let plainText = `Subject: ${subject}\n\n`;
					plainText += `${greeting}\n\n`;
					plainText += `Here are the latest updates from the Cherrystone network.\n\n`;
					
					if (portfolioText) {
						plainText += `Portfolio updates\n${portfolioText}\n`;
					}
					if (eventsText) {
						plainText += `Upcoming events\n${eventsText}\n`;
					}
					if (newsText) {
						plainText += `News and notes\n${newsText}\n`;
					}
					if (cta) {
						plainText += `${cta}\n\n`;
					}
					plainText += `${signoff}`;
					document.getElementById('cs-newsletter-text-textarea').value = plainText;

					// Build HTML Code Output
					let htmlOutput = `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
</head>
<body>
<div style="background:#EDF1F5;padding:24px 0;font-family:Georgia,'Times New Roman',serif;color:#2A2A2A;">
  <table align="center" cellpadding="0" cellspacing="0" border="0" width="600"
    style="width:600px;max-width:600px;background:#FFFFFF;border:1px solid #D6DEE6;">

    <!-- ============ HEADER ============ -->
    <tr>
      <td style="background:#094266;padding:28px 32px 22px 32px;border-bottom:4px solid #C8A05C;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="vertical-align:middle;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <p
                      style="font-family:Georgia,serif;color:#E6EDF3;font-size:13px;letter-spacing:3px;text-transform:uppercase;margin:0 0 6px 0;">
                      Cherrystone Angel Group
                    </p>
                    <p
                      style="font-family:Georgia,serif;color:#FFFFFF;font-size:30px;line-height:36px;font-weight:normal;letter-spacing:0.5px;margin:0 0 6px 0;">
                      The Cherrystone Chronicle
                    </p>
                    <p style="font-family:Georgia,serif;color:#E9C893;font-size:14px;font-style:italic;margin:0;">
                      Newsletter Update &nbsp;&middot;&nbsp; Member Edition
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ============ HERO IMAGE ============ -->
    <tr>
      <td style="padding:0;margin:0;line-height:0;font-size:0;">
        <img src="${escapeHtml(heroImage)}" alt="Cherrystone" width="600" height="190" style="display:block;width:600px;max-width:600px;height:190px;object-fit:cover;border:0;">
      </td>
    </tr>

    <!-- ============ INTRO ============ -->
    <tr>
      <td style="padding:32px 36px 8px 36px;">
        <p style="font-family:Georgia,serif;font-size:16px;line-height:26px;color:#2A2A2A;margin:0 0 14px 0;">
          ${escapeHtml(greeting)}
        </p>
        <p style="font-family:Georgia,serif;font-size:16px;line-height:26px;color:#2A2A2A;margin:0 0 14px 0;">
          Here are the latest updates from the Cherrystone network.
        </p>
      </td>
    </tr>`;

					let isFirstCategory = true;
					for (const [categoryName, items] of Object.entries(portfolioCategories)) {
						htmlOutput += `
    <!-- divider -->
    <tr>
      <td style="padding:28px 36px 0 36px;">
        <div style="border-top:1px solid #D6DEE6;"></div>
      </td>
    </tr>
    <!-- ============ PORTFOLIO SPOTLIGHT ============ -->
    <tr>
      <td style="padding:24px 36px 0 36px;">
        <p
          style="font-family:Georgia,serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#094266;margin:0 0 4px 0;">
          Portfolio Updates
        </p>
        <h2
          style="font-family:Georgia,serif;font-size:22px;line-height:28px;color:#2A2A2A;margin:0 0 14px 0;font-weight:normal;">
          ${escapeHtml(categoryName)}
        </h2>
      </td>
    </tr>
`;
						htmlOutput += items.join("\n");
					}

					if (eventsHtml) {
						htmlOutput += `
    <!-- divider -->
    <tr>
      <td style="padding:28px 36px 0 36px;">
        <div style="border-top:1px solid #D6DEE6;"></div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 36px 0 36px;">
        <h2
          style="font-family:Georgia,serif;font-size:22px;line-height:28px;color:#2A2A2A;margin:0 0 14px 0;font-weight:normal;">
          Upcoming Events
        </h2>
      </td>
    </tr>
`;
						htmlOutput += eventsHtml;
					}

					if (newsHtml) {
						htmlOutput += `
    <!-- divider -->
    <tr>
      <td style="padding:28px 36px 0 36px;">
        <div style="border-top:1px solid #D6DEE6;"></div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 36px 0 36px;">
        <h2
          style="font-family:Georgia,serif;font-size:22px;line-height:28px;color:#2A2A2A;margin:0 0 14px 0;font-weight:normal;">
          News & Notes
        </h2>
      </td>
    </tr>
`;
						htmlOutput += newsHtml;
					}

					htmlOutput += `
    <tr>
      <td style="padding:24px 36px 24px 36px; text-align:center;">
        <a href="#" style="background-color:#094266;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:4px;font-family:Georgia,serif;font-size:16px;">
          ${escapeHtml(cta)}
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 36px 32px 36px;">
        <p style="font-family:Georgia,serif;font-size:16px;line-height:26px;color:#2A2A2A;margin:0;white-space:pre-wrap;">${escapeHtml(signoff)}</p>
      </td>
    </tr>
  </table>
</div>
</body>
</html>`;

					document.getElementById('cs-newsletter-html-textarea').value = htmlOutput;

					// Update iframe rendering
					const iframe = document.getElementById('cs-newsletter-preview-iframe');
					if (iframe) {
						const doc = iframe.contentDocument || iframe.contentWindow.document;
						doc.open();
						doc.write(htmlOutput);
						doc.close();
					}
				}

				// Bind change events
				const inputsToBind = [subjectInput, greetingInput, ctaInput, signoffInput, heroInput];
				inputsToBind.forEach(input => {
					if (input) {
						input.addEventListener('input', updateNewsletter);
					}
				});
				
				document.querySelectorAll('.cs-check-portfolio, .cs-check-event, .cs-check-news').forEach(cb => {
					cb.addEventListener('change', updateNewsletter);
				});

				// Initialize preview
				updateNewsletter();


				// ── COMPOSER TAB SWITCHES (VISUAL vs PLAIN vs HTML SOURCE) ──
				const composerTabBtns = document.querySelectorAll('.cs-preview-tab-btn');
				const visContainer = document.getElementById('cs-news-preview-visual-container');
				const textOutput = document.getElementById('cs-newsletter-text-textarea');
				const htmlOutput = document.getElementById('cs-newsletter-html-textarea');

				composerTabBtns.forEach(btn => {
					btn.addEventListener('click', function() {
						composerTabBtns.forEach(b => b.classList.remove('is-active'));
						btn.classList.add('is-active');

						const tab = btn.dataset.previewTab;
						if (tab === 'visual') {
							visContainer.classList.add('is-active');
							textOutput.classList.remove('is-active');
							htmlOutput.classList.remove('is-active');
						} else if (tab === 'text') {
							visContainer.classList.remove('is-active');
							textOutput.classList.add('is-active');
							htmlOutput.classList.remove('is-active');
						} else if (tab === 'html') {
							visContainer.classList.remove('is-active');
							textOutput.classList.remove('is-active');
							htmlOutput.classList.add('is-active');
						}
					});
				});


				// ── COPY TO CLIPBOARD BUTTON ACTIONS ──
				const copyPlainBtn = document.getElementById('cs-copy-plain-btn');
				const copyHtmlBtn = document.getElementById('cs-copy-html-btn');

				if (copyPlainBtn) {
					copyPlainBtn.addEventListener('click', function() {
						const text = textOutput.value;
						navigator.clipboard.writeText(text).then(() => {
							const originalText = copyPlainBtn.textContent;
							copyPlainBtn.textContent = '✓ Copied!';
							copyPlainBtn.style.color = '#10b981';
							setTimeout(() => {
								copyPlainBtn.textContent = originalText;
								copyPlainBtn.style.color = '';
							}, 2000);
						});
					});
				}

				if (copyHtmlBtn) {
					copyHtmlBtn.addEventListener('click', function() {
						const code = htmlOutput.value;
						navigator.clipboard.writeText(code).then(() => {
							const originalText = copyHtmlBtn.textContent;
							copyHtmlBtn.textContent = '✓ Copied!';
							copyHtmlBtn.style.backgroundColor = '#10b981';
							copyHtmlBtn.style.borderColor = '#10b981';
							setTimeout(() => {
								copyHtmlBtn.textContent = originalText;
								copyHtmlBtn.style.backgroundColor = '';
								copyHtmlBtn.style.borderColor = '';
							}, 2000);
						});
					});
				}

			});
		</script>
	</div>
	<?php
}

/**
 * Perform a one-time cleanup to delete old cherry_people and cherry_testimonial posts.
 */
function cherrystone_blocks_temp_cleanup() {
	if ( ! get_option( 'cherrystone_cleanup_deleted_old_cpts_v3' ) ) {
		$people = get_posts( array(
			'post_type'      => 'cherry_people',
			'posts_per_page' => -1,
			'post_status'    => 'any',
		) );
		foreach ( $people as $p ) {
			wp_delete_post( $p->ID, true );
		}

		update_option( 'cherrystone_cleanup_deleted_old_cpts_v3', '1' );
	}
}
add_action( 'admin_init', 'cherrystone_blocks_temp_cleanup' );
