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
	const blockProps = useBlockProps.save( { className: 'block' } );

	return (
		<section { ...blockProps }>
			<div className="container">
				<div className="block-head">
					<div>
						<RichText.Content
							tagName="span"
							className="eyebrow accent"
							value={ eyebrow }
						/>
						<RichText.Content
							tagName="h2"
							style={ { marginTop: 24 } }
							value={ heading }
						/>
					</div>
					<RichText.Content
						tagName="p"
						className="lede"
						value={ lede }
					/>
				</div>
				<div className="value-grid">
					{ cards.map( ( card, index ) => (
						<div className="value-card" key={ index }>
							<RichText.Content
								tagName="span"
								className="num"
								value={ card.num }
							/>
							<div className="ico">
								<Icon name={ card.icon } />
							</div>
							<RichText.Content
								tagName="h3"
								value={ card.title }
							/>
							<RichText.Content tagName="p" value={ card.body } />
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
