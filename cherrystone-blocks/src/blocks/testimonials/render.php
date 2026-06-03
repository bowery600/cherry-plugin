<?php
/**
 * Server render for the Testimonials block.
 *
 * Renders the live set of cherry_testimonial posts in a three-card grid.
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
	'posts_per_page' => 3,
	'orderby'        => 'menu_order date',
	'order'          => 'ASC',
) );

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

		<div class="quote-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
			<?php foreach ( $testimonials as $index => $post ) : ?>
				<?php
				$quote   = get_post_meta( $post->ID, 'cs_testimonial_quote', true );
				if ( ! $quote ) {
					$quote = $post->post_content;
				}
				$author  = get_post_meta( $post->ID, 'cs_testimonial_author', true );
				$role    = get_post_meta( $post->ID, 'cs_testimonial_role', true );
				$company = get_post_meta( $post->ID, 'cs_testimonial_company', true );
				
				// Full fallback if author meta is not populated (uses title)
				if ( ! $author ) {
					$author = get_the_title( $post );
				}

				$display_role = trim( implode( ', ', array_filter( array( $role, $company ) ) ) );
				?>
				<div style="padding: 36px 32px; border: 1px solid var(--line); background: var(--surface); border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: 24px; height: 100%;">
					<span style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-ink); letter-spacing: 0.08em;">
						<?php printf( '0%d / FOUNDER', (int) $index + 1 ); ?>
					</span>
					<p style="margin: 0; font-size: 16px; line-height: 1.55; color: var(--ink); flex: 1;">
						<?php echo esc_html( $quote ); ?>
					</p>
					<div style="border-top: 1px solid var(--line); padding-top: 18px; display: flex; align-items: center; gap: 12px;">
						<?php
						$photo_url = get_the_post_thumbnail_url( $post->ID, 'thumbnail' );
						if ( ! $photo_url ) {
							$photo_url = get_post_meta( $post->ID, 'cs_testimonial_photo_url', true );
						}
						
						if ( $photo_url ) : ?>
							<img src="<?php echo esc_url( $photo_url ); ?>" alt="<?php echo esc_attr( $author ); ?>" loading="lazy" decoding="async" width="40" height="40" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; flex-shrink: 0;">
						<?php else : ?>
							<div style="width: 40px; height: 40px; border-radius: 50%; background: var(--line); color: var(--ink-muted); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0;">
								<?php echo esc_html( substr( $author, 0, 1 ) ); ?>
							</div>
						<?php endif; ?>
						<div>
							<div style="font-weight: 600; font-size: 15px;">
								<?php echo esc_html( $author ); ?>
							</div>
							<?php if ( $display_role ) : ?>
								<div style="font-size: 13px; color: var(--ink-muted); margin-top: 2px;">
									<?php echo esc_html( $display_role ); ?>
								</div>
							<?php endif; ?>
						</div>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
