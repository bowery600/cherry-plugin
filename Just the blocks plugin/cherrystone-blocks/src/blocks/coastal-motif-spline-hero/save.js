import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		kicker,
		headline,
		subheading,
		btnPrimaryText,
		btnPrimaryLink,
		btnSecondaryText,
		btnSecondaryLink,
		speed,
		noiseDensity,
		color1,
		color2,
		color3,
		videoSrc,
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
			{ /* Premium Preloader Overlay */ }
			<div className="preloader-overlay" aria-live="polite">
				<div className="preloader-content">
					<div className="preloader-logo">CHERRYSTONE</div>
					<div className="preloader-bar-container">
						<div
							className="preloader-bar"
							style={ { width: '0%' } }
						></div>
					</div>
					<div className="preloader-percentage">0%</div>
				</div>
			</div>

			{ /* Pinned Scroll Sequence Section */ }
			<section { ...blockProps }>
				<div className="sequence-video-container">
					{  }
					<video
						className="sequence-video"
						src={ videoSrc }
						muted
						playsInline
						preload="auto"
						aria-hidden="true"
					/>
				</div>

				{ /* Foreground Centered Parallax Typography Overlay */ }
				<div className="sequence-overlay">
					<div className="sequence-overlay-content">
						<div className="sequence-kicker">
							<RichText.Content value={ kicker } />
						</div>
						<h1 className="sequence-title">
							<RichText.Content value={ headline } />
						</h1>
						<div className="sequence-sub">
							<RichText.Content value={ subheading } />
						</div>
						<div className="sequence-actions">
							<a
								href={ btnPrimaryLink }
								className="btn btn-accent"
							>
								<RichText.Content value={ btnPrimaryText } />
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									aria-hidden="true"
									focusable="false"
								>
									<path
										d="M5 12h14M13 6l6 6-6 6"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							</a>
							<a
								href={ btnSecondaryLink }
								className="btn btn-light"
							>
								<RichText.Content value={ btnSecondaryText } />
							</a>
						</div>
					</div>
				</div>

				{ /* Scroll Indicator */ }
				<div className="sequence-scroll-indicator" aria-hidden="true">
					<span>Scroll to explore</span>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						focusable="false"
					>
						<path d="M12 5v14M19 12l-7 7-7-7" />
					</svg>
				</div>
			</section>
		</>
	);
}
