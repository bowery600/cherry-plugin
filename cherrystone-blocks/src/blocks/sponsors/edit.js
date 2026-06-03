import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ExternalLink,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, tierFilter } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Section text', 'cherrystone-blocks' ) }
					initialOpen
				>
					<TextControl
						label={ __( 'Eyebrow', 'cherrystone-blocks' ) }
						value={ eyebrow }
						onChange={ ( value ) =>
							setAttributes( { eyebrow: value } )
						}
					/>
					<TextControl
						label={ __( 'Heading', 'cherrystone-blocks' ) }
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
					/>
					<SelectControl
						label={ __( 'Visible group', 'cherrystone-blocks' ) }
						value={ tierFilter }
						options={ [
							{
								label: __(
									'Sponsors and partners',
									'cherrystone-blocks'
								),
								value: '',
							},
							{
								label: __(
									'Sponsors only',
									'cherrystone-blocks'
								),
								value: 'Sponsors',
							},
							{
								label: __(
									'Partners only',
									'cherrystone-blocks'
								),
								value: 'Partners',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { tierFilter: value } )
						}
					/>
					<p>
						<ExternalLink href="/wp-admin/edit.php?post_type=cherry_sponsor">
							{ __(
								'Manage Partners & Sponsors →',
								'cherrystone-blocks'
							) }
						</ExternalLink>
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block="cherrystone/sponsors"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
