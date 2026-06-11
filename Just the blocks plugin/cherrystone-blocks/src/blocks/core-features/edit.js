import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';
import { ClockIcon, LayersIcon, MoneyIcon } from '../../shared/icons';

const NEW_CARD = {
	num: '04 - NEW',
	icon: 'layers',
	title: 'New feature.',
	body: 'Describe this feature.',
};

const Icon = ( { name } ) => {
	if ( name === 'money' ) {
		return <MoneyIcon />;
	}
	if ( name === 'clock' ) {
		return <ClockIcon />;
	}
	return <LayersIcon />;
};

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, cards = [] } = attributes;
	const blockProps = useBlockProps( { className: 'section' } );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Feature cards"
					items={ cards }
					setItems={ ( value ) => setAttributes( { cards: value } ) }
					fields={ [
						{ key: 'num', label: 'Number / label' },
						{ key: 'icon', label: 'Icon: money, layers, or clock' },
						{ key: 'title', label: 'Title', type: 'textarea' },
						{ key: 'body', label: 'Body', type: 'textarea' },
					] }
					newItem={ NEW_CARD }
					initialOpen
				/>
			</InspectorControls>
			<section { ...blockProps }>
				<div className="wrap">
					<div className="section-head reveal">
						<RichText
							tagName="p"
							className="eyebrow"
							value={ eyebrow }
							onChange={ ( value ) =>
								setAttributes( { eyebrow: value } )
							}
							placeholder="Eyebrow"
						/>
						<RichText
							tagName="h2"
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							placeholder="Heading"
						/>
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
					<div className="features">
						{ cards.map( ( card, index ) => (
							<div className={ `feature reveal d${ index }` } key={ index }>
								<RichText
									tagName="span"
									className="feature-num"
									value={ card.num }
									onChange={ ( value ) =>
										setAttributes( {
											cards: updateItem( cards, index, {
												num: value,
											} ),
										} )
									}
								/>
								<div className="feature-mark">
									<Icon name={ card.icon } />
								</div>
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
								<div className="feature-bar"></div>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</>
	);
}
