<?php
/**
 * Server render for the Communications page template.
 *
 * The Communications page is composed entirely in code so the layout stays in
 * sync with the plugin without re-saving the page in the editor or re-importing
 * content. The page is a single calm record of fund activity: a quiet hero with
 * live counts, one filterable feed of every published communication, upcoming
 * pitch nights, the resource library, a one-line digest signup, and the
 * site-wide footer CTA. Content-managed sections (pitch nights, resources)
 * are delegated to their own dynamic blocks via do_blocks() and only included
 * when their custom post type has matching published content.
 *
 * @var array    $attributes Block attributes (unused).
 * @var string   $content    Saved inner content (ignored; dynamic block).
 * @var WP_Block $block      Block instance.
 *
 * @package CherrystoneBlocks
 */

if ( ! function_exists( 'cherrystone_comms_shell_arcs' ) ) {
	/**
	 * Concentric shell-arc motif used in the page hero graphic.
	 *
	 * @param string       $color   Stroke color (CSS value).
	 * @param float|string $opacity Layer opacity.
	 * @return string SVG markup.
	 */
	function cherrystone_comms_shell_arcs( $color = 'var(--accent)', $opacity = '0.32' ) {
		$paths = '';
		for ( $i = 0; $i < 14; $i++ ) {
			$paths .= sprintf(
				'<path d="M %d 380 Q 200 %d %d 380" />',
				20 + $i * 5,
				380 - ( $i + 1 ) * 22,
				380 - $i * 5
			);
		}
		return sprintf(
			'<svg class="shell-anim" viewBox="0 0 400 400" style="width:100%%;height:100%%;opacity:%s" aria-hidden="true"><g stroke="%s" fill="none" stroke-width="1">%s</g></svg>',
			esc_attr( $opacity ),
			esc_attr( $color ),
			$paths
		);
	}
}

if ( ! function_exists( 'cherrystone_comms_mesh' ) ) {
	/**
	 * Soft mesh-gradient blob motif.
	 *
	 * @param float|string $opacity Layer opacity.
	 * @return string HTML markup.
	 */
	function cherrystone_comms_mesh( $opacity = '0.35' ) {
		return sprintf(
			'<div class="mesh-gradient" aria-hidden="true" style="opacity:%s"><span class="mesh-blob mesh-blob-1"></span><span class="mesh-blob mesh-blob-2"></span><span class="mesh-blob mesh-blob-3"></span></div>',
			esc_attr( $opacity )
		);
	}
}

if ( ! function_exists( 'cherrystone_comms_wave' ) ) {
	/**
	 * Layered wave-line motif.
	 *
	 * @param string       $color   Stroke color.
	 * @param float|string $opacity Layer opacity.
	 * @return string SVG markup.
	 */
	function cherrystone_comms_wave( $color = '#ffffff', $opacity = '1' ) {
		return sprintf(
			'<svg class="wave-anim" viewBox="0 0 1200 600" preserveAspectRatio="none" style="width:100%%;height:100%%;opacity:%s" aria-hidden="true"><g stroke="%s" fill="none" stroke-width="1"><path d="M 0,300 Q 150,220 300,300 T 600,300 T 900,300 T 1200,300" /><path d="M 0,330 Q 150,250 300,330 T 600,330 T 900,330 T 1200,330" opacity="0.6" /><path d="M 0,410 Q 180,300 360,410 T 720,410 T 1080,410 T 1440,410" opacity="0.5" /><path d="M 0,500 Q 200,370 400,500 T 800,500 T 1200,500 T 1600,500" opacity="0.35" /></g></svg>',
			esc_attr( $opacity ),
			esc_attr( $color )
		);
	}
}

if ( ! function_exists( 'cherrystone_comms_has_posts' ) ) {
	/**
	 * Whether a custom post type has at least one published post.
	 *
	 * @param string $post_type  Post type slug.
	 * @param array  $extra_args Extra WP_Query args (e.g. meta_query).
	 * @return bool
	 */
	function cherrystone_comms_has_posts( $post_type, $extra_args = array() ) {
		$ids = get_posts(
			array_merge(
				array(
					'post_type'      => $post_type,
					'post_status'    => 'publish',
					'posts_per_page' => 1,
					'fields'         => 'ids',
					'no_found_rows'  => true,
				),
				$extra_args
			)
		);
		return ! empty( $ids );
	}
}

