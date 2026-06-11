import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_FUNNEL_STAGE = {
	num: '100+',
	label: 'New Stage',
	desc: 'Description of the pipeline stage.',
	width: '40%',
	color: 'var(--navy-600)',
};

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, kpiTotal, stages = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block funnel-pipeline-section inverse',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Funnel Metrics" initialOpen={ true }>
					<TextControl
						label="KPI Stat Highlight"
						value={ kpiTotal }
						onChange={ ( val ) =>
							setAttributes( { kpiTotal: val } )
						}
					/>
				</PanelBody>
				<RepeaterControls
					title="Funnel Stages"
					items={ stages }
					setItems={ ( value ) => setAttributes( { stages: value } ) }
					fields={ [
						{ key: 'num', label: 'Metric (e.g. 150+)' },
						{ key: 'label', label: 'Stage Title' },
						{
							key: 'desc',
							label: 'Stage Description',
							type: 'textarea',
						},
						{ key: 'width', label: 'Funnel Width (e.g. 75%)' },
						{ key: 'color', label: 'CSS Color Variable' },
					] }
					newItem={ NEW_FUNNEL_STAGE }
					getItemLabel={ ( item, index ) =>
						item.label || `Stage ${ index + 1 }`
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
								placeholder="DEAL FLOW METRICS"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Our screening funnel."
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

					<div className="funnel-container">
						<div className="funnel-kpi-badge">
							<span className="mono kpi-tag">
								TOTAL DEPLOYED:
							</span>
							<RichText
								tagName="strong"
								className="kpi-total-val"
								value={ kpiTotal }
								onChange={ ( val ) =>
									setAttributes( { kpiTotal: val } )
								}
								placeholder="$18M+ Deployed"
							/>
						</div>

						<div className="funnel-cascade-wrapper">
							{ stages.map( ( stage, index ) => (
								<div
									key={ index }
									className="funnel-row"
									style={ {
										'--row-width': stage.width || '100%',
										'--row-color':
											stage.color || 'var(--navy-900)',
									} }
								>
									<div className="funnel-row-bar">
										<div className="funnel-row-bg" />
										<div className="funnel-row-content">
											<div className="funnel-row-left">
												<span className="mono funnel-index">
													0{ index + 1 }
												</span>
												<RichText
													tagName="span"
													className="funnel-stage-label"
													value={ stage.label }
													onChange={ ( val ) =>
														setAttributes( {
															stages: updateItem(
																stages,
																index,
																{ label: val }
															),
														} )
													}
													placeholder="Stage Label"
												/>
											</div>
											<div className="funnel-row-right">
												<RichText
													tagName="strong"
													className="funnel-stage-num mono"
													value={ stage.num }
													onChange={ ( val ) =>
														setAttributes( {
															stages: updateItem(
																stages,
																index,
																{ num: val }
															),
														} )
													}
													placeholder="Metric"
												/>
											</div>
										</div>
									</div>
									<div className="funnel-row-desc-box">
										<RichText
											tagName="p"
											value={ stage.desc }
											onChange={ ( val ) =>
												setAttributes( {
													stages: updateItem(
														stages,
														index,
														{ desc: val }
													),
												} )
											}
											placeholder="Brief description..."
										/>
									</div>
								</div>
							) ) }
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
