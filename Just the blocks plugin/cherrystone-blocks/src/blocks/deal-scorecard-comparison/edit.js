import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_DEAL = {
	company: 'New Company',
	sector: 'Industry',
	overallScore: 70,
	metrics: [
		{ name: 'Market Size', score: 70 },
		{ name: 'Team', score: 70 },
		{ name: 'Traction', score: 70 },
		{ name: 'Defensibility', score: 70 },
	],
};

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, deals = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block deal-scorecard-section',
	} );

	const updateDealField = ( index, patch ) => {
		setAttributes( { deals: updateItem( deals, index, patch ) } );
	};

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Deals"
					items={ deals }
					setItems={ ( value ) => setAttributes( { deals: value } ) }
					fields={ [
						{ key: 'company', label: 'Company Name' },
						{ key: 'sector', label: 'Sector' },
						{ key: 'overallScore', label: 'Overall Score (0–100)' },
					] }
					newItem={ NEW_DEAL }
					getItemLabel={ ( item, index ) =>
						item.company || `Deal ${ index + 1 }`
					}
				/>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="container">
					<div className="block-head">
						<div>
							<RichText
								tagName="span"
								className="eyebrow"
								value={ eyebrow }
								onChange={ ( value ) =>
									setAttributes( { eyebrow: value } )
								}
								placeholder="ACTIVE PIPELINE"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Deals under review."
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="Provide context..."
						/>
					</div>

					<div className="scorecard-comparison-grid">
						{ deals.map( ( deal, dIndex ) => (
							<div className="scorecard-deal-card" key={ dIndex }>
								<div className="scorecard-deal-header">
									<RichText
										tagName="h3"
										className="scorecard-company-name"
										value={ deal.company }
										onChange={ ( val ) =>
											updateDealField( dIndex, {
												company: val,
											} )
										}
										placeholder="Company Name"
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
															width: `${ metric.score }%`,
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
		</>
	);
}
