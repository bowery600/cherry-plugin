import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { items = [] } = attributes;
	const blockProps = useBlockProps.save( { className: 'ticker reveal' } );
	const trackItems = [ ...items, ...items ]; // duplicate for infinite scroll

	return (
		<div { ...blockProps } aria-hidden="true">
			<div className="ticker-track">
				{ trackItems.map( ( item, index ) => (
					<span className="ticker-item" key={ `item-${ index }` }>
						<img
							src={ `/wp-content/plugins/cherrystone-blocks/assets/logos/${ item.image }` }
							alt={ item.alt }
							style={ {
								height: '36px',
								width: 'auto',
								opacity: 0.6,
								filter: 'grayscale(100%) contrast(120%)',
							} }
						/>
					</span>
				) ) }
			</div>
		</div>
	);
}
