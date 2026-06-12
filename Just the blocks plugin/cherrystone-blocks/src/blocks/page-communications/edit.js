import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

// NOTE: This page is server-rendered (see render.php) so the front end is
// driven entirely by code, not by the saved inner blocks. This template only
// powers the editor preview and is kept in sync with render.php's composition.
const TEMPLATE = [
	[
		'cherrystone/page-hero',
		{
			eyebrow: 'Communications',
			heading: 'From the fund,<br>to our network.',
			lede: 'Announcements, letters, and resources from Cherrystone — kept simple and kept current for our members, founders, and co-investors.',
			showGraphic: true,
			showMeta: false,
		},
	],
	// The front end renders a custom filterable feed of every communication
	// (see render.php); news-list is the closest editor stand-in.
	[
		'cherrystone/news-list',
		{
			eyebrow: 'Updates',
			heading: 'The latest from Cherrystone.',
			lede: 'Portfolio milestones, exits, pitch night news, and notes from leadership — the full record, in one place.',
			maxItems: 8,
		},
	],
	[
		'cherrystone/events-list',
		{
			eyebrow: 'Calendar',
			heading: 'Upcoming Pitch Nights.',
			lede: 'Where founders meet our members. Request an invitation or add a date to your calendar.',
			upcomingOnly: true,
		},
	],
	[
		'cherrystone/resource-cards',
		{
			eyebrow: 'Resources',
			heading: 'The library.',
			lede: 'Letters, decks, and curated links for founders and members — updated as new material is published.',
			warm: true,
			collapseAfter: 9,
		},
	],
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
