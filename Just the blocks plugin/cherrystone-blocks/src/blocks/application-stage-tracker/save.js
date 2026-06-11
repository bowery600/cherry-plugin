import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, applicantName, stages = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block app-tracker-section',
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

									<RichText.Content
										tagName="h3"
										className="stage-card-title"
										value={ stage.name }
									/>
									<RichText.Content
										tagName="p"
										className="stage-card-desc"
										value={ stage.desc }
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
	);
}
