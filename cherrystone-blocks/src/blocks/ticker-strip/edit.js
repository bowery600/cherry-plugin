import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_ITEM = { text: 'New ticker item' };

export default function Edit( { attributes, setAttributes } ) {
	const { items = [] } = attributes;
	const blockProps = useBlockProps( { className: 'strip' } );
	const trackItems = [ ...items, ...items ];

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Ticker items"
					items={ items }
					setItems={ ( value ) => setAttributes( { items: value } ) }
					fields={ [ { key: 'text', label: 'Text' } ] }
					newItem={ NEW_ITEM }
					getItemLabel={ ( item, index ) =>
						item.text || `Ticker item ${ index + 1 }`
					}
					initialOpen
				/>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="strip-track">
					{ trackItems.map( ( item, index ) => (
						<>
							<RichText
								key={ `item-${ index }` }
								tagName="span"
								value={ item.text }
								onChange={ ( value ) => {
									const sourceIndex = index % items.length;
									setAttributes( {
										items: updateItem( items, sourceIndex, {
											text: value,
										} ),
									} );
								} }
								placeholder="Ticker item"
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
		</>
	);
}
