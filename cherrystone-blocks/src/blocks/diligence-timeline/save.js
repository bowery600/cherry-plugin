import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, steps = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block warm diligence-timeline-section',
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

				<div className="timeline-container">
					<div className="timeline-track">
						<div
							className="timeline-track-progress"
							style={ { width: '0%' } }
						/>
					</div>
					<div className="timeline-grid">
						{ steps.map( ( step, index ) => (
							<div
								key={ index }
								className={ `timeline-step ${
									step.status === 'active' ? 'is-active' : ''
								}` }
								role="button"
								tabIndex="0"
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
									<RichText.Content
										tagName="h4"
										value={ step.title }
									/>
									<RichText.Content
										tagName="p"
										value={ step.desc }
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
	);
}
