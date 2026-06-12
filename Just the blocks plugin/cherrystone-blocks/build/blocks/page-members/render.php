<?php
/**
 * Server-rendered Members page.
 *
 * Mirrors the Apply for Capital page structure: hero metadata, readiness
 * panel, process timeline, form, and footer CTA.
 *
 * @package CherrystoneBlocks
 */

$arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>';

$steps = array(
	array(
		'num'    => '01',
		'phase'  => 'Inquire',
		'status' => 'complete',
		'title'  => 'Express Interest',
		'desc'   => 'Tell us about your operating, investing, or industry background and how you want to participate.',
	),
	array(
		'num'    => '02',
		'phase'  => 'Meet',
		'status' => 'complete',
		'title'  => 'Leadership Conversation',
		'desc'   => 'Meet Cherrystone leadership to discuss fit, expectations, cadence, and the member-led investment model.',
	),
	array(
		'num'    => '03',
		'phase'  => 'Review',
		'status' => 'active',
		'title'  => 'Accreditation Review',
		'desc'   => 'Confirm accredited investor status and alignment with our active participation expectations.',
	),
	array(
		'num'    => '04',
		'phase'  => 'Engage',
		'status' => 'pending',
		'title'  => 'Committee Fit',
		'desc'   => 'Identify where your judgment can help: sourcing, screening, portfolio support, outreach, or sector diligence.',
	),
	array(
		'num'    => '05',
		'phase'  => 'Join',
		'status' => 'pending',
		'title'  => 'Onboarding',
		'desc'   => 'Join the member community, attend meetings, review memos, and participate in active dealflow.',
	),
);

