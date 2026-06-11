import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';
import { ArrowIcon } from '../../shared/icons';

const NEW_PROOF_ITEM = { value: '1', label: 'Proof point' };

export default function Edit( { attributes, setAttributes } ) {
	const {
		kicker,
		kickerCtaLabel,
		kickerCtaUrl,
		headlineLine1,
		headlineLine2Prefix,
		headlineAccent,
		headlineLine3,
		subheading,
		proofItems = [],
		primaryCtaLabel,
		primaryCtaUrl,
		secondaryCtaLabel,
		secondaryCtaUrl,
	} = attributes;
	const blockProps = useBlockProps( { className: 'hero' } );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Hero links" initialOpen>
					<TextControl
						label="Pitch link URL"
						value={ kickerCtaUrl }
						onChange={ ( value ) =>
							setAttributes( { kickerCtaUrl: value } )
						}
					/>
					<TextControl
						label="Primary button URL"
						value={ primaryCtaUrl }
						onChange={ ( value ) =>
							setAttributes( { primaryCtaUrl: value } )
						}
					/>
					<TextControl
						label="Secondary button URL"
						value={ secondaryCtaUrl }
						onChange={ ( value ) =>
							setAttributes( { secondaryCtaUrl: value } )
						}
					/>
				</PanelBody>
				<RepeaterControls
					title="Proof points"
					items={ proofItems }
					setItems={ ( value ) =>
						setAttributes( { proofItems: value } )
					}
					fields={ [
						{ key: 'value', label: 'Value' },
						{ key: 'label', label: 'Label' },
					] }
					newItem={ NEW_PROOF_ITEM }
					getItemLabel={ ( item ) =>
						`${ item.value || '' } ${ item.label || '' }`
					}
				/>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="container">
					<div className="hero-kicker">
						<span className="dot"></span>
						<RichText
							tagName="span"
							value={ kicker }
							onChange={ ( value ) =>
								setAttributes( { kicker: value } )
							}
							placeholder="Event kicker"
						/>
						<span style={ { opacity: 0.5 } }>-</span>
						<RichText
							tagName="span"
							value={ kickerCtaLabel }
							onChange={ ( value ) =>
								setAttributes( { kickerCtaLabel: value } )
							}
							style={ {
								color: 'var(--accent-ink)',
								cursor: 'pointer',
							} }
							placeholder="Details"
						/>
					</div>
					<div className="hero-grid hero-grid-spline">
						<div className="hero-left">
							<h1>
								<RichText
									tagName="span"
									className="line"
									value={ headlineLine1 }
									onChange={ ( value ) =>
										setAttributes( {
											headlineLine1: value,
										} )
									}
									placeholder="Headline line 1"
								/>
								<span className="line">
									<RichText
										tagName="span"
										value={ headlineLine2Prefix }
										onChange={ ( value ) =>
											setAttributes( {
												headlineLine2Prefix: value,
											} )
										}
										placeholder="Headline line 2"
									/>{ ' ' }
									<RichText
										tagName="span"
										className="accent-word"
										value={ headlineAccent }
										onChange={ ( value ) =>
											setAttributes( {
												headlineAccent: value,
											} )
										}
										placeholder="Accent"
									/>
								</span>
								<RichText
									tagName="span"
									className="line"
									value={ headlineLine3 }
									onChange={ ( value ) =>
										setAttributes( {
											headlineLine3: value,
										} )
									}
									placeholder="Headline line 3"
								/>
							</h1>
							<RichText
								tagName="p"
								className="hero-sub"
								value={ subheading }
								onChange={ ( value ) =>
									setAttributes( { subheading: value } )
								}
								placeholder="Hero summary"
							/>
							<div
								className="hero-proof-row"
								aria-label="Cherrystone highlights"
							>
								{ proofItems.map( ( item, index ) => (
									<span key={ index }>
										<RichText
											tagName="strong"
											value={ item.value }
											onChange={ ( value ) =>
												setAttributes( {
													proofItems: updateItem(
														proofItems,
														index,
														{ value }
													),
												} )
											}
											placeholder="25+"
										/>
										<RichText
											tagName="small"
											value={ item.label }
											onChange={ ( value ) =>
												setAttributes( {
													proofItems: updateItem(
														proofItems,
														index,
														{ label: value }
													),
												} )
											}
											placeholder="Label"
										/>
									</span>
								) ) }
							</div>
							<div className="hero-actions">
								<span className="btn btn-accent cherrystone-editable-link">
									<RichText
										tagName="span"
										value={ primaryCtaLabel }
										onChange={ ( value ) =>
											setAttributes( {
												primaryCtaLabel: value,
											} )
										}
										placeholder="Primary CTA"
									/>
									<ArrowIcon />
								</span>
								<RichText
									tagName="span"
									className="btn btn-ghost cherrystone-editable-link"
									value={ secondaryCtaLabel }
									onChange={ ( value ) =>
										setAttributes( {
											secondaryCtaLabel: value,
										} )
									}
									placeholder="Secondary CTA"
								/>
							</div>
						</div>
						<div
							className="hero-right hero-spline-column"
							aria-hidden="true"
						></div>
					</div>
				</div>
			</section>
		</>
	);
}
