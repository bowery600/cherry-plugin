import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_SIGNAL = { text: 'New signal' };
const NEW_SECTOR = {
	sector: 'New sector',
	count: '1',
	sample: 'Sample company',
	url: '/portfolio',
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		eyebrow,
		heading,
		lede,
		signals = [],
		ctaLabel,
		ctaUrl,
		sectors = [],
	} = attributes;

	const blockProps = useBlockProps( { className: 'section lens-section' } );

	const MAX_BARS = 7;

	return (
		<>
			<InspectorControls>
				<PanelBody title="Call to action" initialOpen>
					<TextControl
						label="CTA URL"
						value={ ctaUrl }
						onChange={ ( value ) =>
							setAttributes( { ctaUrl: value } )
						}
					/>
				</PanelBody>
				<RepeaterControls
					title="Signal chips"
					items={ signals }
					setItems={ ( value ) =>
						setAttributes( { signals: value } )
					}
					fields={ [ { key: 'text', label: 'Text' } ] }
					newItem={ NEW_SIGNAL }
				/>
				<RepeaterControls
					title="Sector radar"
					items={ sectors }
					setItems={ ( value ) =>
						setAttributes( { sectors: value } )
					}
					fields={ [
						{ key: 'sector', label: 'Sector' },
						{ key: 'count', label: 'Count' },
						{ key: 'sample', label: 'Sample company' },
						{ key: 'url', label: 'URL' },
					] }
					newItem={ NEW_SECTOR }
					initialOpen
				/>
			</InspectorControls>
			<section { ...blockProps }>
				<div className="wrap lens">
					<div className="lens-left reveal">
						<RichText
							tagName="p"
							className="eyebrow"
							value={ eyebrow }
							onChange={ ( value ) =>
								setAttributes( { eyebrow: value } )
							}
						/>
						<RichText
							tagName="h2"
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
						/>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
						/>
						<div className="signals">
							{ signals.map( ( signal, index ) => (
								<RichText
									key={ index }
									tagName="span"
									className="signal"
									value={ signal.text }
									onChange={ ( value ) =>
										setAttributes( {
											signals: updateItem(
												signals,
												index,
												{ text: value }
											),
										} )
									}
								/>
							) ) }
						</div>
						<span className="lens-link cherrystone-editable-link">
							<RichText
								tagName="span"
								value={ ctaLabel }
								onChange={ ( value ) =>
									setAttributes( { ctaLabel: value } )
								}
							/>
							<svg className="arr" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M3 8h9M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</span>
					</div>
					<div className="sector-card reveal d1">
						<div className="sector-card-head">
							<span className="t">Where members invest</span>
							<span className="n">{ sectors.length } verticals</span>
						</div>
						<div id="sectorRows">
							{ sectors.map( ( item, index ) => (
								<div key={ index } className="sector-row">
									<div>
										<RichText
											tagName="div"
											className="sector-name"
											value={ item.sector }
											onChange={ ( value ) =>
												setAttributes( {
													sectors: updateItem(
														sectors,
														index,
														{ sector: value }
													),
												} )
											}
										/>
										<div className="sector-sample">
											e.g. <RichText 
												tagName="span" 
												value={ item.sample }
												onChange={ ( value ) =>
													setAttributes( {
														sectors: updateItem(
															sectors,
															index,
															{ sample: value }
														),
													} )
												}
											/>
										</div>
									</div>
									<div className="sector-meter">
										<div className="sector-bars">
											{ Array.from( { length: MAX_BARS } ).map( ( _, i ) => (
												<i key={ i } className={ i < Number( item.count ) ? 'on' : '' }></i>
											) ) }
										</div>
										<RichText
											tagName="span"
											className="sector-count"
											value={ String( item.count ) }
											onChange={ ( value ) =>
												setAttributes( {
													sectors: updateItem(
														sectors,
														index,
														{ count: value }
													),
												} )
											}
										/>
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
