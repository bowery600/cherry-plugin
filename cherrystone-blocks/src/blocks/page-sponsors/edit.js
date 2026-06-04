import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Sponsors',
			heading: 'Our Sponsors',
			lede: 'Our sponsors are highly valued, strategic partners that enable us to build and further advance the New England innovation ecosystem.',
			showGraphic: true,
			showMeta: false,
		},
	],
	[
		'core/html',
		{
			content:
				'<section class="about-statement" data-phrases="4"><div class="container"><div class="about-statement-label"><span></span>Becoming a sponsor will</div><div class="about-statement-rotator" aria-live="polite" aria-label="Sponsor benefits"><p class="asr-phrase"><strong>Increase the visibility</strong> of your organization on our website and marketing materials.</p><p class="asr-phrase"><strong>Show your support</strong> to the New England start-up community that creates jobs and grows the economy.</p><p class="asr-phrase"><strong>Provide a window</strong> on emerging companies and talented entrepreneurs.</p><p class="asr-phrase"><strong>Present opportunities</strong> to meet Cherrystone members and portfolio companies at special events.</p></div><div class="about-statement-pips" aria-hidden="true"><span></span><span></span><span></span><span></span></div></div></section>',
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
