import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ExternalLink } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Section text', 'cherrystone-blocks' ) } initialOpen>
					<TextControl
						label={ __( 'Eyebrow', 'cherrystone-blocks' ) }
						value={ eyebrow }
						onChange={ ( value ) => setAttributes( { eyebrow: value } ) }
					/>
					<TextControl
						label={ __( 'Heading', 'cherrystone-blocks' ) }
						value={ heading }
						onChange={ ( value ) => setAttributes( { heading: value } ) }
					/>
					<TextareaControl
						label={ __( 'Lede', 'cherrystone-blocks' ) }
						value={ lede }
						onChange={ ( value ) => setAttributes( { lede: value } ) }
					/>
					<p>
						<ExternalLink href="/wp-admin/edit.php?post_type=cherry_testimonial">
							{ __( 'Manage Testimonials →', 'cherrystone-blocks' ) }
						</ExternalLink>
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block="cherrystone/founder-testimonial-carousel"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
