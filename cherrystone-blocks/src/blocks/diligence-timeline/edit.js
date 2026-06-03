import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_STEP = {
	num: '06',
	title: 'New Diligence Step',
	phase: 'Phase',
	status: 'pending',
	desc: 'Provide details about this custom step in the diligence workflow.',
};

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, steps = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block warm diligence-timeline-section',
	} );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Timeline Steps"
					items={ steps }
					setItems={ ( value ) => setAttributes( { steps: value } ) }
					fields={ [
						{ key: 'num', label: 'Step Number (e.g. 01)' },
						{ key: 'phase', label: 'Phase (e.g. Apply)' },
						{ key: 'title', label: 'Step Title' },
						{ key: 'desc', label: 'Description', type: 'textarea' },
						{
							key: 'status',
							label: 'Status (complete / active / pending)',
						},
					] }
					newItem={ NEW_STEP }
					getItemLabel={ ( item, index ) =>
						item.title || `Step ${ index + 1 }`
					}
					initialOpen
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
								placeholder="Process"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="The path to capital."
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="We move quickly and respect your time..."
						/>
					</div>

					<div className="timeline-container">
						<div className="timeline-track">
							<div
								className="timeline-track-progress"
								style={ { width: '50%' } }
							/>
						</div>
						<div className="timeline-grid">
							{ steps.map( ( step, index ) => (
								<div
									key={ index }
									className={ `timeline-step ${
										step.status === 'active'
											? 'is-active'
											: ''
									}` }
								>
									<div className="timeline-node-wrap">
										<div className="timeline-node-pulse" />
										<div className="timeline-node-ring" />
										<div className="timeline-node" />
									</div>
									<div className="timeline-card">
										<span className="timeline-step-num">
											STEP { step.num } —{ ' ' }
											{ step.phase.toUpperCase() }
										</span>
										<RichText
											tagName="h4"
											value={ step.title }
											onChange={ ( value ) =>
												setAttributes( {
													steps: updateItem(
														steps,
														index,
														{ title: value }
													),
												} )
											}
											placeholder="Step Title"
										/>
										<RichText
											tagName="p"
											value={ step.desc }
											onChange={ ( value ) =>
												setAttributes( {
													steps: updateItem(
														steps,
														index,
														{ desc: value }
													),
												} )
											}
											placeholder="Step description..."
										/>
										<span
											className={ `timeline-status-badge ${
												step.status === 'active'
													? 'active'
													: ''
											}` }
										>
											{ step.status }
										</span>
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
