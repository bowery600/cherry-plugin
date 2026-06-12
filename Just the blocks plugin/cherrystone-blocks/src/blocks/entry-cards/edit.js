import {
	BlockControls,
	HeadingLevelDropdown,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_CARD = {
	tag: '03 / Audience',
	eyebrow: 'CATEGORY',
	title: 'Panel title.',
	body: 'Panel description.',
	ctaLabel: 'Read more',
	url: '/',
};

export default function Edit( { attributes, setAttributes } ) {
	const { dividerLabel, headingLevel = 3, cards = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'section entry-section',
		style: { paddingTop: 'clamp(40px,6vh,80px)' },
	} );

	return (
		<>
			<BlockControls group="block">
				<HeadingLevelDropdown
					value={ headingLevel }
					onChange={ ( value ) =>
						setAttributes( { headingLevel: value } )
					}
				/>
			</BlockControls>
			<InspectorControls>
				<RepeaterControls
					title="Entry cards"
					items={ cards }
					setItems={ ( value ) => setAttributes( { cards: value } ) }
					fields={ [
						{ key: 'tag', label: 'Tag' },
						{ key: 'eyebrow', label: 'Eyebrow' },
						{ key: 'title', label: 'Title', type: 'textarea' },
						{ key: 'body', label: 'Body', type: 'textarea' },
						{ key: 'ctaLabel', label: 'CTA label' },
						{ key: 'url', label: 'CTA URL' },
					] }
					newItem={ NEW_CARD }
					getItemLabel={ ( item ) => item.tag || item.title }
					initialOpen
				/>
			</InspectorControls>
			<section { ...blockProps }>
				<div className="wrap">
					<RichText
						tagName="p"
						className="eyebrow reveal"
						value={ dividerLabel }
						onChange={ ( value ) =>
							setAttributes( { dividerLabel: value } )
						}
						placeholder="Two ways in"
					/>
					<div className="entry">
						{ cards.map( ( card, index ) => (
							<div
								className={ `entry-card reveal ${
									index % 2 !== 0 ? 'alt d1' : ''
								}` }
								key={ index }
								style={ { cursor: 'pointer' } }
							>
								<RichText
									tagName="span"
									className="entry-tag"
									value={ card.tag }
									onChange={ ( value ) =>
										setAttributes( {
											cards: updateItem( cards, index, {
												tag: value,
											} ),
										} )
									}
								/>
								<RichText
									tagName="span"
									className="entry-eyebrow"
									value={ card.eyebrow }
									onChange={ ( value ) =>
										setAttributes( {
											cards: updateItem( cards, index, {
												eyebrow: value,
											} ),
										} )
									}
								/>
								<RichText
									tagName={ `h${ headingLevel }` }
									value={ card.title }
									onChange={ ( value ) =>
										setAttributes( {
											cards: updateItem( cards, index, {
												title: value,
											} ),
										} )
									}
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
								/>
								<span className="entry-link">
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
									/>
									<svg
										className="arr"
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
									>
										<path
											d="M3 8h9M9 4l4 4-4 4"
											stroke="currentColor"
											strokeWidth="1.6"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</span>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</>
	);
}
