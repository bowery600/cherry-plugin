import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_TIER = {
	name: 'New Membership Level',
	fee: 'Fee Amount',
	commitment: 'Participation expectation',
	benefits: 'Details about access and voting...',
	ctaText: 'APPLY NOW',
	ctaLink: '#join',
};

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, tiers = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block membership-matrix-section',
	} );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Membership Levels"
					items={ tiers }
					setItems={ ( value ) => setAttributes( { tiers: value } ) }
					fields={ [
						{ key: 'name', label: 'Tier Name' },
						{ key: 'fee', label: 'Membership Fee' },
						{ key: 'commitment', label: 'Commitment Level' },
						{
							key: 'benefits',
							label: 'List of Benefits',
							type: 'textarea',
						},
						{ key: 'ctaText', label: 'Button Text' },
						{ key: 'ctaLink', label: 'Button Link' },
					] }
					newItem={ NEW_TIER }
					getItemLabel={ ( item, index ) =>
						item.name || `Tier ${ index + 1 }`
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
								placeholder="ENGAGEMENT TIERS"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Join our syndicate."
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="Introduce the tiers..."
						/>
					</div>

					<div className="membership-matrix-grid">
						{ tiers.map( ( tier, index ) => (
							<div key={ index } className="membership-tier-card">
								<div className="membership-tier-header">
									<RichText
										tagName="h3"
										className="membership-tier-title"
										value={ tier.name }
										onChange={ ( val ) =>
											setAttributes( {
												tiers: updateItem(
													tiers,
													index,
													{ name: val }
												),
											} )
										}
										placeholder="Tier Name"
									/>
									<RichText
										tagName="strong"
										className="membership-tier-fee mono"
										value={ tier.fee }
										onChange={ ( val ) =>
											setAttributes( {
												tiers: updateItem(
													tiers,
													index,
													{ fee: val }
												),
											} )
										}
										placeholder="Fee"
									/>
								</div>

								<div className="membership-tier-commitment-row">
									<span className="mono tier-row-lbl">
										COMMITMENT:
									</span>
									<RichText
										tagName="span"
										className="tier-row-val"
										value={ tier.commitment }
										onChange={ ( val ) =>
											setAttributes( {
												tiers: updateItem(
													tiers,
													index,
													{ commitment: val }
												),
											} )
										}
										placeholder="Diligence expectations"
									/>
								</div>

								<div className="membership-tier-benefits-box">
									<RichText
										tagName="p"
										className="tier-benefits-desc"
										value={ tier.benefits }
										onChange={ ( val ) =>
											setAttributes( {
												tiers: updateItem(
													tiers,
													index,
													{ benefits: val }
												),
											} )
										}
										placeholder="Benefits list..."
									/>
								</div>

								<div className="membership-tier-action">
									<RichText
										tagName="button"
										className="btn btn-primary"
										value={ tier.ctaText }
										onChange={ ( val ) =>
											setAttributes( {
												tiers: updateItem(
													tiers,
													index,
													{ ctaText: val }
												),
											} )
										}
										placeholder="CTA Text"
									/>
								</div>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</>
	);
}
