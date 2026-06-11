import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';
import { GrainOverlay, MeshGradient, WaveMotif } from '../../shared/motifs';

const NEW_STAT = { value: '1', label: 'New metric.' };

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, stats = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block inverse',
		style: { padding: 0, position: 'relative', overflow: 'hidden' },
	} );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Stats"
					items={ stats }
					setItems={ ( value ) => setAttributes( { stats: value } ) }
					fields={ [
						{ key: 'value', label: 'Value' },
						{ key: 'label', label: 'Label', type: 'textarea' },
					] }
					newItem={ NEW_STAT }
					initialOpen
				/>
			</InspectorControls>
			<section { ...blockProps }>
				<MeshGradient opacity={ 0.55 } />
				<GrainOverlay opacity={ 0.05 } />
				<div style={ { position: 'absolute', inset: 0, opacity: 0.2 } }>
					<WaveMotif />
				</div>
				<div
					className="container"
					style={ {
						padding: '120px var(--gutter)',
						position: 'relative',
						zIndex: 1,
					} }
				>
					<div className="block-head" style={ { marginBottom: 0 } }>
						<div>
							<RichText
								tagName="span"
								className="eyebrow"
								style={ { color: 'rgba(255,255,255,0.6)' } }
								value={ eyebrow }
								onChange={ ( value ) =>
									setAttributes( { eyebrow: value } )
								}
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24, color: 'white' } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							style={ { color: 'rgba(255,255,255,0.7)' } }
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
						/>
					</div>
				</div>
				<div
					className="container"
					style={ {
						padding: '0 var(--gutter) 120px',
						position: 'relative',
						zIndex: 1,
					} }
				>
					<div className="stats">
						{ stats.map( ( stat, index ) => (
							<div className="stat" key={ index }>
								<div className="num">
									<RichText
										tagName="span"
										className="accent"
										value={ stat.value }
										onChange={ ( value ) =>
											setAttributes( {
												stats: updateItem(
													stats,
													index,
													{ value }
												),
											} )
										}
									/>
								</div>
								<RichText
									tagName="div"
									className="label"
									value={ stat.label }
									onChange={ ( value ) =>
										setAttributes( {
											stats: updateItem( stats, index, {
												label: value,
											} ),
										} )
									}
								/>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</>
	);
}
