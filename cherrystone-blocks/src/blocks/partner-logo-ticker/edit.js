import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_PARTNER = { name: 'New Partner', tier: 'Co-Investor' };

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, partners = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block logo-ticker-section',
	} );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Partners"
					items={ partners }
					setItems={ ( value ) =>
						setAttributes( { partners: value } )
					}
					fields={ [
						{ key: 'name', label: 'Partner name' },
						{
							key: 'tier',
							label: 'Tier (e.g. Co-Investor, Sponsor, Accelerator)',
						},
					] }
					newItem={ NEW_PARTNER }
					getItemLabel={ ( item, index ) =>
						item.name || `Partner ${ index + 1 }`
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
								placeholder="Eyebrow"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Heading"
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="Intro copy"
						/>
					</div>
					<div
						className="ticker-track-wrapper"
						style={ {
							display: 'flex',
							gap: 24,
							overflowX: 'auto',
							paddingBottom: 8,
						} }
					>
						{ partners.map( ( partner, index ) => (
							<div
								className="ticker-partner-card"
								key={ index }
								style={ {
									flex: '0 0 auto',
									padding: '20px 28px',
									border: '1px solid rgba(10,66,102,0.12)',
									borderRadius: 8,
									textAlign: 'center',
								} }
							>
								<RichText
									tagName="strong"
									className="ticker-partner-name"
									value={ partner.name }
									onChange={ ( value ) =>
										setAttributes( {
											partners: updateItem(
												partners,
												index,
												{
													name: value,
												}
											),
										} )
									}
									placeholder="Partner name"
								/>
								<RichText
									tagName="span"
									className="ticker-partner-tier mono"
									value={ partner.tier }
									onChange={ ( value ) =>
										setAttributes( {
											partners: updateItem(
												partners,
												index,
												{
													tier: value,
												}
											),
										} )
									}
									placeholder="Tier"
									style={ {
										display: 'block',
										marginTop: 6,
										fontSize: 11,
										opacity: 0.65,
									} }
								/>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</>
	);
}
