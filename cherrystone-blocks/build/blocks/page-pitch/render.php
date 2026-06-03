<?php
/**
 * Server render for the Pitch Night page template.
 *
 * Keeps the public Pitch page current even when the saved page content is a
 * self-closing page template block.
 *
 * @package CherrystoneBlocks
 */

$apply_url   = home_url( '/apply-for-capital' );
$sponsor_url = home_url( '/sponsors' );
$member_url  = home_url( '/member-interest' );

$events = get_posts(
	array(
		'post_type'      => 'cherry_pitch_event',
		'post_status'    => 'publish',
		'posts_per_page' => 1,
		'meta_key'       => 'cs_event_date',
		'orderby'        => 'meta_value',
		'order'          => 'ASC',
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

$event        = ! empty( $events ) ? $events[0] : null;
$event_iso    = $event ? get_post_meta( $event->ID, 'cs_event_date', true ) : '2026-10-21';
$timestamp    = $event_iso ? strtotime( $event_iso ) : false;
$event_day    = $timestamp ? gmdate( 'j', $timestamp ) : '21';
$event_month  = $timestamp ? gmdate( 'M Y', $timestamp ) : 'Oct 2026';
$event_title  = $event ? get_the_title( $event ) : 'Pitch Night 2026 - Annual';
$event_loc    = $event ? get_post_meta( $event->ID, 'cs_event_location', true ) : 'Providence, RI';
$event_type   = $event ? get_post_meta( $event->ID, 'cs_event_type', true ) : 'In-person';
$event_spots  = $event ? get_post_meta( $event->ID, 'cs_event_spots', true ) : '6-8 New England startups';
$event_reg    = $event ? get_post_meta( $event->ID, 'cs_registration_url', true ) : '';
$event_cta    = $event_reg ? $event_reg : $apply_url;
$event_target = $event_reg ? ' target="_blank" rel="noopener noreferrer"' : '';

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'cherrystone-page-template cherrystone-page-pitch-template' )
);
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<section class="page-hero pitch-page-hero">
		<div class="container">
			<span class="eyebrow accent"><?php esc_html_e( 'Pitch Night 2026', 'cherrystone-blocks' ); ?></span>
			<h1><?php echo wp_kses_post( 'Six to eight founders.<br>One evening in Providence.' ); ?></h1>
			<p class="lede"><?php esc_html_e( "Pitch Night is Cherrystone's flagship event for early-stage New England startups. Selected founders pitch the full membership for capital, judgment, and follow-on introductions.", 'cherrystone-blocks' ); ?></p>
			<div class="hero-actions pitch-hero-actions">
				<a class="btn btn-primary" href="<?php echo esc_url( $apply_url ); ?>"><?php esc_html_e( 'Apply to pitch', 'cherrystone-blocks' ); ?></a>
				<a class="btn btn-ghost" href="<?php echo esc_url( $sponsor_url ); ?>"><?php esc_html_e( 'Sponsor Pitch Night', 'cherrystone-blocks' ); ?></a>
			</div>
		</div>
	</section>

	<section class="block pitch-event-section">
		<div class="container">
			<div class="block-head">
				<div>
					<span class="eyebrow accent"><?php esc_html_e( 'Event', 'cherrystone-blocks' ); ?></span>
					<h2 style="margin-top:24px;"><?php esc_html_e( 'Upcoming session.', 'cherrystone-blocks' ); ?></h2>
				</div>
				<p class="lede"><?php esc_html_e( 'Annual flagship event. In-person in Providence, Rhode Island. Open to applications from founders raising in New England.', 'cherrystone-blocks' ); ?></p>
			</div>

			<div class="event-card pitch-event-card">
				<div class="event-date">
					<span class="month"><?php echo esc_html( $event_month ); ?></span>
					<span class="day"><?php echo esc_html( $event_day ); ?></span>
				</div>
				<div class="event-info">
					<h3><?php echo esc_html( $event_title ); ?></h3>
					<div class="meta">
						<?php if ( $event_loc ) : ?>
							<span><?php echo esc_html( $event_loc ); ?></span>
						<?php endif; ?>
						<?php if ( $event_type ) : ?>
							<span class="sep">-</span>
							<span><?php echo esc_html( $event_type ); ?></span>
						<?php endif; ?>
						<?php if ( $event_spots ) : ?>
							<span class="sep">-</span>
							<span><?php echo esc_html( $event_spots ); ?></span>
						<?php endif; ?>
					</div>
				</div>
				<a class="btn btn-ghost" href="<?php echo esc_url( $event_cta ); ?>"<?php echo $event_target; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- fixed attribute string. ?>>
					<?php esc_html_e( 'Apply to pitch', 'cherrystone-blocks' ); ?>
				</a>
			</div>
		</div>
	</section>

	<section class="block pitch-format-section">
		<div class="container">
			<div class="block-head">
				<div>
					<span class="eyebrow accent"><?php esc_html_e( 'How it runs', 'cherrystone-blocks' ); ?></span>
					<h2 style="margin-top:24px;"><?php esc_html_e( 'The format.', 'cherrystone-blocks' ); ?></h2>
				</div>
				<p class="lede"><?php esc_html_e( "A simple structure that respects everyone's time.", 'cherrystone-blocks' ); ?></p>
			</div>
			<div class="value-grid pitch-format-grid">
				<div class="value-card">
					<span class="num"><?php esc_html_e( '01 - APPLY', 'cherrystone-blocks' ); ?></span>
					<h3><?php esc_html_e( 'Brief application.', 'cherrystone-blocks' ); ?></h3>
					<p><?php esc_html_e( "What you're building, who it's for, what you've raised, why now. We read every submission.", 'cherrystone-blocks' ); ?></p>
				</div>
				<div class="value-card">
					<span class="num"><?php esc_html_e( '02 - SCREEN', 'cherrystone-blocks' ); ?></span>
					<h3><?php esc_html_e( 'Screening calls.', 'cherrystone-blocks' ); ?></h3>
					<p><?php esc_html_e( 'Selected applicants meet with the screening committee for 30 minutes per call. Two calls before invitation.', 'cherrystone-blocks' ); ?></p>
				</div>
				<div class="value-card">
					<span class="num"><?php esc_html_e( '03 - PITCH', 'cherrystone-blocks' ); ?></span>
					<h3><?php esc_html_e( 'Pitch the room.', 'cherrystone-blocks' ); ?></h3>
					<p><?php esc_html_e( 'Eight minutes plus member Q&A. Funding decisions follow within two weeks.', 'cherrystone-blocks' ); ?></p>
				</div>
			</div>
		</div>
	</section>

	<div class="footer-cta pitch-footer-cta">
		<div class="container footer-cta-inner">
			<span class="eyebrow"><?php esc_html_e( 'Get involved', 'cherrystone-blocks' ); ?></span>
			<h2 style="margin-top:24px;"><?php echo wp_kses_post( 'Capital. Judgment. <em>Time.</em><br>Where founders need it.' ); ?></h2>
			<div class="footer-cta-grid">
				<div class="footer-card">
					<span class="mono"><?php esc_html_e( 'FOR FOUNDERS', 'cherrystone-blocks' ); ?></span>
					<h3><?php esc_html_e( 'Apply for capital', 'cherrystone-blocks' ); ?></h3>
					<p><?php esc_html_e( 'One application, reviewed by our investment committee within three weeks. We invest $50K-$500K at pre-seed and seed across New England and the Northeast.', 'cherrystone-blocks' ); ?></p>
					<a class="btn btn-accent" href="<?php echo esc_url( $apply_url ); ?>"><?php esc_html_e( 'Start application', 'cherrystone-blocks' ); ?></a>
				</div>
				<div class="footer-card">
					<span class="mono"><?php esc_html_e( 'FOR INVESTORS', 'cherrystone-blocks' ); ?></span>
					<h3><?php esc_html_e( 'Become a member', 'cherrystone-blocks' ); ?></h3>
					<p><?php esc_html_e( 'Join 60 active members investing alongside operators, founders, and former exits. Annual cohort opens twice a year - a brief conversation starts the process.', 'cherrystone-blocks' ); ?></p>
					<a class="btn btn-light" href="<?php echo esc_url( $member_url ); ?>"><?php esc_html_e( 'Membership details', 'cherrystone-blocks' ); ?></a>
				</div>
			</div>
		</div>
	</div>
</div>
