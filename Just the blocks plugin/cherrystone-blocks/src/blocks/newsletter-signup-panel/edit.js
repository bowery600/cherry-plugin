import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, inputPlaceholder, btnText, privacyNote } =
		attributes;
	const blockProps = useBlockProps( {
		className: 'block newsletter-section',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Form settings" initialOpen>
					<TextControl
						label="Input placeholder"
						value={ inputPlaceholder }
						onChange={ ( value ) =>
							setAttributes( { inputPlaceholder: value } )
						}
					/>
					<TextControl
						label="Button text"
						value={ btnText }
						onChange={ ( value ) =>
							setAttributes( { btnText: value } )
						}
					/>
					<TextControl
						label="Privacy note"
						value={ privacyNote }
						onChange={ ( value ) =>
							setAttributes( { privacyNote: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
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
								placeholder="Eyebrow"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Heading"
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="Intro copy"
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
							<div className="newsletter-input-row">
								<input
									type="email"
									className="newsletter-input"
									placeholder={ inputPlaceholder }
									disabled
								/>
								<span className="btn btn-accent">
									{ btnText }
								</span>
							</div>
							<RichText
								tagName="p"
								className="newsletter-privacy"
								value={ privacyNote }
								onChange={ ( value ) =>
									setAttributes( { privacyNote: value } )
								}
								placeholder="Privacy note"
							/>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
