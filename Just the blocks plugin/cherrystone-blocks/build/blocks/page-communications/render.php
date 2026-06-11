<?php
/**
 * Server render for the Communications page template.
 *
 * The Communications page is composed entirely in code so the layout stays in
 * sync with the plugin without re-saving the page in the editor or re-importing
 * content. Static section blocks (page hero, press showcase, featured letters,
 * newsletter, footer CTA) are reproduced here as markup; content-managed
 * sections (announcements, pitch nights, resources) are delegated to their own
 * dynamic blocks via do_blocks(), and are only included when their custom post
 * type has matching published content so the page never shows an empty section.
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
 * Section 1 — Page hero
 * ------------------------------------------------------------------------- */
$hero  = '<section class="page-hero with-graphic">';
$hero .= '<div class="page-hero-graphic">' . cherrystone_comms_shell_arcs( 'var(--accent)', '0.32' ) . '</div>';
$hero .= '<div class="container">';
$hero .= '<span class="eyebrow accent">Communications</span>';
$hero .= '<h1 style="margin-top:24px;">News, letters,<br>and resources.</h1>';
$hero .= '<p class="lede">Portfolio milestones, letters from leadership, press coverage, and Pitch Night announcements &mdash; collected in one place for founders, members, and co-investors.</p>';
$hero .= '</div></section>';

/* ---------------------------------------------------------------------------
 * Section 2 — Press / media coverage (static showcase)
 * ------------------------------------------------------------------------- */
$press_articles = array(
	array(
		'title'    => 'Cherrystone Angels lead $1.5M financing for Visiomed Therapeutics.',
		'source'   => 'Boston Business Journal',
		'date'     => 'May 12, 2026',
		'featured' => true,
	),
	array(
		'title'    => 'Rhode Island venture syndicate names new Diligence Committee chairs.',
		'source'   => 'Providence Journal',
		'date'     => 'April 28, 2026',
		'featured' => false,
	),
	array(
		'title'    => 'EcoCharge completes pilot deployment across regional delivery channels.',
		'source'   => 'CleanTech News',
		'date'     => 'March 15, 2026',
		'featured' => false,
	),
);

$press  = '<section class="block press-showcase-section"><div class="container">';
$press .= '<div class="block-head"><div>';
$press .= '<span class="eyebrow accent">Media coverage</span>';
$press .= '<h2 style="margin-top:24px;">Cherrystone in the press.</h2>';
$press .= '</div><p class="lede">Coverage of our exits, leadership announcements, and the founders breaking boundaries across New England.</p></div>';
$press .= '<div class="press-showcase-grid-layout">';
foreach ( $press_articles as $art ) {
	$press .= '<div class="press-news-card' . ( $art['featured'] ? ' is-featured-news' : '' ) . '"><div class="press-news-card-inner">';
	$press .= '<div class="press-news-meta mono">';
	$press .= '<span class="press-news-source">' . esc_html( $art['source'] ) . '</span>';
	$press .= '<span class="dot"></span>';
	$press .= '<span class="press-news-date">' . esc_html( $art['date'] ) . '</span>';
	$press .= '</div>';
	$press .= '<h3 class="press-news-title">' . esc_html( $art['title'] ) . '</h3>';
	$press .= '<div class="press-news-action-link"><span class="mono text-link">Read article</span></div>';
	$press .= '</div></div>';
}
$press .= '</div></div></section>';

/* ---------------------------------------------------------------------------
 * Section 3 — Letters from leadership (static editorial feature)
 * ------------------------------------------------------------------------- */
$side_posts = array(
	array(
		'date'  => 'May 12, 2026',
		'title' => 'Advanced Silicon Group raises priced seed round led by members',
		'cat'   => 'Portfolio News',
	),
	array(
		'date'  => 'April 28, 2026',
		'title' => 'Narragansett Brewery recapitalization secures regional growth',
		'cat'   => 'Portfolio News',
	),
);

