import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'About us',
			heading: 'A community of operators<br>and investors. Since 2004.',
			lede: 'Cherrystone Angel Group invests in early stage companies, primarily in New England across many industry verticals. Our group is made up of qualified investors who have either built their own companies or have extensive experience launching new ventures. We bring industry expertise and a range of business skills to our portfolio companies. It is our intention to be an active and trusted partner to the founding teams of our portfolio companies.',
			showGraphic: true,
			showMeta: true,
			metaItems: [
				{ label: 'Founded', value: '2004' },
				{ label: 'HQ', value: 'Providence, RI' },
				{ label: 'Verticals', value: '6' },
			],
		},
	],
	[
		'core/html',
		{
			content:
				'<section class="about-statement"><div class="container"><div class="about-statement-label"><span></span>What we bring</div><div class="about-statement-rotator" aria-live="polite" aria-label="Cherrystone value propositions"><p class="asr-phrase"><strong>Investment capital</strong> for founders when they need it most.</p><p class="asr-phrase"><strong>Multi-sector expertise</strong> and connections to support growth.</p><p class="asr-phrase"><strong>Executive leadership</strong> to help companies scale.</p></div><div class="about-statement-pips" aria-hidden="true"><span></span><span></span><span></span></div></div></section>',
		},
	],
	[
		'cherrystone/verticals-showcase',
		{
			eyebrow: 'Verticals',
			heading: 'Six industry sectors.',
			lede: 'Our group has deep experience across six key sectors, allowing us to source and vet high-growth opportunities.',
		},
	],
	[
		'cherrystone/entry-cards',
		{
			dividerLabel: 'Join Cherrystone',
			cards: [
				{
					tag: 'For Companies',
					eyebrow: 'EARLY & MIDDLE STAGE',
					title: 'We invest in entrepreneurial and driven management teams.',
					body: 'Please complete our application for consideration.',
					ctaLabel: 'Apply for Funding',
					url: '/apply',
				},
				{
					tag: 'For Members',
					eyebrow: 'QUALIFIED INVESTORS',
					title: 'Participate in meetings, social events, and educational sessions.',
					body: 'Our members are encouraged to be involved in the evaluation process around potential investment opportunities.',
					ctaLabel: 'Become a Member',
					url: '/members',
				},
			],
		},
	],
	[
		'cherrystone/pitch-night-spotlight',
		{
			eyebrow: 'Pitch Night 2025',
			heading: 'Annual Pitch Night',
			lede: 'On October 14, 2025, Cherrystone Angel Group will hold the much anticipated annual Pitch Night. A selection of 6-8 companies from the New England Area will present their startup ideas in front of a crowd of investors, experts, and a panel of judges. For more information on the event and how to apply, click on Learn More link below.',
			eventDate: 'October 14, 2025',
			location: 'Providence Innovation District, RI',
			ctaText: 'Learn More',
			ctaLink: '/pitch',
		},
	],
	[
		'core/image',
		{
			alt: 'Pitch Night Conference Crowd',
			align: 'full',
		},
	],
	[
		'cherrystone/testimonials',
		{
			eyebrow: 'Feedback',
			heading: 'Feedback from our portfolio companies',
			lede: 'Real quotes from CEOs at Advanced Silicon Group, Egal Pads, and Flourish Care.',
		},
	],
	[
		'cherrystone/portfolio-grid',
		{
			heading: 'Recent Investments',
			ctaLabel: 'Portfolio',
			ctaUrl: '/portfolio',
		},
	],
	[
		'cherrystone/sponsors',
		{
			eyebrow: 'Sponsors',
			heading: 'Our Sponsors',
		},
	],
	[
		'core/buttons',
		{
			layout: {
				type: 'flex',
				justifyContent: 'center',
			},
		},
		[
			[
				'core/button',
				{
					text: 'View Sponsors',
					url: '/sponsors',
				},
			],
		],
	],
	[
		'cherrystone/footer-cta',
		{
			eyebrow: 'Get started',
			heading: 'Ready to Get Started?',
			cards: [
				{
					label: 'FOR COMPANIES',
					title: 'Apply for Funding',
					body: 'Apply below to be considered for funding.',
					ctaLabel: 'Apply for Funding',
					url: '/apply',
					buttonStyle: 'accent',
				},
				{
					label: 'FOR MEMBERS',
					title: 'Become a Member',
					body: 'Join our investor network.',
					ctaLabel: 'Become a Member',
					url: '/members',
					buttonStyle: 'light',
				},
			],
		},
	],
];

const ALLOWED_BLOCKS = [
	'core/image',
	'core/columns',
	'core/column',
	'core/paragraph',
	'core/html',
	'core/buttons',
	'core/button',
	'cherrystone/page-hero',
	'cherrystone/verticals-showcase',
	'cherrystone/entry-cards',
	'cherrystone/pitch-night-spotlight',
	'cherrystone/testimonials',
	'cherrystone/portfolio-grid',
	'cherrystone/sponsors',
	'cherrystone/footer-cta',
];

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'cherrystone-page-template cherrystone-page-about-template',
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
