<?php
/**
 * Server-rendered Member Directory page.
 *
 * Uses cherry_member posts so each card is managed from the Members plugin tab
 * and updates as members are added, edited, unpublished, or removed.
 *
 * @package CherrystoneBlocks
 */

if ( ! function_exists( 'cherrystone_member_network_graphic' ) ) {
	/**
	 * Abstract member-network constellation: interconnected nodes and lines.
	 *
	 * @param string $color Stroke/fill color.
	 * @return string SVG markup.
	 */
	function cherrystone_member_network_graphic( $color = 'var(--accent)' ) {
		// x, y, radius, opacity, type (fill|ring|hub|hub2).
		$nodes = array(
			array( 150, 396, 3, 0.35, 'fill' ),
			array( 226, 322, 4, 0.5, 'fill' ),
			array( 306, 388, 5, 0.5, 'ring' ),
			array( 364, 296, 3, 0.4, 'fill' ),
			array( 436, 352, 5, 0.85, 'hub' ),
			array( 502, 424, 3.5, 0.45, 'fill' ),
			array( 566, 326, 4.5, 0.5, 'ring' ),
			array( 472, 236, 3, 0.5, 'fill' ),
			array( 544, 176, 3.5, 0.6, 'hub2' ),
			array( 420, 148, 3.5, 0.4, 'fill' ),
			array( 326, 200, 4, 0.45, 'ring' ),
			array( 248, 242, 3, 0.35, 'fill' ),
			array( 178, 178, 2.5, 0.3, 'fill' ),
			array( 604, 248, 3, 0.4, 'fill' ),
			array( 382, 466, 3, 0.35, 'fill' ),
			array( 282, 462, 2.5, 0.3, 'fill' ),
			array( 600, 458, 4, 0.45, 'ring' ),
			array( 252, 118, 3, 0.35, 'fill' ),
			array( 482, 82, 2.5, 0.3, 'fill' ),
			array( 562, 92, 3.5, 0.45, 'fill' ),
		);

		// node a, node b, line opacity.
		$edges = array(
			array( 0, 1, 0.18 ),
			array( 1, 2, 0.22 ),
			array( 1, 11, 0.2 ),
			array( 2, 3, 0.25 ),
			array( 2, 4, 0.3 ),
			array( 2, 14, 0.18 ),
			array( 3, 4, 0.32 ),
			array( 3, 10, 0.22 ),
			array( 4, 5, 0.3 ),
			array( 4, 6, 0.28 ),
			array( 4, 7, 0.32 ),
			array( 5, 6, 0.25 ),
			array( 5, 16, 0.2 ),
			array( 6, 8, 0.25 ),
			array( 6, 13, 0.22 ),
			array( 7, 8, 0.28 ),
			array( 7, 9, 0.25 ),
			array( 8, 13, 0.2 ),
			array( 8, 19, 0.25 ),
			array( 9, 10, 0.22 ),
			array( 9, 18, 0.18 ),
			array( 10, 11, 0.2 ),
			array( 10, 17, 0.18 ),
			array( 11, 12, 0.16 ),
			array( 12, 17, 0.15 ),
			array( 14, 15, 0.15 ),
			array( 18, 19, 0.2 ),
		);

		$lines = '';
		foreach ( $edges as $edge ) {
			$a      = $nodes[ $edge[0] ];
			$b      = $nodes[ $edge[1] ];
			$lines .= sprintf(
				'<line x1="%s" y1="%s" x2="%s" y2="%s" opacity="%s" />',
				$a[0],
				$a[1],
				$b[0],
				$b[1],
				$edge[2]
			);
		}

		$dots = '';
		foreach ( $nodes as $i => $node ) {
			list( $x, $y, $r, $o, $type ) = $node;

			if ( 'ring' === $type ) {
				$dots .= sprintf( '<circle cx="%1$s" cy="%2$s" r="%3$s" fill="none" stroke-width="1.25" opacity="%4$s" />', $x, $y, $r, $o );
				continue;
			}

			if ( 'hub' === $type ) {
				$dots .= sprintf( '<circle class="nn-pulse" cx="%1$s" cy="%2$s" r="16" fill="none" stroke-width="1" opacity="0.18" />', $x, $y );
				$dots .= sprintf( '<circle cx="%1$s" cy="%2$s" r="10" fill="none" stroke-width="1" opacity="0.4" />', $x, $y );
			} elseif ( 'hub2' === $type ) {
				$dots .= sprintf( '<circle class="nn-pulse nn-pulse-2" cx="%1$s" cy="%2$s" r="8" fill="none" stroke-width="1" opacity="0.3" />', $x, $y );
			}

			$pulse = ( 1 === $i || 19 === $i ) ? ' class="nn-pulse nn-pulse-3"' : '';
			$dots .= sprintf( '<circle%6$s cx="%1$s" cy="%2$s" r="%3$s" fill="%4$s" stroke="none" opacity="%5$s" />', $x, $y, $r, esc_attr( $color ), $o, $pulse );
		}

		return sprintf(
			'<svg class="member-network-svg" viewBox="0 0 640 520" preserveAspectRatio="xMidYMid meet" style="width:100%%;height:100%%;" aria-hidden="true" focusable="false"><g stroke="%1$s" stroke-width="1" fill="none">%2$s</g><g stroke="%1$s">%3$s</g></svg>',
			esc_attr( $color ),
			$lines,
			$dots
		);
	}
}

