import {
	BlockControls,
	HeadingLevelDropdown,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';
import { ArrowIcon } from '../../shared/icons';

const NEW_STATUS = { value: 'New', label: 'status' };
const NEW_CARD = {
	tag: '03 / Audience',
	eyebrow: 'CATEGORY',
	title: 'Panel title.',
	body: 'Panel description.',
	ctaLabel: 'Read more',
	url: '/',
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		dividerLabel,
		headingLevel = 2,
		statusItems = [],
		cards = [],
	} = attributes;
	const blockProps = useBlockProps( { className: 'hero-entry-section' } );

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
					title="Status items"
					items={ statusItems }
					setItems={ ( value ) =>
						setAttributes( { statusItems: value } )
					}
					fields={ [
						{ key: 'value', label: 'Bold label' },
						{ key: 'label', label: 'Supporting label' },
					] }
					newItem={ NEW_STATUS }
				/>
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
				<div className="container">
					<RichText
						tagName="div"
						className="divider-mono"
						value={ dividerLabel }
						onChange={ ( value ) =>
							setAttributes( { dividerLabel: value } )
						}
						placeholder="Divider label"
					/>
					<div className="hero-entry-grid">
						<div
							className="scene-status hero-entry-status"
							aria-label="Current investment flow"
						>
							{ statusItems.map( ( item, index ) => (
								<span key={ index }>
									<RichText
										tagName="strong"
										value={ item.value }
										onChange={ ( value ) =>
											setAttributes( {
												statusItems: updateItem(
													statusItems,
													index,
													{ value }
												),
											} )
										}
									/>
									<RichText
										tagName="span"
										value={ item.label }
										onChange={ ( value ) =>
											setAttributes( {
												statusItems: updateItem(
													statusItems,
													index,
													{ label: value }
												),
											} )
										}
									/>
								</span>
							) ) }
						</div>
						{ cards.map( ( card, index ) => (
							<div
								className="split-panel split-panel-action"
								key={ index }
								style={ { cursor: 'pointer' } }
							>
								<RichText
									tagName="span"
									className="split-panel-tag"
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
									className="mono"
									style={ {
										fontSize: 11,
										color: 'var(--accent-ink)',
										letterSpacing: '0.08em',
									} }
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
								<span className="split-panel-cta">
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
									<ArrowIcon />
								</span>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</>
	);
}
