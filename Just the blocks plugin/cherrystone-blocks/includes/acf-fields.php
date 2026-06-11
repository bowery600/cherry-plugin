<?php
/**
 * Register Advanced Custom Fields (ACF) Local Field Groups.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'acf/init', 'cherrystone_blocks_register_acf_fields' );
function cherrystone_blocks_register_acf_fields() {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	// 1. Portfolio Companies
	acf_add_local_field_group( array(
		'key' => 'group_cherry_portfolio',
		'title' => 'Company Details',
		'fields' => array(
			array(
				'key' => 'field_cs_logo_url',
				'label' => 'Company Logo',
				'name' => 'cs_logo_url',
				'type' => 'image',
				'instructions' => 'Optional fallback; prefer Featured Image',
				'return_format' => 'url',
				'preview_size' => 'medium',
				'library' => 'all',
			),
			array(
				'key' => 'field_cs_sector',
				'label' => 'Industry Vertical',
				'name' => 'cs_sector',
				'type' => 'select',
				'choices' => array(
					'Life Sciences' => 'Life Sciences',
					'Software' => 'Software',
					'Consumer' => 'Consumer',
					'Industrial Tech' => 'Industrial Tech',
					'Healthcare' => 'Healthcare',
					'Fintech' => 'Fintech',
				),
				'allow_null' => 1,
				'ui' => 1,
				'return_format' => 'value',
			),
			array(
				'key' => 'field_cs_company_description',
				'label' => 'Elevator Pitch / Description',
				'name' => 'cs_company_description',
				'type' => 'textarea',
				'rows' => 4,
			),
			array(
				'key' => 'field_cs_company_url',
				'label' => 'Outbound URL',
				'name' => 'cs_company_url',
				'type' => 'url',
			),
			array(
				'key' => 'field_cs_status',
				'label' => 'Status',
				'name' => 'cs_status',
				'type' => 'button_group',
				'choices' => array(
					'Active' => 'Active',
					'Exit' => 'Exit',
				),
				'default_value' => 'Active',
				'layout' => 'horizontal',
			),
			array(
				'key' => 'field_cs_stage',
				'label' => 'Stage',
				'name' => 'cs_stage',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_location',
				'label' => 'Location',
				'name' => 'cs_location',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_exit_details',
				'label' => 'Exit Details',
				'name' => 'cs_exit_details',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_initials',
				'label' => 'Initials (logo text fallback)',
				'name' => 'cs_initials',
				'type' => 'text',
			),
		),
		'location' => array(
			array(
				array(
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'cherry_portfolio',
				),
			),
		),
		'menu_order' => 0,
		'position' => 'normal',
		'style' => 'default',
		'label_placement' => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen' => '',
		'active' => true,
		'description' => '',
	) );

	// 2. Pitch Night Details
	acf_add_local_field_group( array(
		'key' => 'group_cherry_pitch_event',
		'title' => 'Pitch Night Details',
		'fields' => array(
			array(
				'key' => 'field_cs_event_image_url',
				'label' => 'Event Image / Flyer',
				'name' => 'cs_event_image_url',
				'type' => 'image',
				'instructions' => 'Optional fallback; prefer Featured Image',
				'return_format' => 'url',
				'preview_size' => 'medium',
				'library' => 'all',
			),
			array(
				'key' => 'field_cs_event_date',
				'label' => 'Event Date',
				'name' => 'cs_event_date',
				'type' => 'date_picker',
				'display_format' => 'F j, Y',
				'return_format' => 'Y-m-d',
				'first_day' => 1,
			),
			array(
				'key' => 'field_cs_application_deadline',
				'label' => 'Application Deadline',
				'name' => 'cs_application_deadline',
				'type' => 'date_picker',
				'display_format' => 'F j, Y',
				'return_format' => 'Y-m-d',
				'first_day' => 1,
			),
			array(
				'key' => 'field_cs_event_location',
				'label' => 'Location',
				'name' => 'cs_event_location',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_event_type',
				'label' => 'Event Type',
				'name' => 'cs_event_type',
				'type' => 'text',
				'instructions' => 'e.g. In-person',
			),
			array(
				'key' => 'field_cs_event_spots',
				'label' => 'Spots / Capacity note',
				'name' => 'cs_event_spots',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_registration_url',
				'label' => 'Registration URL',
				'name' => 'cs_registration_url',
				'type' => 'url',
			),
			array(
				'key' => 'field_cs_agenda',
				'label' => 'Agenda Items',
				'name' => 'cs_agenda',
				'type' => 'textarea',
				'instructions' => 'One per line',
				'rows' => 4,
			),
		),
		'location' => array(
			array(
				array(
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'cherry_pitch_event',
				),
			),
		),
		'menu_order' => 0,
		'position' => 'normal',
		'style' => 'default',
		'label_placement' => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen' => '',
		'active' => true,
		'description' => '',
	) );

	// 3. Members (leadership + regular members share one field group; the
	// "Is Leadership" toggle surfaces a member on the public Leadership page).
	acf_add_local_field_group( array(
		'key' => 'group_cherry_member',
		'title' => 'Member Details',
		'fields' => array(
			array(
				'key' => 'field_cs_is_leadership',
				'label' => 'Is Leadership',
				'name' => 'cs_is_leadership',
				'type' => 'true_false',
				'message' => 'Show this member on the public Leadership page (they always appear in the Member Directory).',
				'ui' => 1,
			),
			array(
				'key' => 'field_cs_member_photo_url',
				'label' => 'Headshot / Photo',
				'name' => 'cs_member_photo_url',
				'type' => 'image',
				'instructions' => 'Optional fallback; prefer Featured Image',
				'return_format' => 'url',
				'preview_size' => 'medium',
				'library' => 'all',
			),
			array(
				'key' => 'field_cs_member_description',
				'label' => 'Description / Bio',
				'name' => 'cs_member_description',
				'type' => 'textarea',
				'rows' => 4,
			),
			array(
				'key' => 'field_cs_member_role',
				'label' => 'Role / Title',
				'name' => 'cs_member_role',
				'type' => 'text',
				'instructions' => 'e.g. Angel Investor',
			),
			array(
				'key' => 'field_cs_member_linkedin_url',
				'label' => 'LinkedIn URL',
				'name' => 'cs_member_linkedin_url',
				'type' => 'url',
			),
		),
		'location' => array(
			array(
				array(
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'cherry_member',
				),
			),
		),
		'menu_order' => 0,
		'position' => 'normal',
		'style' => 'default',
		'label_placement' => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen' => '',
		'active' => true,
		'description' => '',
	) );

	// 5. Member Resources
	acf_add_local_field_group( array(
		'key' => 'group_cherry_resource',
		'title' => 'Resource Access',
		'fields' => array(
			array(
				'key' => 'field_cs_resource_file_url',
				'label' => 'Resource File / Document',
				'name' => 'cs_resource_file_url',
				'type' => 'file',
				'instructions' => 'Upload a PDF, document, or image',
				'return_format' => 'url',
			),
			array(
				'key' => 'field_cs_resource_description',
				'label' => 'Description',
				'name' => 'cs_resource_description',
				'type' => 'textarea',
				'rows' => 4,
			),
			array(
				'key' => 'field_cs_resource_url',
				'label' => 'Resource URL',
				'name' => 'cs_resource_url',
				'type' => 'url',
			),
			array(
				'key' => 'field_cs_resource_type',
				'label' => 'Resource Type / Audience',
				'name' => 'cs_resource_type',
				'type' => 'text',
				'instructions' => 'e.g. Investors',
			),
			array(
				'key' => 'field_cs_source',
				'label' => 'Source / Publisher',
				'name' => 'cs_source',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_member_only',
				'label' => 'Member Only',
				'name' => 'cs_member_only',
				'type' => 'true_false',
				'message' => 'Require a logged-in member/editor account to view this resource.',
				'ui' => 1,
			),
		),
		'location' => array(
			array(
				array(
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'cherry_resource',
				),
			),
		),
		'menu_order' => 0,
		'position' => 'normal',
		'style' => 'default',
		'label_placement' => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen' => '',
		'active' => true,
		'description' => '',
	) );

	// 6. Communications
	acf_add_local_field_group( array(
		'key' => 'group_cherry_communication',
		'title' => 'Communication Details',
		'fields' => array(
			array(
				'key' => 'field_cs_communication_image_url',
				'label' => 'Header Image',
				'name' => 'cs_communication_image_url',
				'type' => 'image',
				'instructions' => 'Optional fallback; prefer Featured Image',
				'return_format' => 'url',
				'preview_size' => 'medium',
				'library' => 'all',
			),
			array(
				'key' => 'field_cs_communication_date',
				'label' => 'Display Date',
				'name' => 'cs_communication_date',
				'type' => 'date_picker',
				'display_format' => 'F j, Y',
				'return_format' => 'Y-m-d',
				'first_day' => 1,
			),
			array(
				'key' => 'field_cs_communication_author',
				'label' => 'Author / Byline',
				'name' => 'cs_communication_author',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_communication_category',
				'label' => 'Category',
				'name' => 'cs_communication_category',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_communication_source_url',
				'label' => 'Original Source URL',
				'name' => 'cs_communication_source_url',
				'type' => 'url',
			),
			array(
				'key' => 'field_cs_communication_body_json',
				'label' => 'Imported Body JSON',
				'name' => 'cs_communication_body_json',
				'type' => 'textarea',
				'instructions' => 'Optional',
				'rows' => 4,
			),
		),
		'location' => array(
			array(
				array(
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'cherry_communication',
				),
			),
		),
		'menu_order' => 0,
		'position' => 'normal',
		'style' => 'default',
		'label_placement' => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen' => '',
		'active' => true,
		'description' => '',
	) );

	// 7. Sponsors & Partners
	acf_add_local_field_group( array(
		'key' => 'group_cherry_sponsor',
		'title' => 'Sponsor / Partner Details',
		'fields' => array(
			array(
				'key' => 'field_cs_sponsor_logo_url',
				'label' => 'Logo URL',
				'name' => 'cs_sponsor_logo_url',
				'type' => 'image',
				'instructions' => 'Optional fallback; prefer Featured Image',
				'return_format' => 'url',
				'preview_size' => 'medium',
				'library' => 'all',
			),
			array(
				'key' => 'field_cs_sponsor_logo_alt',
				'label' => 'Logo Description (Alt Text)',
				'name' => 'cs_sponsor_logo_alt',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_sponsor_url',
				'label' => 'Sponsor Website URL',
				'name' => 'cs_sponsor_url',
				'type' => 'url',
			),
			array(
				'key' => 'field_cs_sponsor_description',
				'label' => 'Sponsor Description',
				'name' => 'cs_sponsor_description',
				'type' => 'textarea',
				'rows' => 4,
			),
			array(
				'key' => 'field_cs_sponsor_tier',
				'label' => 'Sponsor Tier / Grouping',
				'name' => 'cs_sponsor_tier',
				'type' => 'select',
				'choices' => array(
					'Sponsors' => 'Sponsors',
					'Partners' => 'Partners',
				),
				'default_value' => 'Sponsors',
				'allow_null' => 0,
				'ui' => 1,
				'return_format' => 'value',
			),
		),
		'location' => array(
			array(
				array(
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'cherry_sponsor',
				),
			),
		),
		'menu_order' => 0,
		'position' => 'normal',
		'style' => 'default',
		'label_placement' => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen' => '',
		'active' => true,
		'description' => '',
	) );

	// 8. Testimonials
	acf_add_local_field_group( array(
		'key' => 'group_cherry_testimonial',
		'title' => 'Testimonial Details',
		'fields' => array(
			array(
				'key' => 'field_cs_testimonial_photo_url',
				'label' => 'Founder Photo',
				'name' => 'cs_testimonial_photo_url',
				'type' => 'image',
				'instructions' => 'Optional fallback; prefer Featured Image',
				'return_format' => 'url',
				'preview_size' => 'medium',
				'library' => 'all',
			),
			array(
				'key' => 'field_cs_testimonial_quote',
				'label' => 'Quote Content',
				'name' => 'cs_testimonial_quote',
				'type' => 'textarea',
				'rows' => 4,
			),
			array(
				'key' => 'field_cs_testimonial_author',
				'label' => 'Author Name',
				'name' => 'cs_testimonial_author',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_testimonial_role',
				'label' => 'Author Role / Title',
				'name' => 'cs_testimonial_role',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_testimonial_company',
				'label' => 'Company Name',
				'name' => 'cs_testimonial_company',
				'type' => 'text',
			),
			array(
				'key' => 'field_cs_testimonial_round',
				'label' => 'Funding Round / Size',
				'name' => 'cs_testimonial_round',
				'type' => 'text',
				'instructions' => 'e.g. $1.5M Seed',
			),
		),
		'location' => array(
			array(
				array(
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'cherry_testimonial',
				),
			),
		),
		'menu_order' => 0,
		'position' => 'normal',
		'style' => 'default',
		'label_placement' => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen' => '',
		'active' => true,
		'description' => '',
	) );

}
