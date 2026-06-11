import {
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls } from '../../shared/editor-controls';

const NEW_ITEM = { image: 'advanced-silicon-group.svg', alt: 'Company' };

export default function Edit( { attributes, setAttributes } ) {
	const { items = [] } = attributes;
	const blockProps = useBlockProps( { className: 'ticker' } );
	const trackItems = [ ...items, ...items ];

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Ticker Logos"
					items={ items }
					setItems={ ( value ) => setAttributes( { items: value } ) }
					fields={ [ 
						{ key: 'image', label: 'Image filename' },
						{ key: 'alt', label: 'Alt text' }
					] }
					newItem={ NEW_ITEM }
					getItemLabel={ ( item, index ) =>
						item.alt || `Logo ${ index + 1 }`
					}
					initialOpen
				/>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="ticker-track">
					{ trackItems.map( ( item, index ) => (
						<span className="ticker-item" key={ `item-${ index }` }>
							<img 
								src={ `/wp-content/plugins/cherrystone-blocks/assets/logos/${ item.image }` } 
								alt={ item.alt } 
								style={ { height: '36px', width: 'auto', opacity: 0.6, filter: 'grayscale(100%) contrast(120%)' } } 
							/>
						</span>
					) ) }
				</div>
			</div>
		</>
	);
}
