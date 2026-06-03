import {
	Button,
	PanelBody,
	TextControl,
	TextareaControl,
} from '@wordpress/components';

export const updateItem = ( items, index, patch ) =>
	items.map( ( item, itemIndex ) =>
		itemIndex === index ? { ...item, ...patch } : item
	);

export const removeItem = ( items, index ) =>
	items.filter( ( _item, itemIndex ) => itemIndex !== index );

export const moveItem = ( items, index, direction ) => {
	const next = [ ...items ];
	const targetIndex = index + direction;

	if ( targetIndex < 0 || targetIndex >= next.length ) {
		return next;
	}

	const [ item ] = next.splice( index, 1 );
	next.splice( targetIndex, 0, item );
	return next;
};

const fieldId = ( title, index, key ) =>
	`${ title
		.toLowerCase()
		.replace( /[^a-z0-9]+/g, '-' ) }-${ index }-${ key }`;

export const RepeaterControls = ( {
	title,
	items,
	setItems,
	fields,
	newItem,
	getItemLabel = ( item, index ) =>
		item.title || item.label || item.name || `Item ${ index + 1 }`,
	initialOpen = false,
} ) => (
	<PanelBody title={ title } initialOpen={ initialOpen }>
		{ items.map( ( item, index ) => (
			<div
				className="cherrystone-repeater-card"
				key={ fieldId( title, index, 'card' ) }
			>
				<strong>{ getItemLabel( item, index ) }</strong>
				{ fields.map( ( field ) => {
					const Control =
						field.type === 'textarea'
							? TextareaControl
							: TextControl;
					return (
						<Control
							key={ field.key }
							label={ field.label }
							value={ item[ field.key ] || '' }
							onChange={ ( value ) =>
								setItems(
									updateItem( items, index, {
										[ field.key ]: value,
									} )
								)
							}
						/>
					);
				} ) }
				<div className="cherrystone-repeater-actions">
					<Button
						variant="secondary"
						disabled={ index === 0 }
						onClick={ () =>
							setItems( moveItem( items, index, -1 ) )
						}
					>
						Move up
					</Button>
					<Button
						variant="secondary"
						disabled={ index === items.length - 1 }
						onClick={ () =>
							setItems( moveItem( items, index, 1 ) )
						}
					>
						Move down
					</Button>
					<Button
						variant="tertiary"
						isDestructive
						onClick={ () => setItems( removeItem( items, index ) ) }
					>
						Remove
					</Button>
				</div>
			</div>
		) ) }
		<Button
			variant="primary"
			onClick={ () => setItems( [ ...items, newItem ] ) }
		>
			Add item
		</Button>
	</PanelBody>
);
