<?php
/**
 * Server render for the Portfolio Grid / Marquee block.
 *
 * displayMode="grid"    → original 3-column card grid (default, used on portfolio pages).
 * displayMode="marquee" → three infinite marquee rows (→ ← →) with logo, name, sector.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Unused (dynamic block).
 * @var WP_Block $block      Block instance.
 *
 * @package CherrystoneBlocks
 */

$display_mode = isset( $attributes['displayMode'] ) ? $attributes['displayMode'] : 'grid';
$eyebrow      = isset( $attributes['eyebrow'] )     ? $attributes['eyebrow']     : '';
$heading      = isset( $attributes['heading'] )     ? $attributes['heading']     : '';
$lede         = isset( $attributes['lede'] )        ? $attributes['lede']        : '';
$cta_label    = isset( $attributes['ctaLabel'] )    ? $attributes['ctaLabel']    : '';
$cta_url      = isset( $attributes['ctaUrl'] )      ? $attributes['ctaUrl']      : '/portfolio';
$max_items    = isset( $attributes['maxItems'] )    ? (int) $attributes['maxItems'] : 0;
$sector       = isset( $attributes['sectorFilter'] ) ? trim( $attributes['sectorFilter'] ) : '';
$status       = isset( $attributes['statusFilter'] ) ? trim( $attributes['statusFilter'] ) : 'Active';

// We fetch all companies so that client-side filtering can handle modes/verticals.
$query_args = array(
	'post_type'      => 'cherry_portfolio',
	'post_status'    => 'publish',
	'posts_per_page' => ( 'grid' === $display_mode && $max_items > 0 ) ? $max_items : -1,
	'orderby'        => 'date',
	'order'          => 'ASC',
);


$companies   = get_posts( $query_args );
$assets_base = CHERRYSTONE_BLOCKS_URL . 'assets/';
$on_error    = "if(!this.src.endsWith('.svg')){this.src=this.src.replace('.png','.svg');}else{this.style.display='none';this.nextElementSibling.style.display='flex';}";

// ── MARQUEE MODE ─────────────────────────────────────────────────────────────
if ( 'marquee' === $display_mode ) :

	$build_pill = function( $company, $decorative = false ) use ( $assets_base, $on_error ) {
		$name        = get_the_title( $company );
		$sector_val  = get_post_meta( $company->ID, 'cs_sector', true );
		$initials    = get_post_meta( $company->ID, 'cs_initials', true );
		$logo_url    = get_post_meta( $company->ID, 'cs_logo_url', true );
		$company_url = get_post_meta( $company->ID, 'cs_company_url', true );

		if ( ! $logo_url ) {
			$logo_url = $assets_base . 'logos/' . cherrystone_blocks_logo_slug( $name ) . '.png';
		}

		$href   = esc_url( $company_url ? $company_url : get_permalink( $company ) );
		$target = $company_url ? ' target="_blank" rel="noopener noreferrer"' : '';

		$sector_html = '';
		if ( $sector_val ) {
			$sector_html = '<span class="marquee-pill__sep" aria-hidden="true">·</span>'
				. '<span class="marquee-pill__sector">' . esc_html( $sector_val ) . '</span>';
		}

		// Decorative copies keep the marquee loop seamless without flooding
		// the accessibility tree and tab order with duplicate links.
		$a11y_attrs = $decorative
			? ' aria-hidden="true" tabindex="-1"'
			: ' aria-label="' . esc_attr( $name ) . '"';

		return '<a href="' . $href . '"' . $target . ' class="marquee-pill"' . $a11y_attrs . '>'
			. '<span class="marquee-pill__logo">'
			. '<img src="' . esc_url( $logo_url ) . '" alt="' . ( $decorative ? '' : esc_attr( $name ) ) . '" loading="lazy" decoding="async" onerror="' . esc_attr( $on_error ) . '">'
			. '<span class="fallback" aria-hidden="true">' . esc_html( $initials ) . '</span>'
			. '</span>'
			. '<span class="marquee-pill__name">' . esc_html( $name ) . '</span>'
			. $sector_html
			. '</a>';
	};

	$pills_html      = '';
	$pills_html_deco = '';
	foreach ( $companies as $company ) {
		$pills_html      .= $build_pill( $company );
		$pills_html_deco .= $build_pill( $company, true );
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'block' ) );
	?>
	<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
		<div class="portfolio-marquee-wrap">
			<?php foreach ( array( 'ltr', 'rtl', 'ltr' ) as $row_index => $dir ) : ?>
			<div class="marquee-row marquee-row--<?php echo esc_attr( $dir ); ?>"<?php echo 0 === $row_index ? '' : ' aria-hidden="true"'; ?>>
				<div class="marquee-track">
					<?php
					// Two copies for a seamless loop. Only the first copy of the
					// first row is exposed to assistive tech; the rest is decorative.
					echo 0 === $row_index ? $pills_html : $pills_html_deco; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo $pills_html_deco; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					?>
				</div>
			</div>
			<?php endforeach; ?>
		</div>

		<?php if ( '' !== $cta_label ) : ?>
		<div class="portfolio-marquee-cta">
			<a class="btn btn-ghost" href="<?php echo esc_url( $cta_url ); ?>">
				<span><?php echo wp_kses_post( $cta_label ); ?></span>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</a>
		</div>
		<?php endif; ?>
	</section>

