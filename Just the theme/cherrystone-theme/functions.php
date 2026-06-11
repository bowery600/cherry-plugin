<?php
/**
 * Cherrystone theme bootstrap.
 *
 * A full-site-editing block theme that hosts the Cherrystone Blocks plugin.
 *
 * @package Cherrystone
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
define( 'CHERRYSTONE_THEME_VERSION', '1.1.1' );

/**
 * Theme supports. Most block-theme features are opt-in via theme.json,
 * but a few still need to be declared here.
 */
function cherrystone_theme_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'custom-logo', array(
		'height'      => 48,
		'width'       => 200,
		'flex-height' => true,
		'flex-width'  => true,
	) );

	// Brand fonts also styled inside the editor canvas. The remote font
	// stylesheet is added so EB Garamond / Inter Tight render in the editor
	// to match the front end.
	add_editor_style( array(
		'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
		'assets/css/theme.css',
	) );

	load_theme_textdomain( 'cherrystone', get_template_directory() . '/languages' );

	register_nav_menus( array(
		'primary' => __( 'Primary Navigation', 'cherrystone' ),
		'footer'  => __( 'Footer Navigation', 'cherrystone' ),
	) );
}
add_action( 'after_setup_theme', 'cherrystone_theme_setup' );

/**
 * Load brand fonts and the theme stylesheet on the front end.
 *
 * Fonts mirror the Cherrystone Blocks plugin so block and theme chrome
 * render with the same type even when no block is present on a page.
 */
function cherrystone_theme_enqueue_assets() {
	wp_enqueue_style(
		'cherrystone-theme-fonts',
		'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'cherrystone-theme-style',
		get_template_directory_uri() . '/assets/css/theme.css',
		array( 'cherrystone-theme-fonts' ),
		CHERRYSTONE_THEME_VERSION
	);
}
add_action( 'wp_enqueue_scripts', 'cherrystone_theme_enqueue_assets' );

/**
 * Prefer the bundled Cherrystone favicon from the current public brand site.
 */
function cherrystone_theme_favicon() {
	$favicon_url = get_template_directory_uri() . '/assets/img/favicon.ico';
	echo '<link rel="icon" type="image/x-icon" href="' . esc_url( $favicon_url ) . '">' . "\n";
	echo '<link rel="shortcut icon" type="image/x-icon" href="' . esc_url( $favicon_url ) . '">' . "\n";
}
add_action( 'wp_head', 'cherrystone_theme_favicon', 5 );
add_action( 'admin_head', 'cherrystone_theme_favicon', 5 );

/**
 * Preconnect to Google Fonts for faster first paint.
 */
function cherrystone_theme_resource_hints( $hints, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$hints[] = array( 'href' => 'https://fonts.googleapis.com' );
		$hints[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' );
	}
	return $hints;
}
add_filter( 'wp_resource_hints', 'cherrystone_theme_resource_hints', 10, 2 );

/**
 * Register a pattern category so theme patterns group with the brand.
 */
function cherrystone_theme_register_pattern_category() {
	if ( function_exists( 'register_block_pattern_category' ) ) {
		register_block_pattern_category( 'cherrystone', array(
			'label' => __( 'Cherrystone', 'cherrystone' ),
		) );
	}
}
add_action( 'init', 'cherrystone_theme_register_pattern_category' );



