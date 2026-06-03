import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, stats = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block stats-dashboard-section',
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

				<div className="stats-dashboard-grid">
					{ stats.map( ( stat, index ) => (
						<div key={ index } className="stats-dashboard-card">
							<div className="stats-card-header">
								<div className="stats-icon-wrap">
									<span className="mono stats-card-idx">
										0{ index + 1 }
									</span>
								</div>
							</div>
							<div className="stats-card-body">
								<div className="stats-number-display">
									<RichText.Content
										tagName="strong"
										className="stats-number-value"
										value={ stat.num }
									/>
									<RichText.Content
										tagName="span"
										className="stats-number-suffix"
										value={ stat.suffix }
									/>
								</div>
								<RichText.Content
									tagName="h3"
									className="stats-card-label"
									value={ stat.label }
								/>
								<RichText.Content
									tagName="p"
									className="stats-card-desc"
									value={ stat.desc }
								/>
							</div>
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
