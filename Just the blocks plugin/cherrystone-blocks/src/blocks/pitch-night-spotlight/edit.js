import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, eventDate, location, ctaText } = attributes;
	const blockProps = useBlockProps( {
		className: 'block pitch-spotlight-section',
	} );

	return (
		<section { ...blockProps }>
			<div className="container">
				<div className="block-head">
					<div>
						<RichText
							tagName="span"
							className="eyebrow accent"
							value={ eyebrow }
							onChange={ ( value ) =>
								setAttributes( { eyebrow: value } )
							}
							placeholder="UPCOMING EVENT"
						/>
						<RichText
							tagName="h2"
							style={ { marginTop: 24 } }
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							placeholder="Cherrystone Pitch Night"
						/>
					</div>
					<RichText
						tagName="p"
						className="lede"
						value={ lede }
						onChange={ ( value ) =>
							setAttributes( { lede: value } )
						}
						placeholder="Startups pitching..."
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
							<RichText
								tagName="strong"
								className="detail-row-val-text"
								value={ eventDate }
								onChange={ ( val ) =>
									setAttributes( { eventDate: val } )
								}
								placeholder="Event Date"
							/>
						</div>

						<div className="event-detail-row-item">
							<span className="mono detail-row-tag">
								LOCATION
							</span>
							<RichText
								tagName="strong"
								className="detail-row-val-text"
								value={ location }
								onChange={ ( val ) =>
									setAttributes( { location: val } )
								}
								placeholder="Event Venue"
							/>
						</div>

						<div className="event-detail-action-wrap">
							<RichText
								tagName="button"
								className="btn btn-accent"
								value={ ctaText }
								onChange={ ( val ) =>
									setAttributes( { ctaText: val } )
								}
								placeholder="CTA Button Text"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
