import { RichText, useBlockProps } from '@wordpress/block-editor';

import { ClockIcon, LayersIcon, MoneyIcon } from '../../shared/icons';

const Icon = ( { name } ) => {
	if ( name === 'money' ) {
		return <MoneyIcon />;
	}
	if ( name === 'clock' ) {
		return <ClockIcon />;
	}
	return <LayersIcon />;
};

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, cards = [] } = attributes;
	const blockProps = useBlockProps.save( { className: 'section' } );

	return (
		<section { ...blockProps }>
			<div className="wrap">
				<div className="section-head reveal">
					<RichText.Content
						tagName="p"
						className="eyebrow"
						value={ eyebrow }
					/>
					<RichText.Content
						tagName="h2"
						value={ heading }
					/>
					<RichText.Content
						tagName="p"
						className="lede"
						value={ lede }
					/>
				</div>
				<div className="features">
					{ cards.map( ( card, index ) => (
						<div className={ `feature reveal d${ index }` } key={ index }>

							<div className="feature-mark">
								<Icon name={ card.icon } />
							</div>
							<RichText.Content
								tagName="h3"
								value={ card.title }
							/>
							<RichText.Content tagName="p" value={ card.body } />
							<div className="feature-bar"></div>
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
