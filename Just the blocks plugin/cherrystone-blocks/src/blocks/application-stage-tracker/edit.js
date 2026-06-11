import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_STAGE = {
	num: '06',
	name: 'New Application Phase',
	desc: 'Add details for this tracking phase.',
	status: 'pending',
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		eyebrow,
		heading,
		lede,
		applicantName,
		activeStep,
		stages = [],
	} = attributes;
	const blockProps = useBlockProps( {
		className: 'block app-tracker-section',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Tracker Details" initialOpen={ true }>
					<TextControl
						label="Applicant Name"
						value={ applicantName }
						onChange={ ( val ) =>
							setAttributes( { applicantName: val } )
						}
					/>
					<RangeControl
						label="Active Step Index (1-indexed)"
						value={ activeStep }
						onChange={ ( val ) => {
							const updatedStages = stages.map(
								( stage, idx ) => {
									let status = 'pending';
									if ( idx + 1 < val ) {
										status = 'complete';
									} else if ( idx + 1 === val ) {
										status = 'active';
									}
									return { ...stage, status };
								}
							);
							setAttributes( {
								activeStep: val,
								stages: updatedStages,
							} );
						} }
						min={ 1 }
						max={ stages.length }
					/>
				</PanelBody>
				<RepeaterControls
					title="Funnel Steps"
					items={ stages }
					setItems={ ( value ) => setAttributes( { stages: value } ) }
					fields={ [
						{ key: 'num', label: 'Step Number' },
						{ key: 'name', label: 'Step Name' },
						{
							key: 'desc',
							label: 'Brief Description',
							type: 'textarea',
						},
						{
							key: 'status',
							label: 'Status (complete / active / pending)',
						},
					] }
					newItem={ NEW_STAGE }
					getItemLabel={ ( item, index ) =>
						item.name || `Phase ${ index + 1 }`
					}
				/>
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
								placeholder="LIVE STATUS"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Track your progress."
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="Enter details..."
						/>
					</div>

					<div className="tracker-panel">
						<div className="tracker-applicant-badge">
							<span className="mono status-indicator-dot pulsing" />
							<span className="mono applicant-lbl">
								VENTURE APPLICANT:{ ' ' }
							</span>
							<strong className="applicant-name-text">
								{ applicantName }
							</strong>
						</div>

						<div className="stages-flow-grid">
							{ stages.map( ( stage, index ) => {
								const stepNum = index + 1;
								const isComplete = stage.status === 'complete';
								const isActive = stage.status === 'active';
								let statusClass = 'is-pending';
								if ( isComplete ) {
									statusClass = 'is-complete';
								} else if ( isActive ) {
									statusClass = 'is-active';
								}

								return (
									<div
										key={ index }
										className={ `stage-flow-card ${ statusClass }` }
									>
										<div className="stage-card-header">
											<span className="mono stage-number-pill">
												{ stage.num }
											</span>
											<span
												className={ `stage-status-tag ${ stage.status }` }
											>
												{ stage.status }
											</span>
										</div>

										<RichText
											tagName="h3"
											className="stage-card-title"
											value={ stage.name }
											onChange={ ( val ) =>
												setAttributes( {
													stages: updateItem(
														stages,
														index,
														{ name: val }
													),
												} )
											}
											placeholder="Stage Name"
										/>
										<RichText
											tagName="p"
											className="stage-card-desc"
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
											placeholder="Stage Description"
										/>

										{ stepNum < stages.length && (
											<div className="stage-flow-connector">
												<div className="connector-line-inner" />
											</div>
										) }
									</div>
								);
							} ) }
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