<?php
// ── GRID MODE (default) ───────────────────────────────────────────────────────
else :

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'block warm' ) );
	?>
	<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
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

			<div class="portfolio-filters">
				<div class="filter-group filter-status">
					<button class="filter-btn active" data-filter-type="status" data-filter-val="Active">Active</button>
					<button class="filter-btn" data-filter-type="status" data-filter-val="Exit">Exits</button>
				</div>
				<div class="filter-group filter-vertical">
					<button class="filter-btn active" data-filter-type="sector" data-filter-val="All">All Verticals</button>
					<button class="filter-btn" data-filter-type="sector" data-filter-val="Life Sciences">Life Sciences</button>
					<button class="filter-btn" data-filter-type="sector" data-filter-val="Software">Software</button>
					<button class="filter-btn" data-filter-type="sector" data-filter-val="Consumer">Consumer</button>
					<button class="filter-btn" data-filter-type="sector" data-filter-val="Industrial Tech">Industrial Tech</button>
					<button class="filter-btn" data-filter-type="sector" data-filter-val="Healthcare">Healthcare</button>
					<button class="filter-btn" data-filter-type="sector" data-filter-val="Fintech">Fintech</button>
				</div>
			</div>

			<div class="portfolio-grid" id="portfolio-grid">
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
						$desc = has_excerpt( $company ) ? get_the_excerpt( $company ) : wp_strip_all_tags( $company->post_content );
					}

					if ( ! $logo_url ) {
						$logo_url = $assets_base . 'logos/' . cherrystone_blocks_logo_slug( $name ) . '.png';
					}
					?>
					<?php
					// Default status to Active if not set
					$card_status = get_post_meta( $company->ID, 'cs_status', true );
					if ( ! $card_status || 'Active' !== $card_status && 'Exit' !== $card_status ) {
						$card_status = 'Active';
					}
					?>
					<a
						href="<?php echo esc_url( $company_url ? $company_url : get_permalink( $company ) ); ?>"
						<?php echo $company_url ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>
						class="portfolio-card"
						style="text-decoration:none;color:inherit;height:100%;"
						data-status="<?php echo esc_attr( $card_status ); ?>"
						data-sector="<?php echo esc_attr( $sector_val ? $sector_val : 'Unknown' ); ?>"
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

	<script>
	document.addEventListener('DOMContentLoaded', function() {
		const grid = document.getElementById('portfolio-grid');
		if (!grid) return;

		const cards = grid.querySelectorAll('.portfolio-card');
		const filterBtns = document.querySelectorAll('.filter-btn');

		let currentStatus = 'Active';
		let currentSector = 'All';

		function filterCards() {
			cards.forEach(card => {
				const cardStatus = card.getAttribute('data-status');
				const cardSector = card.getAttribute('data-sector');
				
				const statusMatch = (currentStatus === 'All' || cardStatus === currentStatus);
				const sectorMatch = (currentSector === 'All' || cardSector === currentSector);

				if (statusMatch && sectorMatch) {
					card.classList.remove('hidden');
				} else {
					card.classList.add('hidden');
				}
			});
		}

		filterBtns.forEach(btn => {
			btn.addEventListener('click', function() {
				const type = this.getAttribute('data-filter-type');
				const val = this.getAttribute('data-filter-val');

				// Update active classes for the group
				const siblings = this.parentElement.querySelectorAll('.filter-btn');
				siblings.forEach(s => s.classList.remove('active'));
				this.classList.add('active');

				if (type === 'status') {
					currentStatus = val;
				} else if (type === 'sector') {
					currentSector = val;
				}

				filterCards();
			});
		});

		// Initial filter
		filterCards();
	});
	</script>
	<?php
endif;
