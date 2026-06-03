<?php
/**
 * Server render for the gated Member Portal block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Saved member portal content.
 * @var WP_Block $block      Block instance.
 *
 * @package CherrystoneBlocks
 */

if ( ! function_exists( 'cherrystone_blocks_render_member_portal_content' ) ) {
	/**
	 * Render default member portal content when the block is self-closing.
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	function cherrystone_blocks_render_member_portal_content( $attributes ) {
		$hero_eyebrow      = isset( $attributes['heroEyebrow'] ) ? $attributes['heroEyebrow'] : __( 'Member portal', 'cherrystone-blocks' );
		$hero_heading      = isset( $attributes['heroHeading'] ) ? $attributes['heroHeading'] : __( 'Member information and resources.', 'cherrystone-blocks' );
		$hero_lede         = isset( $attributes['heroLede'] ) ? $attributes['heroLede'] : __( 'Calendar, screening committee assignments, dues information, and member-only documents.', 'cherrystone-blocks' );
		$events_eyebrow    = isset( $attributes['eventsEyebrow'] ) ? $attributes['eventsEyebrow'] : __( 'This year', 'cherrystone-blocks' );
		$events_heading    = isset( $attributes['eventsHeading'] ) ? $attributes['eventsHeading'] : __( 'Upcoming meetings.', 'cherrystone-blocks' );
		$events_lede       = isset( $attributes['eventsLede'] ) ? $attributes['eventsLede'] : __( 'All times Eastern. Member meetings are confidential; please do not forward calendar invites.', 'cherrystone-blocks' );
		$events            = isset( $attributes['events'] ) && is_array( $attributes['events'] ) ? $attributes['events'] : array();
		$resources_eyebrow = isset( $attributes['resourcesEyebrow'] ) ? $attributes['resourcesEyebrow'] : __( 'Documents', 'cherrystone-blocks' );
		$resources_heading = isset( $attributes['resourcesHeading'] ) ? $attributes['resourcesHeading'] : __( 'Member-only resources.', 'cherrystone-blocks' );
		$resources_lede    = isset( $attributes['resourcesLede'] ) ? $attributes['resourcesLede'] : __( 'For internal use by current members. Do not redistribute.', 'cherrystone-blocks' );
		$resources         = isset( $attributes['resources'] ) && is_array( $attributes['resources'] ) ? $attributes['resources'] : array();

		ob_start();
		?>
		<div class="wp-block-cherrystone-member-portal">
			<section class="page-hero">
				<div class="container">
					<span class="eyebrow accent"><?php echo wp_kses_post( $hero_eyebrow ); ?></span>
					<h1 style="margin-top:24px;font-size:clamp(48px, 6vw, 88px);"><?php echo wp_kses_post( $hero_heading ); ?></h1>
					<p class="lede"><?php echo wp_kses_post( $hero_lede ); ?></p>
				</div>
			</section>
			<section class="block">
				<div class="container">
					<div class="block-head">
						<div>
							<span class="eyebrow accent"><?php echo wp_kses_post( $events_eyebrow ); ?></span>
							<h2 style="margin-top:24px;"><?php echo wp_kses_post( $events_heading ); ?></h2>
						</div>
						<p class="lede"><?php echo wp_kses_post( $events_lede ); ?></p>
					</div>
					<?php foreach ( $events as $event ) : ?>
						<div class="event-card">
							<div class="event-date">
								<span class="month"><?php echo esc_html( trim( ( $event['month'] ?? '' ) . ' ' . ( $event['year'] ?? '' ) ) ); ?></span>
								<?php if ( ! empty( $event['day'] ) ) : ?>
									<span class="day"><?php echo esc_html( $event['day'] ); ?></span>
								<?php endif; ?>
							</div>
							<div class="event-info">
								<h3 style="color:<?php echo empty( $event['day'] ) ? 'var(--ink-muted)' : 'inherit'; ?>;"><?php echo wp_kses_post( $event['title'] ?? '' ); ?></h3>
								<?php if ( ! empty( $event['loc'] ) ) : ?>
									<div class="meta">
										<span><?php echo wp_kses_post( $event['loc'] ); ?></span>
										<span class="sep">-</span>
										<span><?php echo wp_kses_post( $event['type'] ?? '' ); ?></span>
									</div>
								<?php endif; ?>
							</div>
							<?php if ( ! empty( $event['ctaLabel'] ) && ! empty( $event['url'] ) ) : ?>
								<a class="btn btn-ghost" href="<?php echo esc_url( $event['url'] ); ?>"><?php echo esc_html( $event['ctaLabel'] ); ?></a>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				</div>
			</section>
			<section class="block warm">
				<div class="container">
					<div class="block-head">
						<div>
							<span class="eyebrow accent"><?php echo wp_kses_post( $resources_eyebrow ); ?></span>
							<h2 style="margin-top:24px;"><?php echo wp_kses_post( $resources_heading ); ?></h2>
						</div>
						<p class="lede"><?php echo wp_kses_post( $resources_lede ); ?></p>
					</div>
					<div class="value-grid">
						<?php foreach ( $resources as $index => $resource ) : ?>
							<?php
							$resource_title = isset( $resource['title'] ) ? $resource['title'] : '';
							$resource_url   = isset( $resource['url'] ) ? $resource['url'] : '';
							$href           = $resource_url ? $resource_url : 'mailto:info@cherrystoneangelgroup.com?subject=' . rawurlencode( 'Member resource request: ' . $resource_title );
							$is_external    = $resource_url && preg_match( '#^https?://#i', $resource_url );
							?>
							<a class="value-card member-resource-card" href="<?php echo esc_url( $href ); ?>" <?php echo $is_external ? 'target="_blank" rel="noopener noreferrer"' : ''; ?> style="height:100%;text-decoration:none;color:inherit;">
								<span class="num"><?php echo esc_html( sprintf( '0%d - %s', $index + 1, $resource['tag'] ?? '' ) ); ?></span>
								<h3><?php echo wp_kses_post( $resource_title ); ?></h3>
								<p><?php echo wp_kses_post( $resource['desc'] ?? '' ); ?></p>
								<span class="resource-link"><?php echo $resource_url ? esc_html__( 'Open resource', 'cherrystone-blocks' ) : esc_html__( 'Request access', 'cherrystone-blocks' ); ?></span>
							</a>
						<?php endforeach; ?>
					</div>
				</div>
			</section>
		</div>
		<?php
		return ob_get_clean();
	}
}

if ( function_exists( 'cherrystone_blocks_member_portal_is_authenticated' ) && cherrystone_blocks_member_portal_is_authenticated() ) {
	echo trim( $content ) ? $content : cherrystone_blocks_render_member_portal_content( $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- saved block markup is already rendered by WordPress; fallback is escaped above.
	return;
}

$failed      = isset( $_GET['cs_member_login'] ) && 'failed' === sanitize_key( wp_unslash( $_GET['cs_member_login'] ) );
$apply_url   = home_url( '/apply' );
$wrapper     = get_block_wrapper_attributes( array( 'class' => 'page-hero cherrystone-member-gate' ) );
$form_action = remove_query_arg( array( 'cs_member_login', 'cs_member_logout' ) );

if ( ! defined( 'DONOTCACHEPAGE' ) ) {
	define( 'DONOTCACHEPAGE', true );
}
do_action( 'litespeed_control_set_nocache', 'cherrystone_member_portal' );
?>
<section <?php echo $wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?> style="padding-bottom:140px;">
	<div class="container" style="max-width:560px;">
		<span class="eyebrow accent"><?php esc_html_e( 'Members only', 'cherrystone-blocks' ); ?></span>
		<h1 style="margin-top:24px;font-size:clamp(40px, 5vw, 64px);"><?php esc_html_e( 'Sign in to continue.', 'cherrystone-blocks' ); ?></h1>
		<p class="lede" style="margin-top:24px;">
			<?php esc_html_e( 'This area is restricted to current Cherrystone members. Enter the shared access password distributed by Cherrystone to view member info, calendar, and directory.', 'cherrystone-blocks' ); ?>
		</p>
		<form method="post" action="<?php echo esc_url( $form_action ); ?>" style="margin-top:36px;padding:32px;border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--surface);display:flex;flex-direction:column;gap:16px;">
			<?php wp_nonce_field( 'cherrystone_member_portal_login', 'cherrystone_member_portal_nonce' ); ?>
			<input type="hidden" name="cherrystone_member_portal_login" value="1">
			<label for="member-gate-pw" class="mono" style="font-size:11px;color:var(--ink-muted);letter-spacing:0.08em;text-transform:uppercase;">
				<?php esc_html_e( 'Member password', 'cherrystone-blocks' ); ?>
			</label>
			<input
				id="member-gate-pw"
				name="cherrystone_member_portal_password"
				type="password"
				placeholder="<?php esc_attr_e( 'Enter password', 'cherrystone-blocks' ); ?>"
				autocomplete="current-password"
				required
				style="padding:14px 18px;border:1px solid var(--line);border-radius:8px;font-size:16px;font-family:inherit;outline:none;background:var(--paper);color:var(--ink);"
			>
			<?php if ( $failed ) : ?>
				<div style="font-size:13px;color:var(--accent-ink);font-family:var(--font-mono);">
					<?php esc_html_e( 'Incorrect password. Try again.', 'cherrystone-blocks' ); ?>
				</div>
			<?php endif; ?>
			<div style="display:flex;gap:12px;margin-top:8px;align-items:center;justify-content:space-between;flex-wrap:wrap;">
				<span class="mono" style="font-size:11px;color:var(--ink-muted);letter-spacing:0.06em;">
					<?php esc_html_e( 'Contact Cherrystone if you need access.', 'cherrystone-blocks' ); ?>
				</span>
				<button type="submit" class="btn btn-primary">
					<?php esc_html_e( 'Sign in', 'cherrystone-blocks' ); ?>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
				</button>
			</div>
		</form>
		<div style="margin-top:32px;font-size:14px;color:var(--ink-muted);">
			<?php esc_html_e( 'Not a member?', 'cherrystone-blocks' ); ?>
			<a href="<?php echo esc_url( $apply_url ); ?>" style="color:var(--accent-ink);font-weight:600;display:inline-flex;align-items:center;gap:6px;text-decoration:none;">
				<?php esc_html_e( 'Apply to join the group', 'cherrystone-blocks' ); ?>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;" aria-hidden="true" focusable="false"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
			</a>
		</div>
	</div>
</section>
