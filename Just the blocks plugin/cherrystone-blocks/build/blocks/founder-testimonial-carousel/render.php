<?php
/**
 * Server render for the Founder Testimonial Carousel block.
 *
 * Renders the live set of cherry_testimonial posts in an interactive carousel.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Saved inner content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 *
 * @package CherrystoneBlocks
 */

$eyebrow = isset( $attributes['eyebrow'] ) ? $attributes['eyebrow'] : '';
$heading = isset( $attributes['heading'] ) ? $attributes['heading'] : '';
$lede    = isset( $attributes['lede'] ) ? $attributes['lede'] : '';

$testimonials = get_posts( array(
	'post_type'      => 'cherry_testimonial',
	'post_status'    => 'publish',
	'posts_per_page' => -1,
	'orderby'        => 'menu_order date',
	'order'          => 'ASC',
) );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'block founder-carousel-section' ) );
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

		<div class="founder-carousel-container" data-autoplay="true">
			<?php if ( empty( $testimonials ) ) : ?>
				<p><?php esc_html_e( 'No testimonials found.', 'cherrystone-blocks' ); ?></p>
			<?php else : ?>
				<div class="founder-testimonial-active-wrapper" style="position: relative;">
					<?php foreach ( $testimonials as $index => $post ) : ?>
						<?php
						$quote   = get_post_meta( $post->ID, 'cs_testimonial_quote', true );
						if ( ! $quote ) {
							$quote = $post->post_content;
						}
						$name    = get_post_meta( $post->ID, 'cs_testimonial_author', true );
						$role    = get_post_meta( $post->ID, 'cs_testimonial_role', true );
						$company = get_post_meta( $post->ID, 'cs_testimonial_company', true );
						$round   = get_post_meta( $post->ID, 'cs_testimonial_round', true );
						
						if ( ! $name ) {
							$name = get_the_title( $post );
						}
						
						$initial = substr( $name, 0, 1 );
						$photo_url = get_the_post_thumbnail_url( $post->ID, 'medium' );
						if ( ! $photo_url ) {
							$photo_url = get_post_meta( $post->ID, 'cs_testimonial_photo_url', true );
						}
						?>
						<div class="founder-testimonial-slide<?php echo 0 === $index ? ' is-active' : ''; ?>">
							<div class="founder-testimonial-quote-box">
								<span class="quote-mark-icon">&ldquo;</span>
								<p class="founder-quote-text"><?php echo esc_html( $quote ); ?></p>
							</div>

							<div class="founder-author-footer">
								<div class="founder-avatar-placeholder" style="display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:50%;">
									<?php if ( $photo_url ) : ?>
										<img src="<?php echo esc_url( $photo_url ); ?>" alt="<?php echo esc_attr( $name ); ?>" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;">
									<?php else : ?>
										<span><?php echo esc_html( $initial ); ?></span>
									<?php endif; ?>
								</div>
								<div class="founder-meta-desc">
									<strong class="founder-author-name"><?php echo esc_html( $name ); ?></strong>
									<div class="founder-author-role">
										<span><?php echo esc_html( $role ); ?></span>
										<?php if ( $company ) : ?>
											<?php echo ' @ '; ?>
											<span class="founder-company-lbl"><?php echo esc_html( $company ); ?></span>
										<?php endif; ?>
									</div>
								</div>

								<?php if ( $round ) : ?>
									<div class="founder-badge-round-size mono">
										<span><?php echo esc_html( $round ); ?></span>
									</div>
								<?php endif; ?>
							</div>
						</div>
					<?php endforeach; ?>

					<div class="founder-carousel-indicators">
						<?php foreach ( $testimonials as $index => $post ) : ?>
							<button class="carousel-dot-indicator<?php echo 0 === $index ? ' is-active' : ''; ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Go to slide %d', 'cherrystone-blocks' ), $index + 1 ) ); ?>"></button>
						<?php endforeach; ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
