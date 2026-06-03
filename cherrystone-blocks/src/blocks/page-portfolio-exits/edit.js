import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Portfolio',
			heading: 'Our exits.',
			lede: 'A record of the companies we’ve backed and successfully exited. From strategic acquisitions to initial public offerings.',
			showGraphic: true,
			showMeta: false,
		},
	],
	[
		'cherrystone/portfolio-grid',
		{
			eyebrow: 'Exits',
			heading: 'Exited Portfolio',
			lede: 'A historical view of our realized investments.',
			ctaLabel: '',
			ctaUrl: '',
			statusFilter: 'Exit'
		}
	],
	[ 'cherrystone/footer-cta', {} ],
];

const ALLOWED_BLOCKS = TEMPLATE.map( ( [ name ] ) => name );

export default function Edit() {
	const blockProps = useBlockProps( {
		className:
			'cherrystone-page-template cherrystone-page-portfolio-exits-template',
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
