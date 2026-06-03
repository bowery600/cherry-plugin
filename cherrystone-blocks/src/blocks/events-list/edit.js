import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	ExternalLink,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, maxItems, upcomingOnly } = attributes;
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
				</PanelBody>
				<PanelBody title={ __( 'Display', 'cherrystone-blocks' ) } initialOpen={ false }>
					<NumberControl
						label={ __( 'Max events (0 = all)', 'cherrystone-blocks' ) }
						min={ 0 }
						value={ maxItems }
						onChange={ ( value ) =>
							setAttributes( { maxItems: parseInt( value, 10 ) || 0 } )
						}
					/>
					<ToggleControl
						label={ __( 'Only show upcoming events', 'cherrystone-blocks' ) }
						checked={ upcomingOnly }
						onChange={ ( value ) => setAttributes( { upcomingOnly: value } ) }
					/>
					<p>
						<ExternalLink href="/wp-admin/edit.php?post_type=cherry_pitch_event">
							{ __( 'Manage Pitch Nights →', 'cherrystone-blocks' ) }
						</ExternalLink>
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block="cherrystone/events-list"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
