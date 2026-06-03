import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';
import { ArrowIcon } from '../../shared/icons';
import { GrainOverlay, MeshGradient, WaveMotif } from '../../shared/motifs';

const NEW_CARD = {
	label: 'FOR AUDIENCE',
	title: 'New action',
	body: 'Describe the value of this action.',
	ctaLabel: 'Learn more',
	url: '/',
	buttonStyle: 'accent',
};

const buttonClassName = ( style ) =>
	`btn ${ style === 'light' ? 'btn-light' : 'btn-accent' }`;

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, cards = [] } = attributes;
	const blockProps = useBlockProps( { className: 'footer-cta' } );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="CTA cards"
					items={ cards }
					setItems={ ( value ) => setAttributes( { cards: value } ) }
					fields={ [
						{ key: 'label', label: 'Label' },
						{ key: 'title', label: 'Title', type: 'textarea' },
						{ key: 'body', label: 'Body', type: 'textarea' },
						{ key: 'ctaLabel', label: 'CTA label' },
						{ key: 'url', label: 'CTA URL' },
						{
							key: 'buttonStyle',
							label: 'Button style: accent or light',
						},
					] }
					newItem={ NEW_CARD }
					getItemLabel={ ( item ) => item.title || item.label }
					initialOpen
				/>
			</InspectorControls>
			<div { ...blockProps }>
				<MeshGradient opacity={ 0.45 } />
				<GrainOverlay opacity={ 0.04 } />
				<div
					style={ { position: 'absolute', inset: 0, opacity: 0.18 } }
				>
					<WaveMotif color="#ffffff" opacity={ 1 } />
				</div>
				<div className="container footer-cta-inner">
					<RichText
						tagName="span"
						className="eyebrow"
						style={ { color: 'rgba(255,255,255,0.6)' } }
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
						placeholder="CTA heading"
						allowedFormats={ [ 'core/italic' ] }
					/>
					<div className="footer-cta-grid">
						{ cards.map( ( card, index ) => (
							<div className="footer-card" key={ index }>
								<RichText
									tagName="span"
									className="mono"
									style={ {
										color: 'var(--accent)',
										fontSize: 12,
										letterSpacing: '0.08em',
									} }
									value={ card.label }
									onChange={ ( value ) =>
										setAttributes( {
											cards: updateItem( cards, index, {
												label: value,
											} ),
										} )
									}
									placeholder="FOR AUDIENCE"
								/>
								<RichText
									tagName="h3"
									value={ card.title }
									onChange={ ( value ) =>
										setAttributes( {
											cards: updateItem( cards, index, {
												title: value,
											} ),
										} )
									}
									placeholder="Card title"
								/>
								<RichText
									tagName="p"
									value={ card.body }
									onChange={ ( value ) =>
										setAttributes( {
											cards: updateItem( cards, index, {
												body: value,
											} ),
										} )
									}
									placeholder="Card body"
								/>
								<span
									className={ buttonClassName(
										card.buttonStyle
									) }
									style={ { alignSelf: 'flex-start' } }
								>
									<RichText
										tagName="span"
										value={ card.ctaLabel }
										onChange={ ( value ) =>
											setAttributes( {
												cards: updateItem(
													cards,
													index,
													{ ctaLabel: value }
												),
											} )
										}
										placeholder="CTA label"
									/>
									<ArrowIcon />
								</span>
							</div>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}
