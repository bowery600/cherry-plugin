import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Pitch Night 2026',
			heading: 'Six to eight founders.<br>One evening in Providence.',
			lede: "Pitch Night is Cherrystone's flagship event for early-stage New England startups. Selected founders pitch the full membership for capital, judgment, and follow-on introductions.",
			showGraphic: true,
			showMeta: false,
		},
	],
	[
		'cherrystone/events-list',
		{
			eyebrow: 'Event',
			heading: 'Upcoming session.',
			lede: 'Annual flagship event. In-person in Providence, Rhode Island. Open to applications from founders raising in New England.',
			maxItems: 1,
			upcomingOnly: true,
		},
	],
	[
		'cherrystone/core-features',
		{
			eyebrow: 'How it runs',
			heading: 'The format.',
			lede: "A simple structure that respects everyone's time.",
			cards: [
				{
					num: '01 - APPLY',
					icon: 'layers',
					title: 'Brief application.',
					body: "What you're building, who it's for, what you've raised, why now. We read every submission.",
				},
				{
					num: '02 - SCREEN',
					icon: 'clock',
					title: 'Screening calls.',
					body: 'Selected applicants meet with the screening committee for 30 minutes per call. Two calls before invitation.',
				},
				{
					num: '03 - PITCH',
					icon: 'money',
					title: 'Pitch the room.',
					body: 'Eight minutes plus member Q&A. Funding decisions follow within two weeks.',
				},
			],
		},
	],
	[
		'cherrystone/footer-cta',
		{
			eyebrow: 'Get involved',
			heading:
				'Capital. Judgment. <em>Time.</em><br>Where founders need it.',
			cards: [
				{
					label: 'FOR FOUNDERS',
					title: 'Apply for capital',
					body: 'One application, reviewed by our investment committee within three weeks. We invest $50K-$500K at pre-seed and seed across New England and the Northeast.',
					ctaLabel: 'Start application',
					url: '/apply-for-capital',
					buttonStyle: 'accent',
				},
				{
					label: 'FOR INVESTORS',
					title: 'Become a member',
					body: 'Join 60 active members investing alongside operators, founders, and former exits. Annual cohort opens twice a year - a brief conversation starts the process.',
					ctaLabel: 'Membership details',
					url: '/member-interest',
					buttonStyle: 'light',
				},
			],
		},
	],
];

const ALLOWED_BLOCKS = TEMPLATE.map( ( [ name ] ) => name );

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'cherrystone-page-template cherrystone-page-pitch-template',
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
