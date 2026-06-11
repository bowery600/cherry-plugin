import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Member interest',
			heading: 'Join the investor community.',
			lede: 'Tell us a little about your background, investment interests, and connection to the Cherrystone network.',
			showGraphic: true,
			showMeta: false,
		},
	],
	[ 'cherrystone/member-interest-form', {} ],
	[ 'cherrystone/footer-cta', {} ],
];

const ALLOWED_BLOCKS = TEMPLATE.map( ( [ name ] ) => name );

export default function Edit() {
	const blockProps = useBlockProps( {
		className:
			'cherrystone-page-template cherrystone-page-member-interest-template',
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