$letters  = '<section class="block"><div class="container"><div class="featured-news-row">';
$letters .= '<div class="featured-editorial-card">';
$letters .= '<div class="featured-editorial-image-pane"><span class="featured-editorial-badge">Featured Story</span>';
$letters .= '<div class="featured-editorial-graphic-wrap">' . cherrystone_comms_wave( 'rgba(255, 255, 255, 0.15)', '0.8' ) . cherrystone_comms_mesh( '0.35' ) . '</div></div>';
$letters .= '<div class="featured-editorial-content">';
$letters .= '<div class="featured-editorial-meta"><span>Featured Letter</span><span class="dot"></span><span>May 30, 2026</span></div>';
$letters .= '<h3>Annual Letter to New England Founders &amp; Co-Investors</h3>';
$letters .= '<p>Reflecting on two decades of patient, operator-led capital. A deep dive into the current state of early-stage software, healthcare tech, and life sciences across Providence and Boston.</p>';
$letters .= '<span class="featured-editorial-cta">Read full letter &rarr;</span>';
$letters .= '</div></div>';
$letters .= '<div class="featured-news-sidebar"><h4 class="featured-sidebar-title">Recent Letters</h4>';
foreach ( $side_posts as $post ) {
	$letters .= '<div class="sidebar-post-card">';
	$letters .= '<span class="date">' . esc_html( $post['date'] ) . '</span>';
	$letters .= '<h4>' . esc_html( $post['title'] ) . '</h4>';
	$letters .= '<span class="cat">' . esc_html( $post['cat'] ) . '</span>';
	$letters .= '</div>';
}
$letters .= '</div></div></div></section>';

/* ---------------------------------------------------------------------------
 * Section 4 — Latest announcements (dynamic: cherry_communication)
 * Section 5 — Upcoming pitch nights (dynamic: cherry_pitch_event)
 * Section 6 — Resources & letters (dynamic: cherry_resource)
 * ------------------------------------------------------------------------- */
$news = '';
if ( cherrystone_comms_has_posts( 'cherry_communication' ) ) {
	$news = do_blocks( '<!-- wp:cherrystone/news-list {"eyebrow":"Latest updates","heading":"Announcements & member notes.","lede":"Portfolio milestones, member spotlights, and program updates from across the Cherrystone network.","maxItems":6} /-->' );
}

$events = '';
if ( cherrystone_comms_has_posts(
	'cherry_pitch_event',
	array(
		'meta_query' => array(
			array(
				'key'     => 'cs_event_date',
				'value'   => gmdate( 'Y-m-d' ),
				'compare' => '>=',
				'type'    => 'DATE',
			),
		),
	)
) ) {
	$events = do_blocks( '<!-- wp:cherrystone/events-list {"eyebrow":"Calendar","heading":"Upcoming Pitch Nights.","lede":"Where founders present to our members. Add these to your calendar or request an invitation.","upcomingOnly":true} /-->' );
}

$resources = do_blocks( '<!-- wp:cherrystone/resource-cards {"eyebrow":"Resources","heading":"Letters, decks, and member resources.","lede":"Curated documents and links for founders and members — updated as new material is published.","warm":true} /-->' );

/* ---------------------------------------------------------------------------
 * Section 7 — Newsletter signup (static)
 * ------------------------------------------------------------------------- */
$newsletter  = '<section class="block newsletter-section"><div class="container">';
$newsletter .= '<div class="block-head"><div>';
$newsletter .= '<span class="eyebrow accent">Stay connected</span>';
$newsletter .= '<h2 style="margin-top:24px;">Get the Cherrystone digest.</h2>';
$newsletter .= '</div><p class="lede">Monthly updates on dealflow, portfolio wins, pitch night recaps, and insights from our members &mdash; delivered straight to your inbox.</p></div>';
$newsletter .= '<div class="newsletter-signup-card">';
$newsletter .= '<div class="newsletter-stats">';
$newsletter .= '<div class="newsletter-stat-item"><span class="mono" style="font-size:32px;font-weight:700;color:var(--accent);line-height:1;">2,400+</span><span class="mono" style="font-size:11px;letter-spacing:0.08em;opacity:0.6;margin-top:4px;">Subscribers</span></div>';
$newsletter .= '<div class="newsletter-stat-item"><span class="mono" style="font-size:32px;font-weight:700;color:var(--accent);line-height:1;">12</span><span class="mono" style="font-size:11px;letter-spacing:0.08em;opacity:0.6;margin-top:4px;">Monthly editions</span></div>';
$newsletter .= '</div>';
$newsletter .= '<div class="newsletter-form-area"><form class="newsletter-input-row" aria-label="Newsletter signup">';
$newsletter .= '<label class="sr-only" for="newsletter-email-input">Email address</label>';
$newsletter .= '<input type="email" id="newsletter-email-input" class="newsletter-email-input" placeholder="Enter your email address" aria-describedby="newsletter-privacy-note" />';
$newsletter .= '<button type="submit" class="btn btn-accent"><span>Subscribe</span></button>';
$newsletter .= '</form><p id="newsletter-privacy-note" class="newsletter-privacy-note">We respect your privacy. Unsubscribe anytime.</p>';
$newsletter .= '</div></div></div></section>';

/* ---------------------------------------------------------------------------
 * Section 8 — Footer CTA (static)
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

$arrow  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>';
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
$page = $hero . $press . $letters . $news . $events . $resources . $newsletter . $footer;

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
