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
	'post_type'      => 'cherry_leader',
	'post_status'    => 'publish',
	'posts_per_page' => $max_items > 0 ? $max_items : -1,
	'orderby'        => 'menu_order date',
	'order'          => 'ASC',
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
				$name      = get_the_title( $member );
				$role      = get_post_meta( $member->ID, 'cs_leader_role', true );
				$expertise = '';
				$linkedin  = get_post_meta( $member->ID, 'cs_leader_linkedin_url', true );
				$bio       = get_post_meta( $member->ID, 'cs_leader_description', true );
				if ( ! $bio ) {
					$bio   = $member->post_content;
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
					$photo_url = get_post_meta( $member->ID, 'cs_leader_photo_url', true );
				}
				?>
				<div class="member-card" style="height:100%;">
					<div class="member-avatar" style="display:flex;align-items:center;justify-content:center;overflow:hidden;">
						<?php if ( $photo_url ) : ?>
							<img src="<?php echo esc_url( $photo_url ); ?>" alt="<?php echo esc_attr( $name ); ?>" loading="lazy" decoding="async" width="200" height="200" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
						<?php else : ?>
							<span style="font-size:16px;color:#fff;font-weight:600;font-family:var(--font-sans);"><?php echo esc_html( $initials ); ?></span>
						<?php endif; ?>
					</div>
					<h3><?php echo esc_html( $name ); ?></h3>
					<?php if ( $role ) : ?>
						<div class="role"><?php echo esc_html( $role ); ?></div>
					<?php endif; ?>
					<?php if ( $expertise ) : ?>
						<div class="focus"><?php echo esc_html( $expertise ); ?></div>
					<?php endif; ?>
					
					<div class="member-bio">
						<p><?php echo esc_html( $bio ); ?></p>
					</div>
					
					<span class="member-link-cta">
						<?php if ( $linkedin ) : ?>
							<a href="<?php echo esc_url( $linkedin ); ?>" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;"><?php esc_html_e( 'LinkedIn →', 'cherrystone-blocks' ); ?></a>
						<?php else : ?>
							<?php esc_html_e( 'View profile ->', 'cherrystone-blocks' ); ?>
						<?php endif; ?>
					</span>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