if ( function_exists( 'cherrystone_blocks_member_portal_is_authenticated' ) && ! cherrystone_blocks_member_portal_is_authenticated() ) {
	$failed      = isset( $_GET['cs_member_login'] ) && 'failed' === sanitize_key( wp_unslash( $_GET['cs_member_login'] ) );
	$form_action = remove_query_arg( array( 'cs_member_login', 'cs_member_logout' ) );

	if ( ! defined( 'DONOTCACHEPAGE' ) ) {
		define( 'DONOTCACHEPAGE', true );
	}
	do_action( 'litespeed_control_set_nocache', 'cherrystone_member_directory' );
	nocache_headers();

	?>
	<section class="page-hero with-graphic cherrystone-member-gate" style="padding-bottom:140px;">
		<div class="page-hero-graphic" aria-hidden="true"><?php echo cherrystone_member_network_graphic(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
		<div class="container" style="max-width:560px;">
			<span class="eyebrow accent"><?php esc_html_e( 'Members only', 'cherrystone-blocks' ); ?></span>
			<h1 style="margin-top:24px;font-size:clamp(40px, 5vw, 64px);"><?php esc_html_e( 'Sign in to continue.', 'cherrystone-blocks' ); ?></h1>
			<p class="lede" style="margin-top:24px;">
				<?php esc_html_e( 'This area is restricted to current Cherrystone members. Enter the shared access password distributed by Cherrystone to view member info, calendar, and directory.', 'cherrystone-blocks' ); ?>
			</p>
			<form class="member-gate-form" method="post" action="<?php echo esc_url( $form_action ); ?>">
				<?php wp_nonce_field( 'cherrystone_member_portal_login', 'cherrystone_member_portal_nonce' ); ?>
				<input type="hidden" name="cherrystone_member_portal_login" value="1">
				<label for="member-directory-gate-pw" class="mono"><?php esc_html_e( 'Member password', 'cherrystone-blocks' ); ?></label>
				<input id="member-directory-gate-pw" name="cherrystone_member_portal_password" type="password" placeholder="<?php esc_attr_e( 'Enter password', 'cherrystone-blocks' ); ?>" autocomplete="current-password">
				<?php if ( $failed ) : ?>
					<div class="member-gate-error"><?php esc_html_e( 'Incorrect password. Try again.', 'cherrystone-blocks' ); ?></div>
				<?php endif; ?>
				<div class="member-gate-actions">
					<span class="mono"><?php esc_html_e( 'Contact Cherrystone if you need access.', 'cherrystone-blocks' ); ?></span>
					<button type="submit" class="btn btn-primary"><?php esc_html_e( 'Sign in', 'cherrystone-blocks' ); ?></button>
				</div>
			</form>
			<div class="member-gate-footnote">
				<?php esc_html_e( 'Not a member?', 'cherrystone-blocks' ); ?>
				<a href="<?php echo esc_url( home_url( '/members' ) ); ?>"><?php esc_html_e( 'Apply to join the group ->', 'cherrystone-blocks' ); ?></a>
			</div>
		</div>
	</section>
	<?php
	return;
}

$members = get_posts(
	array(
		'post_type'      => 'cherry_member',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => 'title',
		'order'          => 'ASC',
	)
);

$total_members = count( $members );

$member_roles = array();
foreach ( $members as $member ) {
	$member_role = get_post_meta( $member->ID, 'cs_member_role', true );
	if ( $member_role && ! in_array( $member_role, $member_roles, true ) ) {
		$member_roles[] = $member_role;
	}
}
sort( $member_roles, SORT_NATURAL | SORT_FLAG_CASE );

?>
<div class="cherrystone-page-template cherrystone-page-member-directory-template" data-member-directory>
	<section class="page-hero with-graphic">
		<div class="page-hero-graphic" aria-hidden="true"><?php echo cherrystone_member_network_graphic(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
		<div class="container">
			<div class="member-portal-tabs">
				<div class="member-portal-tab-list" aria-label="<?php esc_attr_e( 'Member portal sections', 'cherrystone-blocks' ); ?>">
					<a class="member-portal-tab" href="<?php echo esc_url( home_url( '/member-portal' ) ); ?>"><?php esc_html_e( 'Info & Resources', 'cherrystone-blocks' ); ?></a>
					<a class="member-portal-tab is-active" href="<?php echo esc_url( home_url( '/member-directory' ) ); ?>" aria-current="page"><?php esc_html_e( 'Member Directory', 'cherrystone-blocks' ); ?></a>
				</div>
				<a class="member-portal-signout mono" href="<?php echo esc_url( add_query_arg( 'cs_member_logout', '1', home_url( '/member-directory' ) ) ); ?>"><?php esc_html_e( 'Sign out ->', 'cherrystone-blocks' ); ?></a>
			</div>
			<span class="eyebrow accent"><?php esc_html_e( 'Member portal', 'cherrystone-blocks' ); ?></span>
			<h1 style="margin-top:24px;font-size:clamp(48px, 6vw, 88px);"><?php esc_html_e( 'Member directory.', 'cherrystone-blocks' ); ?></h1>
			<p class="lede">
				<?php
				printf(
					/* translators: %d: member count. */
					esc_html__( 'Confidential. %d active members. Use the search to find someone by name, expertise, or company.', 'cherrystone-blocks' ),
					(int) $total_members
				);
				?>
			</p>
			<div class="member-directory-search-wrap">
				<input
					class="member-directory-search"
					type="search"
					aria-label="<?php esc_attr_e( 'Search members by name, expertise, or company', 'cherrystone-blocks' ); ?>"
					placeholder="<?php esc_attr_e( 'Search by name, expertise, or company', 'cherrystone-blocks' ); ?>"
					data-member-directory-search
				>
				<select
					class="member-directory-select"
					aria-label="<?php esc_attr_e( 'Filter members by role', 'cherrystone-blocks' ); ?>"
					data-member-directory-role
				>
					<option value=""><?php esc_html_e( 'All roles', 'cherrystone-blocks' ); ?></option>
					<?php foreach ( $member_roles as $member_role ) : ?>
						<option value="<?php echo esc_attr( strtolower( $member_role ) ); ?>"><?php echo esc_html( $member_role ); ?></option>
					<?php endforeach; ?>
				</select>
				<select
					class="member-directory-select"
					aria-label="<?php esc_attr_e( 'Sort members', 'cherrystone-blocks' ); ?>"
					data-member-directory-sort
				>
					<option value="first-asc"><?php esc_html_e( 'First name A-Z', 'cherrystone-blocks' ); ?></option>
					<option value="last-asc"><?php esc_html_e( 'Last name A-Z', 'cherrystone-blocks' ); ?></option>
					<option value="first-desc"><?php esc_html_e( 'Name Z-A', 'cherrystone-blocks' ); ?></option>
				</select>
			</div>
		</div>
	</section>

	<section class="block warm">
		<div class="container">
			<div class="member-directory-count mono" aria-live="polite" data-member-directory-count data-total="<?php echo esc_attr( (string) $total_members ); ?>">
				<?php
				printf(
					/* translators: 1: visible count, 2: total count. */
					esc_html__( 'Showing %1$d of %2$d', 'cherrystone-blocks' ),
					(int) $total_members,
					(int) $total_members
				);
				?>
			</div>

			<?php if ( $members ) : ?>
				<div class="member-grid">
					<?php foreach ( $members as $member ) : ?>
						<?php
						$name      = get_the_title( $member );
						$role      = get_post_meta( $member->ID, 'cs_member_role', true );
						$linkedin  = get_post_meta( $member->ID, 'cs_member_linkedin_url', true );
						$bio       = get_post_meta( $member->ID, 'cs_member_description', true );
						$bio       = $bio ? $bio : $member->post_content;
						$photo_url = get_the_post_thumbnail_url( $member->ID, 'medium' );

						if ( ! $photo_url ) {
							$photo_url = get_post_meta( $member->ID, 'cs_member_photo_url', true );
						}

						$words    = preg_split( '/\s+/', trim( $name ) );
						$initials = '';
						foreach ( $words as $word ) {
							$initials .= isset( $word[0] ) ? strtoupper( $word[0] ) : '';
						}
						$initials = substr( $initials, 0, 2 );

						$search_text = strtolower( trim( $name . ' ' . $role . ' ' . wp_strip_all_tags( $bio ) ) );
						$last_name   = strtolower( end( $words ) );
						?>
						<article class="member-card" tabindex="0" data-member-card data-search="<?php echo esc_attr( $search_text ); ?>" data-name="<?php echo esc_attr( strtolower( $name ) ); ?>" data-last="<?php echo esc_attr( $last_name ); ?>" data-role="<?php echo esc_attr( strtolower( $role ) ); ?>" style="cursor:pointer;height:100%;">
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
							<p class="member-bio"><?php echo esc_html( $bio ); ?></p>
							<?php if ( $linkedin ) : ?>
								<span class="member-link-cta"><a href="<?php echo esc_url( $linkedin ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'LinkedIn ->', 'cherrystone-blocks' ); ?></a></span>
							<?php endif; ?>
						</article>
					<?php endforeach; ?>
				</div>
				<p class="member-directory-empty lede" hidden data-member-directory-empty><?php esc_html_e( 'No members match that search.', 'cherrystone-blocks' ); ?></p>
			<?php else : ?>
				<p class="lede"><?php esc_html_e( 'No members have been published yet. Add members in wp-admin to populate this directory.', 'cherrystone-blocks' ); ?></p>
			<?php endif; ?>
		</div>
	</section>
</div>