/* ---------------------------------------------------------------------------
 * Gather live content up front so the hero and the feed share one query.
 * ------------------------------------------------------------------------- */
$communications = get_posts(
	array(
		'post_type'      => 'cherry_communication',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => 'date',
		'order'          => 'DESC',
	)
);

$upcoming_events = get_posts(
	array(
		'post_type'      => 'cherry_pitch_event',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'meta_query'     => array(
			array(
				'key'     => 'cs_event_date',
				'value'   => gmdate( 'Y-m-d' ),
				'compare' => '>=',
				'type'    => 'DATE',
			),
		),
	)
);

$resource_count = 0;
$resource_ids   = get_posts(
	array(
		'post_type'      => 'cherry_resource',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'fields'         => 'ids',
		'no_found_rows'  => true,
	)
);
$resource_count = count( $resource_ids );

/* Distinct categories across the feed, ordered by frequency. */
$category_counts = array();
foreach ( $communications as $comm ) {
	$cat = get_post_meta( $comm->ID, 'cs_communication_category', true );
	if ( ! $cat ) {
		$cat = 'News';
	}
	if ( ! isset( $category_counts[ $cat ] ) ) {
		$category_counts[ $cat ] = 0;
	}
	$category_counts[ $cat ]++;
}
arsort( $category_counts );

/* ---------------------------------------------------------------------------
 * Section 1 — Page hero (quiet, with a live ledger line)
 * ------------------------------------------------------------------------- */
$meta_bits = array();
if ( count( $communications ) > 0 ) {
	/* translators: %d: number of published updates. */
	$meta_bits[] = sprintf( _n( '%d update', '%d updates', count( $communications ), 'cherrystone-blocks' ), count( $communications ) );
}
if ( count( $upcoming_events ) > 0 ) {
	/* translators: %d: number of upcoming pitch nights. */
	$meta_bits[] = sprintf( _n( '%d upcoming pitch night', '%d upcoming pitch nights', count( $upcoming_events ), 'cherrystone-blocks' ), count( $upcoming_events ) );
}
if ( $resource_count > 0 ) {
	/* translators: %d: number of published resources. */
	$meta_bits[] = sprintf( _n( '%d resource', '%d resources', $resource_count, 'cherrystone-blocks' ), $resource_count );
}

$hero  = '<section class="page-hero with-graphic">';
$hero .= '<div class="page-hero-graphic">' . cherrystone_comms_shell_arcs( 'var(--accent)', '0.32' ) . '</div>';
$hero .= '<div class="container">';
$hero .= '<span class="eyebrow accent">Communications</span>';
$hero .= '<h1 style="margin-top:24px;">From the fund,<br>to our network.</h1>';
$hero .= '<p class="lede">Announcements, letters, and resources from Cherrystone &mdash; kept simple and kept current for our members, founders, and co-investors.</p>';
if ( ! empty( $meta_bits ) ) {
	$hero .= '<div class="comms-hero-meta mono">' . esc_html( implode( '  ·  ', $meta_bits ) ) . '</div>';
}
$hero .= '</div></section>';

/* ---------------------------------------------------------------------------
 * Section 2 — The feed: every communication, filterable by category.
 * All rows are server-rendered (SEO / no-JS); frontend.js collapses the list
 * to a first page and wires the category chips and "show more" control.
 * ------------------------------------------------------------------------- */
