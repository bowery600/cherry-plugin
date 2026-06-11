import { RichText, useBlockProps } from '@wordpress/block-editor';

import { GrainOverlay, MeshGradient, WaveMotif } from '../../shared/motifs';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, stats = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block inverse',
		style: { padding: 0, position: 'relative', overflow: 'hidden' },
	} );

	return (
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
						<RichText.Content
							tagName="span"
							className="eyebrow"
							style={ { color: 'rgba(255,255,255,0.6)' } }
							value={ eyebrow }
						/>
						<RichText.Content
							tagName="h2"
							style={ { marginTop: 24, color: 'white' } }
							value={ heading }
						/>
					</div>
					<RichText.Content
						tagName="p"
						className="lede"
						style={ { color: 'rgba(255,255,255,0.7)' } }
						value={ lede }
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
								<RichText.Content
									tagName="span"
									className="accent"
									value={ stat.value }
								/>
							</div>
							<RichText.Content
								tagName="div"
								className="label"
								value={ stat.label }
							/>
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
