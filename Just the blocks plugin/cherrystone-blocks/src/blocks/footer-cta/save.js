import { RichText, useBlockProps } from '@wordpress/block-editor';

import { ArrowIcon } from '../../shared/icons';
import { GrainOverlay, MeshGradient, WaveMotif } from '../../shared/motifs';

const buttonClassName = ( style ) =>
	`btn ${ style === 'light' ? 'btn-light' : 'btn-accent' }`;

export default function save( { attributes } ) {
	const { eyebrow, heading, cards = [] } = attributes;
	const blockProps = useBlockProps.save( { className: 'footer-cta' } );

	return (
		<div { ...blockProps }>
			<MeshGradient opacity={ 0.45 } />
			<GrainOverlay opacity={ 0.04 } />
			<div style={ { position: 'absolute', inset: 0, opacity: 0.18 } }>
				<WaveMotif color="#ffffff" opacity={ 1 } />
			</div>
			<div className="container footer-cta-inner">
				<RichText.Content
					tagName="span"
					className="eyebrow"
					style={ { color: 'rgba(255,255,255,0.6)' } }
					value={ eyebrow }
				/>
				<RichText.Content
					tagName="h2"
					style={ { marginTop: 24 } }
					value={ heading }
				/>
				<div className="footer-cta-grid">
					{ cards.map( ( card, index ) => (
						<div className="footer-card" key={ index }>
							<RichText.Content
								tagName="span"
								className="mono"
								style={ {
									color: 'var(--accent)',
									fontSize: 12,
									letterSpacing: '0.08em',
								} }
								value={ card.label }
							/>
							<RichText.Content
								tagName="h3"
								value={ card.title }
							/>
							<RichText.Content tagName="p" value={ card.body } />
							<a
								className={ buttonClassName(
									card.buttonStyle
								) }
								style={ { alignSelf: 'flex-start' } }
								href={ card.url }
							>
								<RichText.Content
									tagName="span"
									value={ card.ctaLabel }
								/>
								<ArrowIcon />
							</a>
						</div>
					) ) }
				</div>
			</div>
		</div>
	);
}