$feed = '';
if ( ! empty( $communications ) ) {
	$feed  = '<section class="block warm comms-feed-section"><div class="container">';
	$feed .= '<div class="block-head"><div>';
	$feed .= '<span class="eyebrow accent">Updates</span>';
	$feed .= '<h2 style="margin-top:24px;">The latest from Cherrystone.</h2>';
	$feed .= '</div><p class="lede">Portfolio milestones, exits, pitch night news, and notes from leadership &mdash; the full record, in one place.</p></div>';

	if ( count( $category_counts ) > 1 ) {
		$feed .= '<div class="portfolio-controls comms-feed-tabs" role="group" aria-label="' . esc_attr__( 'Filter updates by category', 'cherrystone-blocks' ) . '">';
		$feed .= '<button class="chip active" data-filter="all">' . esc_html__( 'All', 'cherrystone-blocks' ) . '<span class="chip-count mono">' . esc_html( count( $communications ) ) . '</span></button>';
		foreach ( $category_counts as $cat_name => $cat_count ) {
			$filter_val = strtolower( str_replace( ' ', '-', $cat_name ) );
			$feed      .= '<button class="chip" data-filter="' . esc_attr( $filter_val ) . '">' . esc_html( $cat_name ) . '<span class="chip-count mono">' . esc_html( $cat_count ) . '</span></button>';
		}
		$feed .= '</div>';
	}

	$feed .= '<div class="comms-feed" data-comms-feed data-visible-rows="8">';
	foreach ( $communications as $comm ) {
		$title        = get_the_title( $comm );
		$date_val     = get_post_meta( $comm->ID, 'cs_communication_date', true );
		$author       = get_post_meta( $comm->ID, 'cs_communication_author', true );
		$category_val = get_post_meta( $comm->ID, 'cs_communication_category', true );
		$source_url   = get_post_meta( $comm->ID, 'cs_communication_source_url', true );

		if ( ! $date_val ) {
			$date_val = get_the_date( 'M d, Y', $comm );
		}
		if ( ! $author ) {
			$author = 'Cherrystone Angel Group';
		}
		if ( ! $category_val ) {
			$category_val = 'News';
		}

		$url      = $source_url ? $source_url : get_permalink( $comm );
		$cat_slug = strtolower( str_replace( ' ', '-', $category_val ) );

		$feed .= '<a class="news-row" data-cat="' . esc_attr( $cat_slug ) . '" href="' . esc_url( $url ) . '"' . ( $source_url ? ' target="_blank" rel="noopener noreferrer"' : '' ) . '>';
		$feed .= '<span class="date">' . esc_html( $date_val ) . '</span>';
		$feed .= '<div><h4>' . esc_html( $title ) . '</h4><div class="byline">' . esc_html( $author ) . '</div></div>';
		$feed .= '<span class="cat">' . esc_html( $category_val ) . '</span>';
		$feed .= '<span class="arrow" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
		$feed .= '</a>';
	}
	$feed .= '</div>';
	$feed .= '</div></section>';
}

/* ---------------------------------------------------------------------------
 * Section 3 — Upcoming pitch nights (dynamic: cherry_pitch_event)
 * Section 4 — Resource library (dynamic: cherry_resource)
 * ------------------------------------------------------------------------- */
$events = '';
if ( ! empty( $upcoming_events ) ) {
	$events = do_blocks( '<!-- wp:cherrystone/events-list {"eyebrow":"Calendar","heading":"Upcoming Pitch Nights.","lede":"Where founders meet our members. Request an invitation or add a date to your calendar.","upcomingOnly":true} /-->' );
}

$resources = '';
if ( $resource_count > 0 ) {
	$resources = do_blocks( '<!-- wp:cherrystone/resource-cards {"eyebrow":"Resources","heading":"The library.","lede":"Letters, decks, and curated links for founders and members — updated as new material is published.","collapseAfter":9} /-->' );
}

/* ---------------------------------------------------------------------------
 * Section 5 — Digest signup (one quiet band; mailto-backed like site forms)
 * ------------------------------------------------------------------------- */
