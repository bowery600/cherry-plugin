import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		eyebrow,
		heading,
		lede,
		defaultSector,
		defaultStage,
		defaultRoots,
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block pitch-calculator-section',
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

				<div
					className="calculator-wrapper"
					data-default-sector={ defaultSector }
					data-default-stage={ defaultStage }
					data-default-roots={ defaultRoots }
				>
					<div className="calculator-grid">
						{ /* Left Side: Inputs */ }
						<div className="calculator-controls-panel">
							<div className="calc-control-group">
								<label
									className="mono control-label"
									htmlFor="calc-amt-slider"
								>
									01 / ROUND SIZE
								</label>
								<div className="slider-wrapper">
									<input
										type="range"
										min="100000"
										max="2500000"
										step="50000"
										defaultValue="500000"
										id="calc-amt-slider"
										className="calc-range-slider"
										aria-valuetext="$0.50M"
									/>
									<div className="slider-values">
										<span>$100k</span>
										<strong
											id="calc-amt-display"
											className="active-amt"
										>
											$0.50M
										</strong>
										<span>$2.5M</span>
									</div>
								</div>
							</div>

							<div className="calc-control-group">
								<div
									className="mono control-label"
									id="calc-sector-label"
								>
									02 / VERTICAL SECTOR
								</div>
								<div
									className="calc-radio-grid"
									id="calc-sector-grid"
									role="radiogroup"
									aria-labelledby="calc-sector-label"
								>
									<button
										type="button"
										role="radio"
										aria-checked="true"
										className="calc-selector-btn is-active"
										data-value="SaaS"
									>
										SaaS / Software
									</button>
									<button
										type="button"
										role="radio"
										aria-checked="false"
										className="calc-selector-btn"
										data-value="LifeSciences"
									>
										Life Sciences
									</button>
									<button
										type="button"
										role="radio"
										aria-checked="false"
										className="calc-selector-btn"
										data-value="DeepTech"
									>
										DeepTech / Climate
									</button>
									<button
										type="button"
										role="radio"
										aria-checked="false"
										className="calc-selector-btn"
										data-value="Other"
									>
										Consumer & Other
									</button>
								</div>
							</div>

							<div className="calc-control-group">
								<div
									className="mono control-label"
									id="calc-stage-label"
								>
									03 / FUNDING STAGE
								</div>
								<div
									className="calc-radio-grid"
									id="calc-stage-grid"
									role="radiogroup"
									aria-labelledby="calc-stage-label"
								>
									<button
										type="button"
										role="radio"
										aria-checked="false"
										className="calc-selector-btn"
										data-value="Pre-seed"
									>
										Pre-Seed
									</button>
									<button
										type="button"
										role="radio"
										aria-checked="true"
										className="calc-selector-btn is-active"
										data-value="Seed"
									>
										Seed Round
									</button>
									<button
										type="button"
										role="radio"
										aria-checked="false"
										className="calc-selector-btn"
										data-value="Series A"
									>
										Series A
									</button>
									<button
										type="button"
										role="radio"
										aria-checked="false"
										className="calc-selector-btn"
										data-value="Late"
									>
										Late Stage
									</button>
								</div>
							</div>

							<div className="calc-control-group">
								<div
									className="mono control-label"
									id="calc-roots-label"
								>
									04 / NEW ENGLAND ROOTS
								</div>
								<div
									className="calc-radio-grid"
									id="calc-roots-grid"
									role="radiogroup"
									aria-labelledby="calc-roots-label"
								>
									<button
										type="button"
										role="radio"
										aria-checked="true"
										className="calc-selector-btn is-active"
										data-value="New England"
									>
										NE Based
									</button>
									<button
										type="button"
										role="radio"
										aria-checked="false"
										className="calc-selector-btn"
										data-value="Expansion"
									>
										Willing to Expand
									</button>
									<button
										type="button"
										role="radio"
										aria-checked="false"
										className="calc-selector-btn"
										data-value="None"
									>
										Outside NE
									</button>
								</div>
							</div>
						</div>

						{ /* Right Side: Live Alignment Indicator */ }
						<div className="calculator-score-panel">
							<div className="score-dial-outer">
								<svg
									viewBox="0 0 100 100"
									className="score-svg"
									aria-hidden="true"
									focusable="false"
								>
									<circle
										cx="50"
										cy="50"
										r="45"
										className="score-circle-bg"
									/>
									<circle
										cx="50"
										cy="50"
										r="45"
										id="calc-score-ring"
										className="score-circle-value"
										style={ {
											strokeDasharray: '283',
											strokeDashoffset: '70',
										} }
									/>
								</svg>
								<div
									className="score-display"
									role="status"
									aria-live="polite"
									aria-atomic="true"
								>
									<span className="mono score-label">
										ALIGNMENT
									</span>
									<strong
										id="calc-score-display"
										className="score-num"
									>
										80%
									</strong>
									<span
										id="calc-score-status"
										className="mono score-status"
									>
										STRONG
									</span>
								</div>
							</div>

							<div className="calc-feedback-box">
								<p
									className="mono font-semibold"
									style={ {
										color: 'var(--accent-ink)',
										fontSize: '11px',
										textTransform: 'uppercase',
										letterSpacing: '0.08em',
										margin: '0 0 8px',
									} }
								>
									Diligence Insight
								</p>
								<p
									id="calc-feedback-text"
									style={ {
										fontSize: '13px',
										margin: 0,
										color: 'var(--ink-muted-on-glass)',
									} }
								>
									Select options on the left to verify your
									fit profile for Cherrystone Angel Group.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
