import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Sponsors',
			heading: 'Our Sponsors',
			lede: 'Our sponsors are highly valued strategic partners that help Cherrystone strengthen the New England innovation ecosystem.',
			showGraphic: true,
			showMeta: false,
		},
	],
	[
		'core/html',
		{
			content:
				'<section class="sponsor-benefits-section"><div class="container sponsor-benefits-layout"><div class="sponsor-benefits-intro"><span class="eyebrow accent">Why sponsor</span><h2>Visibility, access, and real ecosystem impact.</h2><p class="lede">Sponsorship connects your organization with Cherrystone members, portfolio companies, and the founders shaping the region.</p><a class="btn btn-accent" href="mailto:info@cherrystoneangelgroup.com?subject=Becoming%20a%20Sponsor">Learn more</a></div><div class="sponsor-benefit-grid"><article><span>01</span><h3>Increase visibility.</h3><p>Your organization appears on the website, selected marketing materials, and Cherrystone communications.</p></article><article><span>02</span><h3>Support founders.</h3><p>Help strengthen the startup community that creates jobs, attracts capital, and grows the economy.</p></article><article><span>03</span><h3>See emerging companies.</h3><p>Gain a clearer window into ambitious founders and sectors moving through the angel ecosystem.</p></article><article><span>04</span><h3>Meet the network.</h3><p>Create opportunities to connect with Cherrystone members and portfolio companies at special events.</p></article></div></div></section>',
		},
	],
	[
		'cherrystone/sponsors',
		{
			eyebrow: 'Sponsors & Partners',
			heading: 'Our Ecosystem',
			tierFilter: 'Sponsors',
		},
	],
	[ 'cherrystone/footer-cta', {} ],
];

const ALLOWED_BLOCKS = [
	'cherrystone/page-hero',
	'core/html',
	'cherrystone/sponsors',
	'cherrystone/footer-cta',
];

export default function Edit() {
	const blockProps = useBlockProps( {
		className:
			'cherrystone-page-template cherrystone-page-sponsors-template',
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
