import { registerBlockType } from '@wordpress/blocks';
import { RichText, useBlockProps } from '@wordpress/block-editor';

import metadata from './block.json';
import Edit from './edit';
import save from './save';

// Handles blocks saved before the canvas→video swap so WordPress can
// silently migrate them instead of showing a validation error.
const deprecated = [
	{
		attributes: {
			kicker:           { type: 'string', default: 'COASTAL VENTURE NETWORK' },
			headline:         { type: 'string', default: 'Early-stage capital for New England founders.' },
			subheading:       { type: 'string', default: 'We bring pooled angel funding, sector expertise, and board leadership to accelerate regional startups from screening to scale.' },
			btnPrimaryText:   { type: 'string', default: 'APPLY FOR FUNDING' },
			btnPrimaryLink:   { type: 'string', default: '#apply' },
			btnSecondaryText: { type: 'string', default: 'JOIN AS MEMBER' },
			btnSecondaryLink: { type: 'string', default: '#join' },
			speed:            { type: 'number', default: 1.0 },
			noiseDensity:     { type: 'number', default: 2.0 },
			color1:           { type: 'string', default: '#0E4164' },
			color2:           { type: 'string', default: '#5f6f73' },
			color3:           { type: 'string', default: '#0a4266' },
		},
		migrate( attributes ) {
			return { ...attributes, videoSrc: '/wp-content/uploads/output.webm' };
		},
		save( { attributes } ) {
			const {
				kicker, headline, subheading,
				btnPrimaryText, btnPrimaryLink,
				btnSecondaryText, btnSecondaryLink,
				speed, noiseDensity, color1, color2, color3,
			} = attributes;

			const blockProps = useBlockProps.save( {
				className: 'sequence-hero-container',
				'data-speed': speed,
				'data-noise': noiseDensity,
				'data-color1': color1,
				'data-color2': color2,
				'data-color3': color3,
			} );

			return (
				<>
					<div className="preloader-overlay" aria-live="polite">
						<div className="preloader-content">
							<div className="preloader-logo">CHERRYSTONE</div>
							<div className="preloader-bar-container">
								<div className="preloader-bar" style={ { width: '0%' } }></div>
							</div>
							<div className="preloader-percentage">0%</div>
						</div>
					</div>
					<section { ...blockProps }>
						<div className="sequence-canvas-container">
							<canvas className="sequence-canvas"></canvas>
						</div>
						<div className="sequence-overlay">
							<div className="sequence-overlay-content">
								<div className="sequence-kicker"><RichText.Content value={ kicker } /></div>
								<h1 className="sequence-title"><RichText.Content value={ headline } /></h1>
								<div className="sequence-sub"><RichText.Content value={ subheading } /></div>
								<div className="sequence-actions">
									<a href={ btnPrimaryLink } className="btn btn-accent">
										<RichText.Content value={ btnPrimaryText } />
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
											<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
										</svg>
									</a>
									<a href={ btnSecondaryLink } className="btn btn-light">
										<RichText.Content value={ btnSecondaryText } />
									</a>
								</div>
							</div>
						</div>
						<div className="sequence-scroll-indicator" aria-hidden="true">
							<span>Scroll to explore</span>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
								<path d="M12 5v14M19 12l-7 7-7-7" />
							</svg>
						</div>
					</section>
				</>
			);
		},
	},
];

registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save,
	deprecated,
} );
