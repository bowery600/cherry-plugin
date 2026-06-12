<?php
/**
 * Starter-content seeding for the Cherrystone operational content types.
 *
 * Imports the real Cherrystone portfolio, member resources, and Pitch Night
 * events (sourced from the React site's data.js, exported to
 * includes/seed-content.json) into the cherry_portfolio, cherry_resource, and
 * cherry_pitch_event post types so editors manage them as wp-admin post lists.
 *
 * @package CherrystoneBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load the bundled starter dataset.
 *
 * @return array{portfolio: array, resources: array, events: array}
 */
function cherrystone_blocks_get_seed_data() {
	$path = CHERRYSTONE_BLOCKS_PATH . 'includes/seed-content.json';

	if ( ! file_exists( $path ) ) {
		return array(
			'portfolio'  => array(),
			'resources'  => array(),
			'events'     => array(),
			'leadership' => array(),
		);
	}

	$data = json_decode( file_get_contents( $path ), true );

	return wp_parse_args(
		is_array( $data ) ? $data : array(),
		array(
			'portfolio' => array(),
			'resources' => array(),
			'events'    => array(),
			'leadership' => array(),
		)
	);
}

/**
 * Convert a short month label ("Oct") plus day/year to an ISO date.
 *
 * @param array $event Event row with day/month/year keys.
 * @return string ISO date (Y-m-d) or empty string when unparseable.
 */
function cherrystone_blocks_event_iso_date( $event ) {
	$day   = isset( $event['day'] ) ? $event['day'] : '';
	$month = isset( $event['month'] ) ? $event['month'] : '';
	$year  = isset( $event['year'] ) ? $event['year'] : '';

	if ( ! $day || ! $month || ! $year ) {
		return '';
	}

	$timestamp = strtotime( "$day $month $year" );

	return $timestamp ? gmdate( 'Y-m-d', $timestamp ) : '';
}

/**
 * Find an existing seeded post of a type by its title.
 *
 * @param string $post_type Post type slug.
 * @param string $title     Post title.
 * @return int Post ID or 0 when none exists.
 */
function cherrystone_blocks_find_seeded_post( $post_type, $title ) {
	$existing = get_posts(
		array(
			'post_type'        => $post_type,
			'title'            => $title,
			'post_status'      => 'any',
			'posts_per_page'   => 1,
			'fields'           => 'ids',
			'suppress_filters' => false,
		)
	);

	return ! empty( $existing ) ? (int) $existing[0] : 0;
}

/**
 * Import a local file as an attachment and set it as the post's featured image
 * and optionally as a custom meta field value.
 *
 * @param int    $post_id         Post ID.
 * @param string $local_file_path Absolute path to the local file.
 * @param string $title           Attachment title.
 * @param string $meta_key        Optional custom meta key to update with the URL.
 * @param bool   $set_thumbnail   Whether to set the attachment as the post's featured image.
 * @return int Attachment ID on success, 0 on failure.
 */
