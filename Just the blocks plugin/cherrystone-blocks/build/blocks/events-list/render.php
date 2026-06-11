<?php
/**
 * Server render for the Events List block.
 *
 * Renders the live set of cherry_pitch_event posts, ordered by event date, so
 * the calendar iterates over the Pitch Nights managed in wp-admin.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Saved inner content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 *
 * @package CherrystoneBlocks
 */

$eyebrow       = isset( $attributes['eyebrow'] ) ? $attributes['eyebrow'] : '';
$heading       = isset( $attributes['heading'] ) ? $attributes['heading'] : '';
$lede          = isset( $attributes['lede'] ) ? $attributes['lede'] : '';
$max_items     = isset( $attributes['maxItems'] ) ? (int) $attributes['maxItems'] : 0;
$upcoming_only = ! empty( $attributes['upcomingOnly'] );

$query_args = array(
	'post_type'      => 'cherry_pitch_event',
	'post_status'    => 'publish',
	'posts_per_page' => $max_items > 0 ? $max_items : -1,
	'meta_key'       => 'cs_event_date',
	'orderby'        => 'meta_value',
	'order'          => 'ASC',
);

if ( $upcoming_only ) {
	$query_args['meta_query'] = array(
		array(
			'key'     => 'cs_event_date',
			'value'   => gmdate( 'Y-m-d' ),
			'compare' => '>=',
			'type'    => 'DATE',
		),
	);
}

$events = get_posts( $query_args );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'block' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<div class="container">
		<div class="block-head">
			<div>
				<?php if ( '' !== $eyebrow ) : ?>
					<span class="eyebrow accent"><?php echo wp_kses_post( $eyebrow ); ?></span>
				<?php endif; ?>
				<?php if ( '' !== $heading ) : ?>
					<h2 style="margin-top:24px;"><?php echo wp_kses_post( $heading ); ?></h2>
				<?php endif; ?>
			</div>
			<?php if ( '' !== $lede ) : ?>
				<p class="lede"><?php echo wp_kses_post( $lede ); ?></p>
			<?php endif; ?>
		</div>

		<?php foreach ( $events as $event ) : ?>
			<?php
			$iso          = get_post_meta( $event->ID, 'cs_event_date', true );
			$timestamp    = $iso ? strtotime( $iso ) : false;
			$day          = $timestamp ? gmdate( 'j', $timestamp ) : '';
			$month        = $timestamp ? gmdate( 'M', $timestamp ) : '';
			$year         = $timestamp ? gmdate( 'Y', $timestamp ) : '';
			$location     = get_post_meta( $event->ID, 'cs_event_location', true );
			$type         = get_post_meta( $event->ID, 'cs_event_type', true );
			$spots        = get_post_meta( $event->ID, 'cs_event_spots', true );
			$registration = get_post_meta( $event->ID, 'cs_registration_url', true );
			?>
			<div class="event-card">
				<div class="event-date">
					<span class="month"><?php echo esc_html( trim( $month . ' ' . $year ) ); ?></span>
					<?php if ( $day ) : ?>
						<span class="day"><?php echo esc_html( $day ); ?></span>
					<?php endif; ?>
				</div>
				<div class="event-info">
					<h3><?php echo esc_html( get_the_title( $event ) ); ?></h3>
					<?php if ( $location || $type || $spots ) : ?>
						<div class="meta">
							<?php if ( $location ) : ?>
								<span><?php echo esc_html( $location ); ?></span>
							<?php endif; ?>
							<?php if ( $location && $type ) : ?>
								<span class="sep">-</span>
							<?php endif; ?>
							<?php if ( $type ) : ?>
								<span><?php echo esc_html( $type ); ?></span>
							<?php endif; ?>
							<?php if ( $spots ) : ?>
								<span class="sep">-</span>
								<span><?php echo esc_html( $spots ); ?></span>
							<?php endif; ?>
						</div>
					<?php endif; ?>
				</div>
				<a class="btn btn-ghost" href="<?php echo esc_url( $registration ? $registration : get_permalink( $event ) ); ?>"<?php echo $registration ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>>
					<?php echo $registration ? esc_html__( 'Register', 'cherrystone-blocks' ) : esc_html__( 'Details', 'cherrystone-blocks' ); ?>
				</a>
			</div>
		<?php endforeach; ?>
	</div>
</section>
