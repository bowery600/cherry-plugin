import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Our Network',
			heading: 'The ecosystem behind the capital.',
			lede: 'Cherrystone partners with accelerators, universities, funds, and ecosystem builders who help founders move from promising ideas to fundable companies.',
			showGraphic: true,
			showMeta: false,
		},
	],
	[
		'core/html',
		{
			content:
				'<section class="network-benefits-section"><div class="container network-benefits-layout"><div class="network-benefits-intro"><span class="eyebrow accent">Ecosystem</span><h2>Connected support for New England founders.</h2><p class="lede">Our partner network expands the reach of Cherrystone members through mentorship, sector expertise, co-investment relationships, and founder programming.</p><a class="btn btn-ghost" href="mailto:info@cherrystoneangelgroup.com?subject=Partnership%20with%20Cherrystone">Explore partnership</a></div><div class="network-benefit-grid"><article><h3>Source stronger companies.</h3><p>Trusted partners help high-potential founders find the right capital and operating feedback earlier.</p></article><article><h3>Share expertise.</h3><p>Sector organizations, universities, and accelerators bring focused knowledge into the screening conversation.</p></article><article><h3>Support follow-on growth.</h3><p>Portfolio companies benefit from a broader set of advisors, introductions, and regional resources.</p></article><article><h3>Build the region.</h3><p>Partnership keeps more talent, capital, and company-building momentum in New England.</p></article></div></div></section>',
		},
	],
	[
		'cherrystone/sponsors',
		{
			eyebrow: 'Sponsors',
			heading: 'Our Sponsors',
			tierFilter: 'Sponsors',
		},
	],
    [
		'cherrystone/sponsors',
		{
			eyebrow: 'Partners',
			heading: 'Ecosystem Partners',
			tierFilter: 'Partners',
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
			'cherrystone-page-template cherrystone-page-network-template',
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
