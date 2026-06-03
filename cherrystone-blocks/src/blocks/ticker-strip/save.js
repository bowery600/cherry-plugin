import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { items = [] } = attributes;
	const blockProps = useBlockProps.save( { className: 'strip' } );
	const trackItems = [ ...items, ...items ];

	return (
		<div { ...blockProps }>
			<div className="strip-track">
				{ trackItems.map( ( item, index ) => (
					<>
						<RichText.Content
							key={ `item-${ index }` }
							tagName="span"
							value={ item.text }
						/>
						<span
							key={ `dot-${ index }` }
							className="dot"
							aria-hidden="true"
						></span>
					</>
				) ) }
			</div>
		</div>
	);
}