function cherrystone_blocks_import_local_image( $post_id, $local_file_path, $title = '', $meta_key = '', $set_thumbnail = true ) {
	if ( ! file_exists( $local_file_path ) ) {
		return 0;
	}

	$filename = basename( $local_file_path );
	$attach_id = 0;

	// Check if this attachment already exists in the Media Library (matched by filename/slug)
	$existing_attachments = get_posts( array(
		'post_type'      => 'attachment',
		'post_status'    => 'inherit',
		'posts_per_page' => 1,
		'meta_query'     => array(
			array(
				'key'     => '_wp_attached_file',
				'value'   => $filename,
				'compare' => 'LIKE',
			),
		),
		'fields'         => 'ids',
	) );

	if ( ! empty( $existing_attachments ) ) {
		$attach_id = intval( $existing_attachments[0] );
	} else {
		// Enable SVG uploads temporarily for programmatic import
		$svg_filter = function( $mimes ) {
			$mimes['svg'] = 'image/svg+xml';
			return $mimes;
		};
		add_filter( 'upload_mimes', $svg_filter );

		$wp_upload_dir = wp_upload_dir();
		if ( ! empty( $wp_upload_dir['error'] ) ) {
			remove_filter( 'upload_mimes', $svg_filter );
			return 0;
		}

		$dest_path = wp_unique_filename( $wp_upload_dir['path'], $filename );
		$dest_file = $wp_upload_dir['path'] . '/' . $dest_path;

		if ( ! copy( $local_file_path, $dest_file ) ) {
			remove_filter( 'upload_mimes', $svg_filter );
			return 0;
		}

		$filetype = wp_check_filetype( $filename, null );
		$attachment = array(
			'post_mime_type' => $filetype['type'],
			'post_title'     => sanitize_file_name( $title ? $title : pathinfo( $filename, PATHINFO_FILENAME ) ),
			'post_content'   => '',
			'post_status'    => 'inherit',
		);

		$inserted = wp_insert_attachment( $attachment, $dest_file, $post_id );
		remove_filter( 'upload_mimes', $svg_filter );

		if ( is_wp_error( $inserted ) ) {
			return 0;
		}
		$attach_id = intval( $inserted );

		require_once ABSPATH . 'wp-admin/includes/image.php';
		$attach_data = wp_generate_attachment_metadata( $attach_id, $dest_file );
		wp_update_attachment_metadata( $attach_id, $attach_data );
	}

	// Now we have the attachment ID. Let's FORCE set it as featured image and metadata value!
	if ( $attach_id ) {
		if ( $set_thumbnail ) {
			set_post_thumbnail( $post_id, $attach_id );
		}

		if ( $meta_key ) {
			$url = wp_get_attachment_url( $attach_id );
			if ( $url ) {
				update_post_meta( $post_id, $meta_key, $url );
			}
		}
	}

	return $attach_id;
}

/**
 * Seed the operational content types with the bundled starter dataset.
 *
 * Idempotent: posts already present (matched by title) are skipped, so the
 * routine is safe to run on activation, on version upgrade, and on demand.
 *
 * @return array{portfolio:int, resources:int, events:int} Count of created posts.
 */
