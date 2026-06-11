import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'cherrystone/member-portal', {} ],
	[
		'cherrystone/footer-cta',
		{
			eyebrow: 'Member actions',
			heading: 'Stay aligned.<br><em>Keep deals moving.</em>',
			cards: [
				{
					label: 'MEMBER RESOURCES',
					title: 'Review current documents',
					body: 'Keep governance, dues, screening, and portfolio materials close at hand.',
					ctaLabel: 'Open resources',
					url: '#resources',
					buttonStyle: 'accent',
				},
				{
					label: 'GROUP CALENDAR',
					title: 'Plan around upcoming meetings',
					body: 'Use the calendar section to track general meetings, screening sessions, and member events.',
					ctaLabel: 'View calendar',
					url: '#calendar',
					buttonStyle: 'light',
				},
			],
		},
	],
];

const ALLOWED_BLOCKS = TEMPLATE.map( ( [ name ] ) => name );

export default function Edit() {
	const blockProps = useBlockProps( {
		className:
			'cherrystone-page-template cherrystone-page-member-portal-template',
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
