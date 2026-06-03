import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';
import { ArrowIcon } from '../../shared/icons';

const NEW_SIGNAL = { text: 'New signal' };
const NEW_SECTOR = {
	sector: 'New sector',
	count: '1',
	sample: 'Sample company',
	url: '/portfolio',
};

const sectorBar = ( count, max ) =>
	`${ Math.max(
		16,
		Math.round( ( Number( count ) / Math.max( 1, max ) ) * 100 )
	) }%`;

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
	const maxSectorCount = Math.max(
		...sectors.map( ( item ) => Number( item.count ) || 0 ),
		1
	);
	const blockProps = useBlockProps( { className: 'block thesis-block' } );

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
				<div className="container">
					<div className="insight-board">
						<div className="insight-copy">
							<RichText
								tagName="span"
								className="eyebrow accent"
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
							<div
								className="signal-list"
								aria-label="Cherrystone investment signals"
							>
								{ signals.map( ( signal, index ) => (
									<RichText
										key={ index }
										tagName="span"
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
							<span className="btn btn-primary cherrystone-editable-link">
								<RichText
									tagName="span"
									value={ ctaLabel }
									onChange={ ( value ) =>
										setAttributes( { ctaLabel: value } )
									}
								/>
								<ArrowIcon />
							</span>
						</div>
						<div
							className="sector-radar"
							aria-label="Active portfolio distribution by sector"
						>
							{ sectors.map( ( item, index ) => (
								<div
									key={ index }
									className="sector-tile"
									style={ {
										'--bar': sectorBar(
											item.count,
											maxSectorCount
										),
									} }
								>
									<RichText
										tagName="span"
										className="sector-count"
										value={ String( item.count ).padStart(
											2,
											'0'
										) }
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
									<RichText
										tagName="span"
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
									<span
										className="sector-bar"
										aria-hidden="true"
									>
										<span></span>
									</span>
									<RichText
										tagName="span"
										className="sector-sample"
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
							) ) }
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
