import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Apply for capital',
			heading: "Tell us what<br>you're building.",
			lede: 'For founders raising in life sciences, software, consumer, industrial tech, healthcare, or fintech. We read every application — even the ones we say no to.',
			showGraphic: true,
			showMeta: true,
			showProgress: true,
			progressLabel: 'Application readiness',
			progressValue: 0,
			metaItems: [
				{ label: 'Stage', value: 'Pre-seed to Series A' },
				{ label: 'Geography', value: 'New England preferred' },
				{ label: 'Verticals', value: '6' },
			],
		},
	],
	[ 'cherrystone/diligence-timeline', {} ],
	[ 'cherrystone/founder-application-form', {} ],
	[ 'cherrystone/footer-cta', {} ],
];

const ALLOWED_BLOCKS = TEMPLATE.map( ( [ name ] ) => name );

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'cherrystone-page-template cherrystone-page-apply-template',
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
