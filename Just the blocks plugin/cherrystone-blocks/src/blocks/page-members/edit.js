import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Members',
			heading: 'Become a member.',
			lede: 'Cherrystone is a community of accredited investors. Members source deals, sit on screening committees, and write checks together - all in a single, member-led ecosystem.',
			showGraphic: true,
			showMeta: true,
			showActions: true,
			showProgress: true,
			progressLabel: 'Membership readiness',
			progressValue: 0,
			primaryCtaLabel: 'Express interest in joining',
			primaryCtaUrl: '#member-interest-form',
			secondaryCtaLabel: 'Meet leadership',
			secondaryCtaUrl: '/leadership',
			metaItems: [
				{ label: 'Status', value: 'Accredited investors' },
				{ label: 'Cadence', value: 'Rolling review' },
				{ label: 'Region', value: 'New England roots' },
			],
		},
	],
	[
		'cherrystone/diligence-timeline',
		{
			eyebrow: 'Process',
			heading: 'The path to membership.',
			lede: 'We keep the process direct and personal. A brief inquiry starts the conversation, then onboarding follows our investment cadence.',
			steps: [
				{
					num: '01',
					title: 'Express Interest',
					phase: 'Inquire',
					status: 'complete',
					desc: 'Tell us about your operating, investing, or industry background and how you want to participate.',
				},
				{
					num: '02',
					title: 'Leadership Conversation',
					phase: 'Meet',
					status: 'complete',
					desc: 'Meet Cherrystone leadership to discuss fit, expectations, cadence, and the member-led investment model.',
				},
				{
					num: '03',
					title: 'Accreditation Review',
					phase: 'Review',
					status: 'active',
					desc: 'Confirm accredited investor status and alignment with our active participation expectations.',
				},
				{
					num: '04',
					title: 'Committee Fit',
					phase: 'Engage',
					status: 'pending',
					desc: 'Identify where your judgment can help: sourcing, screening, portfolio support, outreach, or sector diligence.',
				},
				{
					num: '05',
					title: 'Onboarding',
					phase: 'Join',
					status: 'pending',
					desc: 'Join the member community, attend meetings, review memos, and participate in active dealflow.',
				},
			],
		},
	],
	[
		'cherrystone/member-interest-form',
		{
			heading: 'Join the investor community.',
			description:
				'Tell us a little about your background, investment interests, and connection to the Cherrystone network.',
			submitLabel: 'Express interest',
		},
	],
	[
		'cherrystone/footer-cta',
		{
			eyebrow: 'Get involved',
			heading: 'Capital. Judgment. Time.<br>Where founders need it.',
			cards: [
				{
					label: 'FOR FOUNDERS',
					title: 'Apply for capital',
					body: 'One application, reviewed by our investment committee within three weeks. We invest $50K-$500K at pre-seed and seed across New England and the Northeast.',
					ctaLabel: 'Start application',
					url: '/apply',
					buttonStyle: 'accent',
				},
				{
					label: 'FOR INVESTORS',
					title: 'Become a member',
					body: 'Join 60 active members investing alongside operators, founders, and former exits. Annual cohort opens twice a year - a brief conversation starts the process.',
					ctaLabel: 'Membership details',
					url: '/members',
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
			'cherrystone-page-template cherrystone-page-members-template',
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
