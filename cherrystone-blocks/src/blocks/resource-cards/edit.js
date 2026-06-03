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
	const { eyebrow, heading, lede, warm, maxItems, tagFilter } = attributes;
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
					<TextareaControl
						label={ __( 'Lede', 'cherrystone-blocks' ) }
						value={ lede }
						onChange={ ( value ) =>
							setAttributes( { lede: value } )
						}
					/>
					<ToggleControl
						label={ __(
							'Use warm background',
							'cherrystone-blocks'
						) }
						checked={ warm }
						onChange={ ( value ) =>
							setAttributes( { warm: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Display', 'cherrystone-blocks' ) }
					initialOpen={ false }
				>
					<NumberControl
						label={ __(
							'Max resources (0 = all)',
							'cherrystone-blocks'
						) }
						min={ 0 }
						value={ maxItems }
						onChange={ ( value ) =>
							setAttributes( {
								maxItems: parseInt( value, 10 ) || 0,
							} )
						}
					/>
					<TextControl
						label={ __(
							'Filter by audience (optional)',
							'cherrystone-blocks'
						) }
						help={ __(
							'Exact value, e.g. Investors, Entrepreneurs, Additional. Leave blank for all.',
							'cherrystone-blocks'
						) }
						value={ tagFilter }
						onChange={ ( value ) =>
							setAttributes( { tagFilter: value } )
						}
					/>
					<p>
						<ExternalLink href="/wp-admin/edit.php?post_type=cherry_resource">
							{ __(
								'Manage Member Resources →',
								'cherrystone-blocks'
							) }
						</ExternalLink>
					</p>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block="cherrystone/resource-cards"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
