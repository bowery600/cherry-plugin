import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

// NOTE: This page is server-rendered (see render.php) so the front end is
// driven entirely by code, not by the saved inner blocks. This template only
// powers the editor preview and is kept in sync with render.php's composition.
const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Communications',
			heading: 'News, letters,<br>and resources.',
			lede: 'Portfolio milestones, letters from leadership, press coverage, and Pitch Night announcements — collected in one place for founders, members, and co-investors.',
			showGraphic: true,
			showMeta: false,
		},
	],
	[ 'cherrystone/press-news-showcase', {} ],
	[ 'cherrystone/featured-news', {} ],
	[
		'cherrystone/news-list',
		{
			eyebrow: 'Latest updates',
			heading: 'Announcements & member notes.',
			lede: 'Portfolio milestones, member spotlights, and program updates from across the Cherrystone network.',
			maxItems: 6,
		},
	],
	[
		'cherrystone/events-list',
		{
			eyebrow: 'Calendar',
			heading: 'Upcoming Pitch Nights.',
			lede: 'Where founders present to our members. Add these to your calendar or request an invitation.',
			upcomingOnly: true,
		},
	],
	[
		'cherrystone/resource-cards',
		{
			eyebrow: 'Resources',
			heading: 'Letters, decks, and member resources.',
			lede: 'Curated documents and links for founders and members — updated as new material is published.',
			warm: true,
		},
	],
	[ 'cherrystone/newsletter-signup-panel', {} ],
	[ 'cherrystone/footer-cta', {} ],
];

const ALLOWED_BLOCKS = TEMPLATE.map( ( [ name ] ) => name );

export default function Edit() {
	const blockProps = useBlockProps( {
		className:
			'cherrystone-page-template cherrystone-page-communications-template',
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