function cherrystone_blocks_seed_content() {
	$data    = cherrystone_blocks_get_seed_data();
	$created = array(
		'portfolio'    => 0,
		'resources'    => 0,
		'events'       => 0,
		'leadership'   => 0,
		'sponsors'     => 0,
		'testimonials' => 0,
		'people'       => 0,
	);

	foreach ( $data['portfolio'] as $company ) {
		$title = isset( $company['name'] ) ? $company['name'] : '';

		if ( ! $title ) {
			continue;
		}

		$post_id = cherrystone_blocks_find_seeded_post( 'cherry_portfolio', $title );
		if ( ! $post_id ) {
			$post_id = wp_insert_post(
				array(
					'post_type'    => 'cherry_portfolio',
					'post_status'  => 'publish',
					'post_title'   => $title,
					'post_content' => isset( $company['desc'] ) ? $company['desc'] : '',
				),
				true
			);

			if ( is_wp_error( $post_id ) ) {
				continue;
			}

			$created['portfolio']++;
		} else {
			wp_update_post(
				array(
					'ID'           => $post_id,
					'post_content' => isset( $company['desc'] ) ? $company['desc'] : '',
				)
			);
		}

		update_post_meta( $post_id, 'cs_sector', isset( $company['sector'] ) ? $company['sector'] : '' );
		update_post_meta( $post_id, 'cs_stage', isset( $company['stage'] ) ? $company['stage'] : '' );
		update_post_meta( $post_id, 'cs_company_url', isset( $company['url'] ) ? $company['url'] : '' );
		update_post_meta( $post_id, 'cs_initials', isset( $company['initials'] ) ? $company['initials'] : '' );
		update_post_meta( $post_id, 'cs_company_description', isset( $company['desc'] ) ? $company['desc'] : '' );
		update_post_meta( $post_id, 'cs_status', isset( $company['status'] ) ? $company['status'] : 'Active' );
		update_post_meta( $post_id, 'cs_exit_details', isset( $company['exit_details'] ) ? $company['exit_details'] : '' );
		update_post_meta( $post_id, '_cs_seeded', '1' );

		// Import and set logo
		$logo_dir = CHERRYSTONE_BLOCKS_PATH . 'assets/logos/';
		$slug     = cherrystone_blocks_logo_slug( $title );
		$logo_file = '';
		if ( file_exists( $logo_dir . $slug . '.png' ) ) {
			$logo_file = $logo_dir . $slug . '.png';
		} elseif ( file_exists( $logo_dir . $slug . '.svg' ) ) {
			$logo_file = $logo_dir . $slug . '.svg';
		}
		if ( $logo_file ) {
			cherrystone_blocks_import_local_image( $post_id, $logo_file, $title, 'cs_logo_url', true );
		}
	}

	foreach ( $data['resources'] as $resource ) {
		$title = isset( $resource['title'] ) ? $resource['title'] : '';

		if ( ! $title || cherrystone_blocks_find_seeded_post( 'cherry_resource', $title ) ) {
			continue;
		}

		$post_id = wp_insert_post(
			array(
				'post_type'   => 'cherry_resource',
				'post_status' => 'publish',
				'post_title'  => $title,
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			continue;
		}

		update_post_meta( $post_id, 'cs_resource_url', isset( $resource['url'] ) ? $resource['url'] : '' );
		update_post_meta( $post_id, 'cs_resource_type', isset( $resource['tag'] ) ? $resource['tag'] : '' );
		update_post_meta( $post_id, 'cs_source', isset( $resource['desc'] ) ? $resource['desc'] : '' );
		update_post_meta( $post_id, 'cs_resource_description', isset( $resource['desc'] ) ? $resource['desc'] : '' );
		update_post_meta( $post_id, 'cs_member_only', ! empty( $resource['member_only'] ) ? '1' : '' );
		update_post_meta( $post_id, '_cs_seeded', '1' );

		$created['resources']++;
	}

	foreach ( $data['events'] as $event ) {
		$title = isset( $event['title'] ) ? $event['title'] : '';

		if ( ! $title || cherrystone_blocks_find_seeded_post( 'cherry_pitch_event', $title ) ) {
			continue;
		}

		$post_id = wp_insert_post(
			array(
				'post_type'   => 'cherry_pitch_event',
				'post_status' => 'publish',
				'post_title'  => $title,
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			continue;
		}

		update_post_meta( $post_id, 'cs_event_date', cherrystone_blocks_event_iso_date( $event ) );
		update_post_meta( $post_id, 'cs_event_location', isset( $event['loc'] ) ? $event['loc'] : '' );
		update_post_meta( $post_id, 'cs_event_type', isset( $event['type'] ) ? $event['type'] : '' );
		update_post_meta( $post_id, 'cs_event_spots', isset( $event['spots'] ) ? $event['spots'] : '' );
		update_post_meta( $post_id, '_cs_seeded', '1' );

		$created['events']++;
	}

	if ( isset( $data['people'] ) && is_array( $data['people'] ) ) {
		foreach ( $data['people'] as $index => $member ) {
			$title = isset( $member['name'] ) ? $member['name'] : '';

			if ( ! $title ) {
				continue;
			}

			$post_id = cherrystone_blocks_find_seeded_post( 'cherry_member', $title );
			if ( ! $post_id ) {
				$post_id = wp_insert_post(
					array(
						'post_type'    => 'cherry_member',
						'post_status'  => 'publish',
						'post_title'   => $title,
						'post_content' => isset( $member['bio'] ) ? $member['bio'] : '',
						'menu_order'   => $index + 1,
					),
					true
				);

				if ( is_wp_error( $post_id ) ) {
					continue;
				}

				$created['people']++;
			} else {
				wp_update_post(
					array(
						'ID'           => $post_id,
						'post_content' => isset( $member['bio'] ) ? $member['bio'] : '',
						'menu_order'   => $index + 1,
					)
				);
			}

			update_post_meta( $post_id, 'cs_member_role', isset( $member['role'] ) ? $member['role'] : '' );
			update_post_meta( $post_id, 'cs_member_linkedin_url', isset( $member['linkedin'] ) ? $member['linkedin'] : '' );
			update_post_meta( $post_id, 'cs_member_description', isset( $member['bio'] ) ? $member['bio'] : '' );
			update_post_meta( $post_id, 'cs_initials', isset( $member['initials'] ) ? $member['initials'] : '' );
			update_post_meta( $post_id, '_cs_seeded', '1' );
		}
	}

	// Leadership runs after people on purpose: leaders are cherry_member posts too,
	// so this pass overrides the generic member role/bio with the richer leadership
	// data and flags them for the public Leadership page.
	if ( isset( $data['leadership'] ) && is_array( $data['leadership'] ) ) {
		foreach ( $data['leadership'] as $index => $member ) {
			$title = isset( $member['name'] ) ? $member['name'] : '';

			if ( ! $title ) {
				continue;
			}

			$bio = isset( $member['bio'] ) ? $member['bio'] : '';

			$post_id = cherrystone_blocks_find_seeded_post( 'cherry_member', $title );
			if ( ! $post_id ) {
				$post_id = wp_insert_post(
					array(
						'post_type'    => 'cherry_member',
						'post_status'  => 'publish',
						'post_title'   => $title,
						'post_content' => $bio,
						'menu_order'   => $index + 1,
					),
					true
				);

				if ( is_wp_error( $post_id ) ) {
					continue;
				}

				$created['leadership']++;
			} else {
				wp_update_post(
					array(
						'ID'           => $post_id,
						'post_content' => $bio,
						'menu_order'   => $index + 1,
					)
				);
			}

			// Keep the directory card's "Expertise: …" line after the leadership bio.
			$existing = get_post_meta( $post_id, 'cs_member_description', true );
			if ( $bio && $existing && preg_match( '/^Expertise:.*$/mi', $existing, $m ) && false === strpos( $bio, trim( $m[0] ) ) ) {
				$bio .= "\n\n" . trim( $m[0] );
			}

			update_post_meta( $post_id, 'cs_member_role', isset( $member['role'] ) ? $member['role'] : '' );
			update_post_meta( $post_id, 'cs_member_linkedin_url', isset( $member['linkedin'] ) ? $member['linkedin'] : '' );
			update_post_meta( $post_id, 'cs_member_description', $bio );
			update_post_meta( $post_id, 'cs_initials', isset( $member['initials'] ) ? $member['initials'] : '' );
			update_post_meta( $post_id, 'cs_is_leadership', '1' );
			update_post_meta( $post_id, '_cs_seeded', '1' );
		}
	}

	if ( isset( $data['sponsors'] ) && is_array( $data['sponsors'] ) ) {
		foreach ( $data['sponsors'] as $sponsor ) {
			$title = isset( $sponsor['name'] ) ? $sponsor['name'] : '';

			if ( ! $title ) {
				continue;
			}

			$post_id = cherrystone_blocks_find_seeded_post( 'cherry_sponsor', $title );
			if ( ! $post_id ) {
				$post_id = wp_insert_post(
					array(
						'post_type'   => 'cherry_sponsor',
						'post_status' => 'publish',
						'post_title'  => $title,
					),
					true
				);

				if ( is_wp_error( $post_id ) ) {
					continue;
				}

				$created['sponsors']++;
			}

			update_post_meta( $post_id, 'cs_sponsor_url', isset( $sponsor['url'] ) ? $sponsor['url'] : '' );
			update_post_meta( $post_id, 'cs_sponsor_description', isset( $sponsor['description'] ) ? $sponsor['description'] : '' );
			update_post_meta( $post_id, 'cs_sponsor_tier', isset( $sponsor['tier'] ) ? $sponsor['tier'] : 'Sponsors' );
			update_post_meta( $post_id, 'cs_sponsor_logo_alt', isset( $sponsor['logo_alt'] ) ? $sponsor['logo_alt'] : '' );
			update_post_meta( $post_id, '_cs_seeded', '1' );

			// Import and set logo
			$logo_dir = CHERRYSTONE_BLOCKS_PATH . 'assets/logos/';
			$slug     = cherrystone_blocks_logo_slug( $title );
			$logo_file = '';
			if ( file_exists( $logo_dir . $slug . '.png' ) ) {
				$logo_file = $logo_dir . $slug . '.png';
			} elseif ( file_exists( $logo_dir . $slug . '.svg' ) ) {
				$logo_file = $logo_dir . $slug . '.svg';
			}
			if ( $logo_file ) {
				cherrystone_blocks_import_local_image( $post_id, $logo_file, $title, 'cs_sponsor_logo_url', true );
			}
		}
	}

	if ( isset( $data['testimonials'] ) && is_array( $data['testimonials'] ) ) {
		foreach ( $data['testimonials'] as $testimonial ) {
			$title = isset( $testimonial['author'] ) ? $testimonial['author'] : '';

			if ( ! $title ) {
				continue;
			}

			$post_id = cherrystone_blocks_find_seeded_post( 'cherry_testimonial', $title );
			if ( ! $post_id ) {
				$post_id = wp_insert_post(
					array(
						'post_type'    => 'cherry_testimonial',
						'post_status'  => 'publish',
						'post_title'   => $title,
						'post_content' => isset( $testimonial['quote'] ) ? $testimonial['quote'] : '',
					),
					true
				);

				if ( is_wp_error( $post_id ) ) {
					continue;
				}

				$created['testimonials']++;
			}

			update_post_meta( $post_id, 'cs_testimonial_quote', isset( $testimonial['quote'] ) ? $testimonial['quote'] : '' );
			update_post_meta( $post_id, 'cs_testimonial_author', $title );
			update_post_meta( $post_id, 'cs_testimonial_role', isset( $testimonial['role'] ) ? $testimonial['role'] : '' );
			update_post_meta( $post_id, 'cs_testimonial_company', isset( $testimonial['company'] ) ? $testimonial['company'] : '' );
			update_post_meta( $post_id, 'cs_testimonial_round', isset( $testimonial['round'] ) ? $testimonial['round'] : '' );
			update_post_meta( $post_id, '_cs_seeded', '1' );

		}
	}

	if ( isset( $data['communications'] ) && is_array( $data['communications'] ) ) {
		foreach ( $data['communications'] as $comm ) {
			$title = isset( $comm['title'] ) ? $comm['title'] : '';

			if ( ! $title ) {
				continue;
			}

			// Generate simple post_content from body array if present
			$post_content = '';
			if ( isset( $comm['body'] ) && is_array( $comm['body'] ) ) {
				foreach ( $comm['body'] as $block ) {
					if ( isset( $block['type'] ) && 'p' === $block['type'] ) {
						$post_content .= "<!-- wp:paragraph --><p>" . wp_kses_post( $block['text'] ) . "</p><!-- /wp:paragraph -->\n";
					} elseif ( isset( $block['type'] ) && 'listItem' === $block['type'] ) {
						$post_content .= "<!-- wp:list-item --><li>" . wp_kses_post( $block['text'] ) . "</li><!-- /wp:list-item -->\n";
					}
				}
			}

			$post_id = cherrystone_blocks_find_seeded_post( 'cherry_communication', $title );
			if ( ! $post_id ) {
				$post_id = wp_insert_post(
					array(
						'post_type'    => 'cherry_communication',
						'post_status'  => 'publish',
						'post_title'   => $title,
						'post_content' => $post_content,
						// Use post_date if 'date' is provided
						'post_date'    => isset( $comm['date'] ) ? gmdate('Y-m-d H:i:s', strtotime( $comm['date'] )) : current_time( 'mysql' ),
					),
					true
				);

				if ( is_wp_error( $post_id ) ) {
					continue;
				}

				$created['communications'] = ( isset( $created['communications'] ) ? $created['communications'] : 0 ) + 1;
			}

			update_post_meta( $post_id, 'cs_communication_date', isset( $comm['date'] ) ? $comm['date'] : '' );
			update_post_meta( $post_id, 'cs_communication_author', isset( $comm['author'] ) ? $comm['author'] : '' );
			update_post_meta( $post_id, 'cs_communication_category', isset( $comm['cat'] ) ? $comm['cat'] : '' );
			update_post_meta( $post_id, 'cs_communication_source_url', isset( $comm['url'] ) ? $comm['url'] : '' );
			update_post_meta( $post_id, 'cs_communication_image_url', isset( $comm['image'] ) ? $comm['image'] : '' );
			update_post_meta( $post_id, '_cs_seeded', '1' );
		}
	}

	// Seed page templates (Home, About, Apply, Communications, Leadership, Member Interest, Member Portal, Members, Pitch, Portfolio)
	$pages_to_seed = array(
		'home'            => array(
			'title'   => 'Home',
			'content' => '<!-- wp:cherrystone/page-home /-->',
		),
		'about'           => array(
			'title'   => 'About',
			'content' => '<!-- wp:cherrystone/page-about /-->',
		),
		'apply'           => array(
			'title'   => 'Apply',
			'content' => '<!-- wp:cherrystone/page-apply /-->',
		),
		'communications'  => array(
			'title'   => 'Communications',
			'content' => '<!-- wp:cherrystone/page-communications /-->',
		),
		'leadership'      => array(
			'title'   => 'Leadership',
			'content' => '<!-- wp:cherrystone/page-leadership /-->',
		),
		'member-interest' => array(
			'title'   => 'Member Interest',
			'content' => '<!-- wp:cherrystone/page-member-interest /-->',
		),
		'member-portal'   => array(
			'title'   => 'Member Portal',
			'content' => '<!-- wp:cherrystone/page-member-portal --><div class="wp-block-cherrystone-page-member-portal cherrystone-page-template cherrystone-page-member-portal-template"><!-- wp:cherrystone/member-portal /--></div><!-- /wp:cherrystone/page-member-portal -->',
		),
		'member-directory' => array(
			'title'   => 'Member Directory',
			'content' => '<!-- wp:cherrystone/page-member-directory /-->',
		),
		'members'         => array(
			'title'   => 'Members',
			'content' => '<!-- wp:cherrystone/page-members /-->',
		),
		'pitch'           => array(
			'title'   => 'Pitch',
			'content' => '<!-- wp:cherrystone/page-pitch /-->',
		),
		'portfolio'       => array(
			'title'   => 'Portfolio',
			'content' => '<!-- wp:cherrystone/page-portfolio /-->',
		),
		// Static page compositions stored as block markup files; a bare
		// self-closing wp:cherrystone/page-* comment renders nothing because
		// these wrappers are not registered blocks.
		'sponsors'        => array(
			'title'   => 'Sponsors',
			'content' => (string) file_get_contents( __DIR__ . '/seed-pages/sponsors.html' ),
		),
		'partners'        => array(
			'title'   => 'Partners',
			'content' => (string) file_get_contents( __DIR__ . '/seed-pages/partners.html' ),
		),
	);

	foreach ( $pages_to_seed as $slug => $page_data ) {
		// Check if page already exists by slug to remain idempotent
		$existing_pages = get_posts(
			array(
				'post_type'   => 'page',
				'name'        => $slug,
				'post_status' => 'any',
				'numberposts' => 1,
			)
		);

		if ( empty( $existing_pages ) ) {
			$page_id = wp_insert_post(
				array(
					'post_type'    => 'page',
					'post_status'  => 'publish',
					'post_title'   => $page_data['title'],
					'post_name'    => $slug,
					'post_content' => $page_data['content'],
				)
			);

			// Automatically configure Home page as the site's Front Page
			if ( 'home' === $slug && ! is_wp_error( $page_id ) && $page_id > 0 ) {
				update_option( 'show_on_front', 'page' );
				update_option( 'page_on_front', $page_id );
			}
		}
	}

	return $created;
}
