import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, deals = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block deal-scorecard-section',
	} );

	return (
		<section { ...blockProps }>
			<div className="container">
				<div className="block-head">
					<div>
						<RichText.Content
							tagName="span"
							className="eyebrow"
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

				<div className="scorecard-comparison-grid">
					{ deals.map( ( deal, dIndex ) => (
						<div className="scorecard-deal-card" key={ dIndex }>
							<div className="scorecard-deal-header">
								<RichText.Content
									tagName="h3"
									className="scorecard-company-name"
									value={ deal.company }
								/>
								<span className="scorecard-sector-badge mono">
									{ deal.sector }
								</span>
							</div>

							<div className="scorecard-overall-score">
								<span className="scorecard-score-label mono">
									OVERALL SCORE
								</span>
								<span className="scorecard-score-value mono">
									{ deal.overallScore }
								</span>
							</div>

							<div className="scorecard-metrics-list">
								{ ( deal.metrics || [] ).map(
									( metric, mIndex ) => (
										<div
											className="scorecard-metric-row"
											key={ mIndex }
											style={ {
												'--bar-pct': `${ metric.score }%`,
											} }
										>
											<span className="scorecard-metric-label">
												{ metric.name }
											</span>
											<span className="scorecard-metric-score mono">
												{ metric.score }
											</span>
											<div className="scorecard-metric-bar">
												<div
													className="scorecard-metric-bar-fill"
													style={ {
														width: 'var(--bar-pct)',
													} }
												/>
											</div>
										</div>
									)
								) }
							</div>
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
