import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, eventDate, location, ctaText, ctaLink } =
		attributes;
	const blockProps = useBlockProps.save( {
		className: 'block pitch-spotlight-section',
	} );

	return (
		<section { ...blockProps }>
			<div className="container">
				<div className="block-head">
					<div>
						<RichText.Content
							tagName="span"
							className="eyebrow accent"
							value={ eyebrow }
						/>
						<RichText.Content
							tagName="h2"
							style={ { marginTop: 24 } }
							value={ heading }
						/>
					</div>
					<RichText.Content
						tagName="p"
						className="lede"
						value={ lede }
					/>
				</div>

				<div className="pitch-spotlight-card">
					{ /* Left Side: Live countdown widget */ }
					<div className="pitch-spotlight-timer-pane">
						<span className="mono timer-title-tag">
							COUNTDOWN TO PITCH
						</span>
						<div className="countdown-display-grid">
							<div className="countdown-time-unit">
								<strong>18</strong>
								<span className="mono">DAYS</span>
							</div>
							<div className="countdown-time-unit">
								<strong>06</strong>
								<span className="mono">HOURS</span>
							</div>
							<div className="countdown-time-unit">
								<strong>45</strong>
								<span className="mono">MINS</span>
							</div>
						</div>
					</div>

					{ /* Right Side: Event Details */ }
					<div className="pitch-spotlight-details-pane">
						<div className="event-detail-row-item">
							<span className="mono detail-row-tag">
								DATE / TIME
							</span>
							<RichText.Content
								tagName="strong"
								className="detail-row-val-text"
								value={ eventDate }
							/>
						</div>

						<div className="event-detail-row-item">
							<span className="mono detail-row-tag">
								LOCATION
							</span>
							<RichText.Content
								tagName="strong"
								className="detail-row-val-text"
								value={ location }
							/>
						</div>

						<div className="event-detail-action-wrap">
							<a href={ ctaLink } className="btn btn-accent">
								<RichText.Content
									tagName="span"
									value={ ctaText }
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
