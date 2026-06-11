<?php
/**
 * Server render for the Member Committee Grid block.
 *
 * Renders the live set of cherry_people posts who are designated as committee chairs
 * or members, displaying expertise tags and led investments.
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

$query_args = array(
	'post_type'      => 'cherry_member',
	'post_status'    => 'publish',
	'posts_per_page' => -1,
	'orderby'        => 'menu_order date',
	'order'          => 'ASC',
	'meta_key'       => 'cs_is_leadership',
	'meta_value'     => '1',
);

$members = get_posts( $query_args );
$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'block member-grid-section' ) );
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

		<div class="member-committee-grid-inner">
			<?php foreach ( $members as $member ) : ?>
				<?php
				$name             = get_the_title( $member );
				$role             = get_post_meta( $member->ID, 'cs_member_role', true );
				$expertise        = '';
				$lead_investments = '';
				$initial          = substr( $name, 0, 1 );

				// Resolve Featured Image
				$photo_url = get_the_post_thumbnail_url( $member->ID, 'medium' );
				if ( ! $photo_url ) {
					$photo_url = get_post_meta( $member->ID, 'cs_member_photo_url', true );
				}
				?>
				<div class="member-profile-card">
					<div class="member-profile-header">
						<div class="member-profile-circle-avatar" style="display:flex;align-items:center;justify-content:center;overflow:hidden;">
							<?php if ( $photo_url ) : ?>
								<img src="<?php echo esc_url( $photo_url ); ?>" alt="<?php echo esc_attr( $name ); ?>" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
							<?php else : ?>
								<span><?php echo esc_html( $initial ); ?></span>
							<?php endif; ?>
						</div>
						<div class="member-profile-info">
							<h3 class="member-profile-name"><?php echo esc_html( $name ); ?></h3>
							<?php if ( $role ) : ?>
								<span class="member-profile-role mono"><?php echo esc_html( $role ); ?></span>
							<?php endif; ?>
						</div>
					</div>

					<div class="member-profile-details">
						<?php if ( $expertise ) : ?>
							<div class="member-profile-meta-row">
								<span class="meta-row-lbl mono"><?php esc_html_e( 'EXPERTISE:', 'cherrystone-blocks' ); ?></span>
								<span class="meta-row-val"><?php echo esc_html( $expertise ); ?></span>
							</div>
						<?php endif; ?>
						<?php if ( $lead_investments ) : ?>
							<div class="member-profile-meta-row">
								<span class="meta-row-lbl mono"><?php esc_html_e( 'LEADS:', 'cherrystone-blocks' ); ?></span>
								<span class="meta-row-val highlight-gold"><?php echo esc_html( $lead_investments ); ?></span>
							</div>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
