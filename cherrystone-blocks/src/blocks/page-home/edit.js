import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [
	[ 'cherrystone/coastal-motif-spline-hero', {} ],
	[ 'cherrystone/entry-cards', {} ],
	[ 'cherrystone/ticker-strip', {} ],
	[ 'cherrystone/core-features', {} ],
	[ 'cherrystone/investment-lens', {} ],
	[ 'cherrystone/stats', {} ],
	[ 'cherrystone/portfolio-grid', {} ],
	[ 'cherrystone/testimonials', {} ],
	[ 'cherrystone/sponsors', {} ],
	[ 'cherrystone/footer-cta', {} ],
];

const ALLOWED_BLOCKS = TEMPLATE.map( ( [ name ] ) => name );

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'cherrystone-page-template cherrystone-page-home-template',
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
