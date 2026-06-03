<?php
/**
 * Server render for the Sponsors block.
 *
 * Renders the live set of cherry_sponsor posts, grouped by their tier,
 * and outputs the clickable logo tickers.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Saved inner content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 *
 * @package CherrystoneBlocks
 */

$eyebrow   = isset( $attributes['eyebrow'] ) ? $attributes['eyebrow'] : '';
$heading   = isset( $attributes['heading'] ) ? $attributes['heading'] : '';
$tier_filter = isset( $attributes['tierFilter'] ) ? $attributes['tierFilter'] : '';

$sponsors = get_posts( array(
	'post_type'      => 'cherry_sponsor',
	'post_status'    => 'publish',
	'posts_per_page' => -1,
	'orderby'        => 'menu_order title',
	'order'          => 'ASC',
) );

$groups = array(
	'Sponsors' => array(),
	'Partners' => array(),
);

foreach ( $sponsors as $post ) {
	$tier = get_post_meta( $post->ID, 'cs_sponsor_tier', true );
	if ( 'Partners' === $tier ) {
		$groups['Partners'][] = $post;
	} else {
		$groups['Sponsors'][] = $post;
	}
}

if ( in_array( $tier_filter, array( 'Sponsors', 'Partners' ), true ) ) {
	$groups = array(
		$tier_filter => isset( $groups[ $tier_filter ] ) ? $groups[ $tier_filter ] : array(),
	);
}

$assets_base = CHERRYSTONE_BLOCKS_URL . 'assets/';
$on_error    = "if(!this.src.endsWith('.svg')){this.src=this.src.replace('.png','.svg');}else{this.style.display='none';this.nextElementSibling.style.display='flex';}";

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'block warm', 'style' => 'padding: 80px 0;' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<div class="container">
		<div class="sponsors-section-layout">
			<div class="sponsors-section-head">
				<?php if ( '' !== $eyebrow ) : ?>
					<span class="eyebrow accent"><?php echo wp_kses_post( $eyebrow ); ?></span>
				<?php endif; ?>
				<?php if ( '' !== $heading ) : ?>
					<h2><?php echo wp_kses_post( $heading ); ?></h2>
				<?php endif; ?>
			</div>

			<div class="sponsor-groups">
				<?php foreach ( $groups as $label => $items ) : ?>
					<?php if ( empty( $items ) ) : continue; endif; ?>
					<div class="sponsor-carousel" tabindex="0" aria-label="<?php echo esc_attr( sprintf( __( '%s carousel', 'cherrystone-blocks' ), $label ) ); ?>">
						<div class="sponsor-carousel-head">
							<span class="sponsor-group-label"><?php echo esc_html( $label ); ?></span>
							<div class="sponsor-carousel-arrows" aria-label="<?php esc_attr_e( 'Carousel controls', 'cherrystone-blocks' ); ?>">
								<button class="sponsor-carousel-arrow" type="button" data-dir="prev" aria-label="<?php esc_attr_e( 'Previous', 'cherrystone-blocks' ); ?>">&#8592;</button>
								<button class="sponsor-carousel-arrow" type="button" data-dir="next" aria-label="<?php esc_attr_e( 'Next', 'cherrystone-blocks' ); ?>">&#8594;</button>
							</div>
						</div>
						<div class="sponsor-carousel-viewport">
							<div class="sponsor-carousel-track">
								<?php foreach ( $items as $post ) : ?>
									<?php
									$name        = get_the_title( $post );
									$url         = get_post_meta( $post->ID, 'cs_sponsor_url', true );
									$description = get_post_meta( $post->ID, 'cs_sponsor_description', true );
									$logo_alt    = get_post_meta( $post->ID, 'cs_sponsor_logo_alt', true );
									
									$logo_url = get_the_post_thumbnail_url( $post->ID, 'medium' );
									if ( ! $logo_url ) {
										$logo_url = get_post_meta( $post->ID, 'cs_sponsor_logo_url', true );
									}
									if ( ! $logo_url ) {
										$logo_url = $assets_base . 'logos/' . cherrystone_blocks_logo_slug( $name ) . '.png';
									}
									?>
									<article class="sponsor-card">
										<a class="sponsor-card-link" href="<?php echo esc_url( $url ? $url : '#' ); ?>" <?php echo $url ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>>
											<div class="sponsor-logo-box">
												<img
													src="<?php echo esc_url( $logo_url ); ?>"
													alt="<?php echo esc_attr( $logo_alt ? $logo_alt : $name ); ?>"
													loading="lazy"
													decoding="async"
													onerror="<?php echo esc_attr( $on_error ); ?>"
													style="display: block; width: 100%; height: 100%; object-fit: contain; padding: 4px;"
												>
												<span class="fallback" style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%;">
													<?php echo esc_html( strtoupper( substr( $name, 0, 2 ) ) ); ?>
												</span>
											</div>
											<span class="sponsor-card-name"><?php echo esc_html( $name ); ?></span>
											<?php if ( $description ) : ?>
												<span class="sponsor-card-desc"><?php echo esc_html( $description ); ?></span>
											<?php endif; ?>
										</a>
									</article>
								<?php endforeach; ?>
							</div>
						</div>
						<div class="sponsor-carousel-dots" aria-label="<?php esc_attr_e( 'Carousel pages', 'cherrystone-blocks' ); ?>"></div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
