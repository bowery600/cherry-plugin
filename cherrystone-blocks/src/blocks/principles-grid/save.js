import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, items = [] } = attributes;
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
				<div className="principles">
					{ items.map( ( item, index ) => (
						<div className="principle" key={ index }>
							<RichText.Content
								tagName="span"
								className="num"
								value={ item.num }
							/>
							<RichText.Content
								tagName="h3"
								value={ item.title }
							/>
							<RichText.Content tagName="p" value={ item.body } />
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
