<?php
/**
 * Server render for the People Grid block.
 *
 * Renders the live set of cherry_people posts, so the grid iterates over
 * whatever team members the editor manages in wp-admin.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Saved inner content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 *
 * @package CherrystoneBlocks
 */

$eyebrow   = isset( $attributes['eyebrow'] ) ? $attributes['eyebrow'] : '';
$heading   = isset( $attributes['heading'] ) ? $attributes['heading'] : '';
$lede      = isset( $attributes['lede'] ) ? $attributes['lede'] : '';
$max_items = isset( $attributes['maxItems'] ) ? (int) $attributes['maxItems'] : 0;
$committee = isset( $attributes['committeeFilter'] ) ? trim( $attributes['committeeFilter'] ) : '';

$query_args = array(
	'post_type'      => 'cherry_member',
	'post_status'    => 'publish',
	'posts_per_page' => $max_items > 0 ? $max_items : -1,
	'orderby'        => 'menu_order date',
	'order'          => 'ASC',
	'meta_key'       => 'cs_is_leadership',
	'meta_value'     => '1',
);

$members = get_posts( $query_args );
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
					<h2 style="margin-top:24px;"><?php echo wp_kses_post( $heading ); ?></h2>
				<?php endif; ?>
			</div>
			<?php if ( '' !== $lede ) : ?>
				<p class="lede"><?php echo wp_kses_post( $lede ); ?></p>
			<?php endif; ?>
		</div>

		<div class="member-grid">
			<?php foreach ( $members as $member ) : ?>
				<?php
				$name     = get_the_title( $member );
				$role     = get_post_meta( $member->ID, 'cs_member_role', true );
				$linkedin = get_post_meta( $member->ID, 'cs_member_linkedin_url', true );
				$bio      = get_post_meta( $member->ID, 'cs_member_description', true );
				if ( ! $bio ) {
					$bio = $member->post_content;
				}

				// Generate initials for fallback
				$words    = explode( ' ', $name );
				$initials = '';
				foreach ( $words as $w ) {
					$initials .= isset( $w[0] ) ? strtoupper( $w[0] ) : '';
				}
				$initials = substr( $initials, 0, 2 );

				// Resolve image
				$photo_url = get_the_post_thumbnail_url( $member->ID, 'medium' );
				if ( ! $photo_url ) {
					$photo_url = get_post_meta( $member->ID, 'cs_member_photo_url', true );
				}
				?>
				<article class="member-card" tabindex="0" style="cursor:pointer;height:100%;">
					<div class="member-directory-card-front">
						<div class="member-avatar">
							<?php if ( $photo_url ) : ?>
								<img src="<?php echo esc_url( $photo_url ); ?>" alt="<?php echo esc_attr( $name ); ?>" loading="lazy" decoding="async" width="200" height="200">
							<?php else : ?>
								<span><?php echo esc_html( $initials ); ?></span>
							<?php endif; ?>
						</div>
						<h3><?php echo esc_html( $name ); ?></h3>
						<?php if ( $role ) : ?>
							<div class="role"><?php echo esc_html( $role ); ?></div>
						<?php endif; ?>
						<div class="focus">
							<?php esc_html_e( 'View bio', 'cherrystone-blocks' ); ?>
							<svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
						</div>
					</div>
					<p class="member-bio"><?php echo esc_html( wp_strip_all_tags( $bio ) ); ?></p>
					<?php if ( $linkedin ) : ?>
						<span class="member-link-cta"><a href="<?php echo esc_url( $linkedin ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'LinkedIn ->', 'cherrystone-blocks' ); ?></a></span>
					<?php endif; ?>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
