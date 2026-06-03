import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	__experimentalNumberControl as NumberControl,
	ExternalLink,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const {
		eyebrow,
		heading,
		lede,
		committeeFilter,
		maxItems,
	} = attributes;
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
						label={ __( 'Max members (0 = all)', 'cherrystone-blocks' ) }
						min={ 0 }
						value={ maxItems }
						onChange={ ( value ) =>
							setAttributes( { maxItems: parseInt( value, 10 ) || 0 } )
						}
					/>
					<TextControl
						label={ __( 'Filter by committee (optional)', 'cherrystone-blocks' ) }
						help={ __( 'Exact committee name, e.g. Healthcare & Life Sciences. Leave blank for all.', 'cherrystone-blocks' ) }
						value={ committeeFilter }
						onChange={ ( value ) => setAttributes( { committeeFilter: value } ) }
					/>
					<p>
						<ExternalLink href="/wp-admin/edit.php?post_type=cherry_member">
							{ __( 'Manage Regular Members →', 'cherrystone-blocks' ) }
						</ExternalLink>
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block="cherrystone/people-grid"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
