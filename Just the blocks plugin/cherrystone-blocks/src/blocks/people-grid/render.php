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
				$name      = get_the_title( $member );
				$role      = get_post_meta( $member->ID, 'cs_member_role', true );
				$expertise = '';
				$linkedin  = get_post_meta( $member->ID, 'cs_member_linkedin_url', true );

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
				<button class="member-card cs-bio-trigger" style="height:100%; border:none; background:transparent; cursor:pointer; text-align:left; padding:0; width:100%;" aria-expanded="false" aria-controls="bio-drawer-<?php echo esc_attr( $member->ID ); ?>">
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
					<span class="member-link-cta" style="margin-top:auto;">
						<?php esc_html_e( 'View Bio →', 'cherrystone-blocks' ); ?>
					</span>
				</button>
			<?php endforeach; ?>
		</div>

		<!-- Slide-Over Drawers container -->
		<div class="cs-bio-drawers-container" aria-hidden="true">
			<div class="cs-bio-backdrop" tabindex="-1"></div>
			<?php foreach ( $members as $member ) : ?>
				<?php
				$name      = get_the_title( $member );
				$role      = get_post_meta( $member->ID, 'cs_member_role', true );
				$linkedin  = get_post_meta( $member->ID, 'cs_member_linkedin_url', true );
				$bio       = get_post_meta( $member->ID, 'cs_member_description', true );
				if ( ! $bio ) {
					$bio   = $member->post_content;
				}
				$photo_url = get_the_post_thumbnail_url( $member->ID, 'medium' );
				if ( ! $photo_url ) {
					$photo_url = get_post_meta( $member->ID, 'cs_member_photo_url', true );
				}
				?>
				<div id="bio-drawer-<?php echo esc_attr( $member->ID ); ?>" class="cs-bio-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title-<?php echo esc_attr( $member->ID ); ?>" hidden>
					<div class="cs-bio-drawer-inner">
						<button class="cs-bio-close" aria-label="Close bio">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
						</button>
						<div class="cs-bio-drawer-header">
							<?php if ( $photo_url ) : ?>
								<img src="<?php echo esc_url( $photo_url ); ?>" alt="" class="cs-bio-drawer-avatar">
							<?php endif; ?>
							<div>
								<h2 id="drawer-title-<?php echo esc_attr( $member->ID ); ?>"><?php echo esc_html( $name ); ?></h2>
								<?php if ( $role ) : ?>
									<div class="cs-bio-drawer-role"><?php echo esc_html( $role ); ?></div>
								<?php endif; ?>
								<?php if ( $linkedin ) : ?>
									<a href="<?php echo esc_url( $linkedin ); ?>" target="_blank" rel="noopener noreferrer" class="cs-bio-drawer-linkedin">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
										LinkedIn Profile
									</a>
								<?php endif; ?>
							</div>
						</div>
						<div class="cs-bio-drawer-content">
							<?php echo wp_kses_post( wpautop( $bio ) ); ?>
						</div>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
