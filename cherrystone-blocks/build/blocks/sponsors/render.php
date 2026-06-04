<?php
/**
 * Server render for the Sponsors block.
 *
 * displayMode=""         → auto-detect: single tierFilter = card-grid, both = carousel (default)
 * displayMode="carousel" → infinite-scrolling marquee rows grouped by Sponsors / Partners
 * displayMode="card-grid"→ static card grid (used on the dedicated Sponsors / Partners pages)
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Saved inner content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 *
 * @package CherrystoneBlocks
 */

$eyebrow      = isset( $attributes['eyebrow'] )      ? $attributes['eyebrow']      : '';
$heading      = isset( $attributes['heading'] )      ? $attributes['heading']      : '';
$tier_filter  = isset( $attributes['tierFilter'] )   ? $attributes['tierFilter']   : '';
$display_mode = isset( $attributes['displayMode'] )  ? $attributes['displayMode']  : '';

// Auto-detect: a single-tier block (Sponsors or Partners) shows all items as a card grid.
// A mixed block (both tiers) uses the carousel so each group has a "See all" link.
if ( '' === $display_mode ) {
	$display_mode = in_array( $tier_filter, array( 'Sponsors', 'Partners' ), true )
		? 'card-grid'
		: 'carousel';
}

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

/**
 * Render a single sponsor card article.
 */
$render_card = static function ( $post, $assets_base, $on_error, $clone = false ) {
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

	$aria_attr  = $clone ? ' aria-hidden="true"' : '';
	$tab_attr   = $clone ? ' tabindex="-1"' : '';
	$img_alt    = $clone ? '' : esc_attr( $logo_alt ? $logo_alt : $name );
	?>
	<article class="sponsor-card"<?php echo $aria_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<a class="sponsor-card-link" href="<?php echo esc_url( $url ? $url : '#' ); ?>"<?php echo $aria_attr . $tab_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?><?php echo $url ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>>
			<div class="sponsor-logo-box">
				<img
					src="<?php echo esc_url( $logo_url ); ?>"
					alt="<?php echo $img_alt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>"
					loading="lazy"
					decoding="async"
					onerror="<?php echo esc_attr( $on_error ); ?>"
					style="display: block; width: 100%; height: 100%; object-fit: contain; padding: 4px;"
				>
				<span class="fallback" style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%;"<?php echo $aria_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
					<?php echo esc_html( strtoupper( substr( $name, 0, 2 ) ) ); ?>
				</span>
			</div>
			<span class="sponsor-card-name"><?php echo esc_html( $name ); ?></span>
			<?php if ( $description ) : ?>
				<span class="sponsor-card-desc"><?php echo esc_html( $description ); ?></span>
			<?php endif; ?>
		</a>
	</article>
	<?php
};

// ── CARD-GRID MODE ───────────────────────────────────────────────────────────
if ( 'card-grid' === $display_mode ) :

	$all_items = array_merge( ...array_values( $groups ) );
	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'block warm' ) );
	?>
	<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<div class="container">
			<?php if ( '' !== $eyebrow || '' !== $heading ) : ?>
				<div class="block-head" style="margin-bottom: 40px;">
					<div>
						<?php if ( '' !== $eyebrow ) : ?>
							<span class="eyebrow accent"><?php echo wp_kses_post( $eyebrow ); ?></span>
						<?php endif; ?>
						<?php if ( '' !== $heading ) : ?>
							<h2 style="margin-top: 16px;"><?php echo wp_kses_post( $heading ); ?></h2>
						<?php endif; ?>
					</div>
				</div>
			<?php endif; ?>

			<div class="sponsor-card-grid">
				<?php foreach ( $all_items as $post ) : ?>
					<?php $render_card( $post, $assets_base, $on_error, false ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

<?php
// ── CAROUSEL MODE (default) ──────────────────────────────────────────────────
else :

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
						<?php
						$see_all_url  = 'Partners' === $label ? home_url( '/partners' ) : home_url( '/sponsors' );
						$see_all_text = 'Partners' === $label
							? __( 'See all partners', 'cherrystone-blocks' )
							: __( 'See all sponsors', 'cherrystone-blocks' );
						$item_count   = count( $items );
						?>
						<div class="sponsor-carousel" data-items="<?php echo esc_attr( $item_count ); ?>" aria-label="<?php echo esc_attr( sprintf( __( '%s carousel', 'cherrystone-blocks' ), $label ) ); ?>">
							<div class="sponsor-carousel-head">
								<span class="sponsor-group-label"><?php echo esc_html( $label ); ?></span>
							</div>
							<div class="sponsor-carousel-viewport" aria-live="off">
								<div class="sponsor-carousel-track">
									<?php foreach ( $items as $post ) : ?>
										<?php $render_card( $post, $assets_base, $on_error, false ); ?>
									<?php endforeach; ?>
									<?php /* Duplicate set for seamless loop — screen-reader hidden */ ?>
									<?php foreach ( $items as $post ) : ?>
										<?php $render_card( $post, $assets_base, $on_error, true ); ?>
									<?php endforeach; ?>
								</div>
							</div>
							<div class="sponsor-carousel-footer">
								<a href="<?php echo esc_url( $see_all_url ); ?>" class="sponsor-see-all-link">
									<?php echo esc_html( $see_all_text ); ?> <span aria-hidden="true">→</span>
								</a>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</section>

<?php endif; ?>
