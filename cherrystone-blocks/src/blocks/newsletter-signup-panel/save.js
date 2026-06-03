import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, inputPlaceholder, btnText, privacyNote } =
		attributes;
	const blockProps = useBlockProps.save( {
		className: 'block newsletter-section',
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
				<div className="newsletter-signup-card">
					<div className="newsletter-stats">
						<div className="newsletter-stat-item">
							<span
								className="mono"
								style={ {
									fontSize: 32,
									fontWeight: 700,
									color: 'var(--accent)',
									lineHeight: 1,
								} }
							>
								2,400+
							</span>
							<span
								className="mono"
								style={ {
									fontSize: 11,
									letterSpacing: '0.08em',
									opacity: 0.6,
									marginTop: 4,
								} }
							>
								SUBSCRIBERS
							</span>
						</div>
						<div className="newsletter-stat-item">
							<span
								className="mono"
								style={ {
									fontSize: 32,
									fontWeight: 700,
									color: 'var(--accent)',
									lineHeight: 1,
								} }
							>
								12
							</span>
							<span
								className="mono"
								style={ {
									fontSize: 11,
									letterSpacing: '0.08em',
									opacity: 0.6,
									marginTop: 4,
								} }
							>
								MONTHLY EDITIONS
							</span>
						</div>
					</div>
					<div className="newsletter-form-area">
						<form
							className="newsletter-input-row"
							aria-label="Newsletter signup"
						>
							<label
								className="sr-only"
								htmlFor="newsletter-email-input"
							>
								Email address
							</label>
							<input
								type="email"
								id="newsletter-email-input"
								className="newsletter-input"
								placeholder={ inputPlaceholder }
								aria-describedby="newsletter-privacy-note"
							/>
							<button type="submit" className="btn btn-accent">
								<RichText.Content
									tagName="span"
									value={ btnText }
								/>
							</button>
						</form>
						<RichText.Content
							tagName="p"
							id="newsletter-privacy-note"
							className="newsletter-privacy"
							value={ privacyNote }
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