ob_start();
?>
<div class="cherrystone-page-template cherrystone-page-members-template">
	<section class="page-hero with-graphic">
		<div class="page-hero-graphic" aria-hidden="true"></div>
		<div class="container">
			<span class="eyebrow accent"><?php esc_html_e( 'Members', 'cherrystone-blocks' ); ?></span>
			<h1 style="margin-top:24px"><?php esc_html_e( 'Become a member.', 'cherrystone-blocks' ); ?></h1>
			<p class="lede"><?php esc_html_e( 'Cherrystone is a community of accredited investors. Members source deals, sit on screening committees, and write checks together - all in a single, member-led ecosystem.', 'cherrystone-blocks' ); ?></p>
			<div class="page-hero-meta">
				<span><strong><?php esc_html_e( 'Status', 'cherrystone-blocks' ); ?></strong> <?php esc_html_e( 'Accredited investors', 'cherrystone-blocks' ); ?></span>
				<span><strong><?php esc_html_e( 'Cadence', 'cherrystone-blocks' ); ?></strong> <?php esc_html_e( 'Rolling review', 'cherrystone-blocks' ); ?></span>
				<span><strong><?php esc_html_e( 'Region', 'cherrystone-blocks' ); ?></strong> <?php esc_html_e( 'New England roots', 'cherrystone-blocks' ); ?></span>
			</div>
			<div class="application-progress" aria-label="<?php esc_attr_e( 'Membership readiness 0%', 'cherrystone-blocks' ); ?>">
				<div>
					<span><?php esc_html_e( 'Membership readiness', 'cherrystone-blocks' ); ?></span>
					<strong>0%</strong>
				</div>
				<span class="application-progress-track"><span style="width:0%"></span></span>
			</div>
			<div class="page-hero-actions">
				<a class="btn btn-accent" href="#member-interest-form">
					<span><?php esc_html_e( 'Express interest in joining', 'cherrystone-blocks' ); ?></span>
					<?php echo $arrow; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
				<a class="btn btn-ghost" href="<?php echo esc_url( home_url( '/leadership' ) ); ?>">
					<span><?php esc_html_e( 'Meet leadership', 'cherrystone-blocks' ); ?></span>
					<?php echo $arrow; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>
		</div>
	</section>

	<section class="block warm diligence-timeline-section">
		<div class="container">
			<div class="block-head">
				<div>
					<span class="eyebrow accent"><?php esc_html_e( 'Process', 'cherrystone-blocks' ); ?></span>
					<h2 style="margin-top:24px"><?php esc_html_e( 'The path to membership.', 'cherrystone-blocks' ); ?></h2>
				</div>
				<p class="lede"><?php esc_html_e( 'We keep the process direct and personal. A brief inquiry starts the conversation, then onboarding follows our investment cadence.', 'cherrystone-blocks' ); ?></p>
			</div>
			<div class="timeline-container">
				<div class="timeline-track"><div class="timeline-track-progress" style="width:0%"></div></div>
				<div class="timeline-grid">
					<?php foreach ( $steps as $step ) : ?>
						<div class="timeline-step <?php echo 'active' === $step['status'] ? 'is-active' : ''; ?>" role="button" tabindex="0">
							<div class="timeline-node-wrap">
								<div class="timeline-node-pulse"></div>
								<div class="timeline-node-ring"></div>
								<div class="timeline-node"></div>
							</div>
							<div class="timeline-card">
								<span class="timeline-step-num"><?php echo esc_html( 'STEP ' . $step['num'] . ' - ' . strtoupper( $step['phase'] ) ); ?></span>
								<h3><?php echo esc_html( $step['title'] ); ?></h3>
								<p><?php echo esc_html( $step['desc'] ); ?></p>
								<span class="timeline-status-badge <?php echo 'active' === $step['status'] ? 'active' : ''; ?>"><?php echo esc_html( $step['status'] ); ?></span>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</section>

	<section id="member-interest-form" class="block cherrystone-form-block">
		<div class="container">
			<div class="block-head">
				<div><h2 class="cherrystone-form-heading"><?php esc_html_e( 'Join the investor community.', 'cherrystone-blocks' ); ?></h2></div>
				<p class="lede"><?php esc_html_e( 'Tell us a little about your background, investment interests, and connection to the Cherrystone network.', 'cherrystone-blocks' ); ?></p>
			</div>
			<form class="cherrystone-member-form" data-cherry-form="member-interest" data-recipient="info@cherrystoneangelgroup.com" novalidate>
				<div class="form-grid">
					<div class="field"><label for="cs-mi-name"><?php esc_html_e( 'Name *', 'cherrystone-blocks' ); ?></label><input id="cs-mi-name" name="name" type="text" placeholder="Jane Investor" autocomplete="name"><span class="field-error-msg" data-error-for="name" hidden></span></div>
					<div class="field"><label for="cs-mi-email"><?php esc_html_e( 'Email *', 'cherrystone-blocks' ); ?></label><input id="cs-mi-email" name="email" type="email" placeholder="you@example.com" autocomplete="email"><span class="field-error-msg" data-error-for="email" hidden></span></div>
					<div class="field full"><label for="cs-mi-location"><?php esc_html_e( 'Location', 'cherrystone-blocks' ); ?></label><input id="cs-mi-location" name="location" type="text" placeholder="Providence, Boston, New York, etc."></div>
					<div class="field full"><label for="cs-mi-background"><?php esc_html_e( 'Professional / investing background *', 'cherrystone-blocks' ); ?></label><textarea id="cs-mi-background" name="background" placeholder="Operating, investing, industry, or board experience."></textarea><span class="field-error-msg" data-error-for="background" hidden></span></div>
					<div class="field full"><label for="cs-mi-interest"><?php esc_html_e( 'Why are you interested in Cherrystone? *', 'cherrystone-blocks' ); ?></label><textarea id="cs-mi-interest" name="interest" placeholder="What draws you to the group, and how would you like to participate?"></textarea><span class="field-error-msg" data-error-for="interest" hidden></span></div>
				</div>
				<div class="cherrystone-form-actions"><button type="submit" class="btn btn-accent"><?php esc_html_e( 'Express interest', 'cherrystone-blocks' ); ?></button></div>
			</form>
		</div>
	</section>
</div>
<?php
return ob_get_clean();
