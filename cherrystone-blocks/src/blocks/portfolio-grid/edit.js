import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	TextareaControl,
	__experimentalNumberControl as NumberControl,
	ExternalLink,
	SelectControl,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const {
		eyebrow,
		heading,
		lede,
		ctaLabel,
		ctaUrl,
		maxItems,
		sectorFilter,
		statusFilter,
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
					<TextControl
						label={ __( 'CTA label', 'cherrystone-blocks' ) }
						value={ ctaLabel }
						onChange={ ( value ) => setAttributes( { ctaLabel: value } ) }
					/>
					<TextControl
						label={ __( 'CTA URL', 'cherrystone-blocks' ) }
						value={ ctaUrl }
						onChange={ ( value ) => setAttributes( { ctaUrl: value } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Display', 'cherrystone-blocks' ) } initialOpen={ false }>
					<NumberControl
						label={ __( 'Max companies (0 = all)', 'cherrystone-blocks' ) }
						min={ 0 }
						value={ maxItems }
						onChange={ ( value ) =>
							setAttributes( { maxItems: parseInt( value, 10 ) || 0 } )
						}
					/>
					<TextControl
						label={ __( 'Filter by sector (optional)', 'cherrystone-blocks' ) }
						help={ __( 'Exact sector name, e.g. Healthcare. Leave blank for all.', 'cherrystone-blocks' ) }
						value={ sectorFilter }
						onChange={ ( value ) => setAttributes( { sectorFilter: value } ) }
					/>
					<SelectControl
						label={ __( 'Filter by status', 'cherrystone-blocks' ) }
						value={ statusFilter }
						options={[
							{ label: __( 'Active Companies', 'cherrystone-blocks' ), value: 'Active' },
							{ label: __( 'Exited Companies', 'cherrystone-blocks' ), value: 'Exit' },
						]}
						onChange={ ( value ) => setAttributes( { statusFilter: value } ) }
					/>
					<p>
						<ExternalLink href="/wp-admin/edit.php?post_type=cherry_portfolio">
							{ __( 'Manage Portfolio Companies →', 'cherrystone-blocks' ) }
						</ExternalLink>
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block="cherrystone/portfolio-grid"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
