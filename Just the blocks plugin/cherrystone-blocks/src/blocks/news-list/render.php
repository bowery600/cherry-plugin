<?php
/**
 * Server render for the News List block.
 *
 * Renders the live set of cherry_communication posts.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Saved inner content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 *
 * @package CherrystoneBlocks
 */

$eyebrow  = isset( $attributes['eyebrow'] ) ? $attributes['eyebrow'] : '';
$heading  = isset( $attributes['heading'] ) ? $attributes['heading'] : '';
$lede     = isset( $attributes['lede'] ) ? $attributes['lede'] : '';
$max_items = isset( $attributes['maxItems'] ) ? (int) $attributes['maxItems'] : 0;
$category = isset( $attributes['categoryFilter'] ) ? trim( $attributes['categoryFilter'] ) : '';

$query_args = array(
	'post_type'      => 'cherry_communication',
	'post_status'    => 'publish',
	'posts_per_page' => $max_items > 0 ? $max_items : -1,
	'orderby'        => 'date',
	'order'          => 'DESC',
);

$meta_query = array( 'relation' => 'AND' );

if ( '' !== $category ) {
	$meta_query[] = array(
		'key'   => 'cs_communication_category',
		'value' => $category,
	);
}

if ( count( $meta_query ) > 1 ) {
	$query_args['meta_query'] = $meta_query;
}

$communications = get_posts( $query_args );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'block warm' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<div class="container">
		<div class="block-head">
			<div>
				<?php if ( '' !== $eyebrow ) : ?>
					<span class="eyebrow accent"><?php echo wp_kses_post( $eyebrow ); ?></span>
				<?php endif; ?>
				<?php if ( '' !== $heading ) : ?>
					<h2 style="margin-top: 24px;"><?php echo wp_kses_post( $heading ); ?></h2>
				<?php endif; ?>
			</div>
			<?php if ( '' !== $lede ) : ?>
				<p class="lede"><?php echo wp_kses_post( $lede ); ?></p>
			<?php endif; ?>
		</div>
		<div>
			<?php foreach ( $communications as $comm ) : ?>
				<?php
				$title       = get_the_title( $comm );
				$date_val    = get_post_meta( $comm->ID, 'cs_communication_date', true );
				$author      = get_post_meta( $comm->ID, 'cs_communication_author', true );
				$category_val= get_post_meta( $comm->ID, 'cs_communication_category', true );
				$source_url  = get_post_meta( $comm->ID, 'cs_communication_source_url', true );
				
				if ( ! $date_val ) {
					$date_val = get_the_date( 'M d, Y', $comm );
				}

				if ( ! $author ) {
					$author = 'Cherrystone Angel Group';
				}

				if ( ! $category_val ) {
					$category_val = 'News';
				}

				$url = $source_url ? $source_url : get_permalink( $comm );
				?>
				<a class="news-row" href="<?php echo esc_url( $url ); ?>" <?php echo $source_url ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>>
					<span class="date"><?php echo esc_html( $date_val ); ?></span>
					<div>
						<h4><?php echo esc_html( $title ); ?></h4>
						<div class="byline"><?php echo esc_html( $author ); ?></div>
					</div>
					<span class="cat"><?php echo esc_html( $category_val ); ?></span>
					<span class="arrow" aria-hidden="true">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
