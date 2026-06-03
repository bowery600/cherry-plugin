<?php
/**
 * Server-rendered Member Directory page.
 *
 * Uses cherry_member posts so each card is managed from the Members plugin tab
 * and updates as members are added, edited, unpublished, or removed.
 *
 * @package CherrystoneBlocks
 */

if ( function_exists( 'cherrystone_blocks_member_portal_is_authenticated' ) && ! cherrystone_blocks_member_portal_is_authenticated() ) {
	$failed      = isset( $_GET['cs_member_login'] ) && 'failed' === sanitize_key( wp_unslash( $_GET['cs_member_login'] ) );
	$form_action = remove_query_arg( array( 'cs_member_login', 'cs_member_logout' ) );

	if ( ! defined( 'DONOTCACHEPAGE' ) ) {
		define( 'DONOTCACHEPAGE', true );
	}
	do_action( 'litespeed_control_set_nocache', 'cherrystone_member_directory' );
	nocache_headers();

	ob_start();
	?>
	<section class="page-hero cherrystone-member-gate" style="padding-bottom:140px;">
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
	return ob_get_clean();
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

ob_start();
?>
<div class="cherrystone-page-template cherrystone-page-member-directory-template" data-member-directory>
	<section class="page-hero">
		<div class="container">
			<div class="member-portal-tabs">
				<div class="member-portal-tab-list" aria-label="<?php esc_attr_e( 'Member portal sections', 'cherrystone-blocks' ); ?>">
					<a class="member-portal-tab" href="<?php echo esc_url( home_url( '/member-portal' ) ); ?>"><?php esc_html_e( 'Info & resources', 'cherrystone-blocks' ); ?></a>
					<a class="member-portal-tab is-active" href="<?php echo esc_url( home_url( '/member-directory' ) ); ?>" aria-current="page"><?php esc_html_e( 'Directory', 'cherrystone-blocks' ); ?></a>
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
						?>
						<article class="member-card" tabindex="0" data-member-card data-search="<?php echo esc_attr( $search_text ); ?>" style="cursor:pointer;height:100%;">
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
<?php
return ob_get_clean();