$digest  = '<section class="block digest-band-section"><div class="container">';
$digest .= '<div class="digest-band">';
$digest .= '<div class="digest-band-copy">';
$digest .= '<span class="eyebrow accent">Stay current</span>';
$digest .= '<h3>Get the Cherrystone digest.</h3>';
$digest .= '<p>A short monthly note &mdash; dealflow, portfolio wins, and pitch night recaps. No noise.</p>';
$digest .= '</div>';
$digest .= '<div class="digest-band-form-area">';
$digest .= '<form class="digest-band-form" data-comms-digest data-recipient="info@cherrystoneangelgroup.com" novalidate aria-label="' . esc_attr__( 'Digest signup', 'cherrystone-blocks' ) . '">';
$digest .= '<label class="sr-only" for="comms-digest-email">' . esc_html__( 'Email address', 'cherrystone-blocks' ) . '</label>';
$digest .= '<input type="email" id="comms-digest-email" name="email" class="newsletter-email-input" placeholder="' . esc_attr__( 'Your email address', 'cherrystone-blocks' ) . '" required />';
$digest .= '<button type="submit" class="btn btn-accent"><span>' . esc_html__( 'Subscribe', 'cherrystone-blocks' ) . '</span></button>';
$digest .= '</form>';
$digest .= '<p class="digest-band-note" data-comms-digest-note>' . esc_html__( 'Opens your mail client — we add you by hand, and you can leave anytime.', 'cherrystone-blocks' ) . '</p>';
$digest .= '</div>';
$digest .= '</div></div></section>';

/* ---------------------------------------------------------------------------
 * Section 6 — Footer CTA (site-wide pattern)
 * ------------------------------------------------------------------------- */
$cta_cards = array(
	array(
		'label'    => 'For founders',
		'title'    => 'Apply for capital',
		'body'     => 'One application, reviewed by our investment committee. We invest at pre-seed and seed across New England and the Northeast.',
		'ctaLabel' => 'Start application',
		'url'      => '/apply',
		'style'    => 'accent',
	),
	array(
		'label'    => 'For investors',
		'title'    => 'Become a member',
		'body'     => 'Join active members investing alongside operators, founders, and former exits. A brief conversation starts the process.',
		'ctaLabel' => 'Membership details',
		'url'      => '/members',
		'style'    => 'light',
	),
);

$arrow   = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>';
$footer  = '<div class="footer-cta">';
$footer .= cherrystone_comms_mesh( '0.45' );
$footer .= '<div style="position:absolute;inset:0;opacity:0.18;">' . cherrystone_comms_wave( '#ffffff', '1' ) . '</div>';
$footer .= '<div class="container footer-cta-inner">';
$footer .= '<span class="eyebrow" style="color:rgba(255,255,255,0.6);">Get involved</span>';
$footer .= '<h2 style="margin-top:24px;">Capital. Judgment. <em>Time.</em><br>Where founders need it.</h2>';
$footer .= '<div class="footer-cta-grid">';
foreach ( $cta_cards as $card ) {
	$btn_class = 'btn ' . ( 'light' === $card['style'] ? 'btn-light' : 'btn-accent' );
	$footer   .= '<div class="footer-card">';
	$footer   .= '<span class="mono" style="color:var(--accent);font-size:12px;letter-spacing:0.08em;">' . esc_html( $card['label'] ) . '</span>';
	$footer   .= '<h3>' . esc_html( $card['title'] ) . '</h3>';
	$footer   .= '<p>' . esc_html( $card['body'] ) . '</p>';
	$footer   .= '<a class="' . esc_attr( $btn_class ) . '" style="align-self:flex-start;" href="' . esc_url( $card['url'] ) . '"><span>' . esc_html( $card['ctaLabel'] ) . '</span>' . $arrow . '</a>';
	$footer   .= '</div>';
}
$footer .= '</div></div></div>';

/* ---------------------------------------------------------------------------
 * Compose
 * ------------------------------------------------------------------------- */
$page = $hero . $feed . $events . $resources . $digest . $footer;

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'cherrystone-page-template cherrystone-page-communications-template' )
);

// Output is captured from the buffer by WordPress's file-based block renderer,
// so the composed markup must be echoed (a return value would be discarded).
echo sprintf(
	'<div %1$s>%2$s</div>',
	$wrapper_attributes, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes().
	$page // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- composed from escaped values and rendered block output.
);
