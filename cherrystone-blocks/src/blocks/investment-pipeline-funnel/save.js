import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, kpiTotal, stages = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block funnel-pipeline-section inverse',
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

				<div className="funnel-container">
					<div className="funnel-kpi-badge">
						<span className="mono kpi-tag">TOTAL DEPLOYED:</span>
						<RichText.Content
							tagName="strong"
							className="kpi-total-val"
							value={ kpiTotal }
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
											<RichText.Content
												tagName="span"
												className="funnel-stage-label"
												value={ stage.label }
											/>
										</div>
										<div className="funnel-row-right">
											<RichText.Content
												tagName="strong"
												className="funnel-stage-num mono"
												value={ stage.num }
											/>
										</div>
									</div>
								</div>
								<div className="funnel-row-desc-box">
									<RichText.Content
										tagName="p"
										value={ stage.desc }
									/>
								</div>
							</div>
						) ) }
					</div>
				</div>
			</div>
		</section>
	);
}
