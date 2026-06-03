import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Portfolio',
			heading: 'The active portfolio.',
			lede: 'A live view of the New England companies our members have backed. Six verticals, real businesses, real founders.',
			showGraphic: true,
			showMeta: false,
		},
	],
	[ 'cherrystone/portfolio-grid', {} ],
	[ 'cherrystone/footer-cta', {} ],
];

const ALLOWED_BLOCKS = TEMPLATE.map( ( [ name ] ) => name );

export default function Edit() {
	const blockProps = useBlockProps( {
		className:
			'cherrystone-page-template cherrystone-page-portfolio-template',
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks
				template={ TEMPLATE }
				templateLock="all"
				allowedBlocks={ ALLOWED_BLOCKS }
			/>
		</div>
	);
}
