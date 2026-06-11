import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, tiers = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block membership-matrix-section',
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

				<div className="membership-matrix-grid">
					{ tiers.map( ( tier, index ) => (
						<div key={ index } className="membership-tier-card">
							<div className="membership-tier-header">
								<RichText.Content
									tagName="h3"
									className="membership-tier-title"
									value={ tier.name }
								/>
								<RichText.Content
									tagName="strong"
									className="membership-tier-fee mono"
									value={ tier.fee }
								/>
							</div>

							<div className="membership-tier-commitment-row">
								<span className="mono tier-row-lbl">
									COMMITMENT:
								</span>
								<RichText.Content
									tagName="span"
									className="tier-row-val"
									value={ tier.commitment }
								/>
							</div>

							<div className="membership-tier-benefits-box">
								<RichText.Content
									tagName="p"
									className="tier-benefits-desc"
									value={ tier.benefits }
								/>
							</div>

							<div className="membership-tier-action">
								<a
									href={ tier.ctaLink }
									className="btn btn-primary"
								>
									<RichText.Content
										tagName="span"
										value={ tier.ctaText }
									/>
								</a>
							</div>
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
