<?php
/**
 * Server render for the Portfolio Grid block.
 *
 * Renders the live set of cherry_portfolio posts, so the grid iterates over
 * whatever companies the editor manages in wp-admin.
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
$cta_label = isset( $attributes['ctaLabel'] ) ? $attributes['ctaLabel'] : '';
$cta_url   = isset( $attributes['ctaUrl'] ) ? $attributes['ctaUrl'] : '';
$max_items = isset( $attributes['maxItems'] ) ? (int) $attributes['maxItems'] : 0;
$sector    = isset( $attributes['sectorFilter'] ) ? trim( $attributes['sectorFilter'] ) : '';
$status    = isset( $attributes['statusFilter'] ) ? trim( $attributes['statusFilter'] ) : 'Active';

$query_args = array(
	'post_type'      => 'cherry_portfolio',
	'post_status'    => 'publish',
	'posts_per_page' => $max_items > 0 ? $max_items : -1,
	'orderby'        => 'date',
	'order'          => 'ASC',
);

$meta_query = array( 'relation' => 'AND' );

if ( '' !== $sector ) {
	$meta_query[] = array(
		'key'   => 'cs_sector',
		'value' => $sector,
	);
}

if ( 'Active' === $status ) {
	$meta_query[] = array(
		'relation' => 'OR',
		array(
			'key'     => 'cs_status',
			'value'   => 'Active',
			'compare' => '=',
		),
		array(
			'key'     => 'cs_status',
			'compare' => 'NOT EXISTS',
		),
	);
} elseif ( 'Exit' === $status ) {
	$meta_query[] = array(
		'key'     => 'cs_status',
		'value'   => 'Exit',
		'compare' => '=',
	);
}

if ( count( $meta_query ) > 1 ) {
	$query_args['meta_query'] = $meta_query;
}

$companies = get_posts( $query_args );

$assets_base = CHERRYSTONE_BLOCKS_URL . 'assets/';
$on_error    = "if(!this.src.endsWith('.svg')){this.src=this.src.replace('.png','.svg');}else{this.style.display='none';this.nextElementSibling.style.display='flex';}";

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

		<div class="portfolio-grid">
			<?php foreach ( $companies as $company ) : ?>
				<?php
				$name        = get_the_title( $company );
				$sector_val  = get_post_meta( $company->ID, 'cs_sector', true );
				$stage_val   = get_post_meta( $company->ID, 'cs_stage', true );
				$company_url = get_post_meta( $company->ID, 'cs_company_url', true );
				$initials    = get_post_meta( $company->ID, 'cs_initials', true );
				$logo_url    = get_post_meta( $company->ID, 'cs_logo_url', true );
				$desc        = get_post_meta( $company->ID, 'cs_company_description', true );
				if ( ! $desc ) {
					$desc    = has_excerpt( $company ) ? get_the_excerpt( $company ) : wp_strip_all_tags( $company->post_content );
				}

				if ( ! $logo_url ) {
					$logo_url = $assets_base . 'logos/' . cherrystone_blocks_logo_slug( $name ) . '.png';
				}
				?>
				<a
					href="<?php echo esc_url( $company_url ? $company_url : get_permalink( $company ) ); ?>"
					<?php echo $company_url ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>
					class="portfolio-card"
					style="text-decoration:none;color:inherit;height:100%;"
				>
					<div class="logo">
						<img
							src="<?php echo esc_url( $logo_url ); ?>"
							alt="<?php echo esc_attr( $name ); ?>"
							loading="lazy"
							decoding="async"
							onerror="<?php echo esc_attr( $on_error ); ?>"
							style="display:block;width:100%;height:100%;object-fit:contain;padding:4px;"
						>
						<span class="fallback" style="display:none;align-items:center;justify-content:center;width:100%;height:100%;"><?php echo esc_html( $initials ); ?></span>
					</div>
					<h3><?php echo esc_html( $name ); ?></h3>
					<div class="meta">
						<span><?php echo esc_html( $sector_val ); ?></span>
						<span class="sep">-</span>
						<span><?php echo esc_html( $stage_val ); ?></span>
					</div>
					<p><?php echo esc_html( $desc ); ?></p>
					<span class="tag">Visit company</span>
				</a>
			<?php endforeach; ?>
		</div>

		<?php if ( '' !== $cta_label ) : ?>
			<div style="display:flex;justify-content:center;margin-top:48px;">
				<a class="btn btn-ghost" href="<?php echo esc_url( $cta_url ); ?>">
					<span><?php echo wp_kses_post( $cta_label ); ?></span>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
				</a>
			</div>
		<?php endif; ?>
	</div>
</section>
