import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_ITEM = {
	num: '05',
	title: 'New principle',
	body: 'Describe this idea.',
};

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, items = [] } = attributes;
	const blockProps = useBlockProps( { className: 'block' } );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Principles"
					items={ items }
					setItems={ ( value ) => setAttributes( { items: value } ) }
					fields={ [
						{ key: 'num', label: 'Number' },
						{ key: 'title', label: 'Title', type: 'textarea' },
						{ key: 'body', label: 'Body', type: 'textarea' },
					] }
					newItem={ NEW_ITEM }
					getItemLabel={ ( item ) => item.title || item.num }
					initialOpen
				/>
			</InspectorControls>
			<section { ...blockProps }>
				<div className="container">
					<div className="block-head">
						<div>
							<RichText
								tagName="span"
								className="eyebrow accent"
								value={ eyebrow }
								onChange={ ( value ) =>
									setAttributes( { eyebrow: value } )
								}
								placeholder="Eyebrow"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Heading"
							/>
						</div>
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
					<div className="principles">
						{ items.map( ( item, index ) => (
							<div className="principle" key={ index }>
								<RichText
									tagName="span"
									className="num"
									value={ item.num }
									onChange={ ( value ) =>
										setAttributes( {
											items: updateItem( items, index, {
												num: value,
											} ),
										} )
									}
									placeholder="01"
								/>
								<RichText
									tagName="h3"
									value={ item.title }
									onChange={ ( value ) =>
										setAttributes( {
											items: updateItem( items, index, {
												title: value,
											} ),
										} )
									}
									placeholder="Principle title"
								/>
								<RichText
									tagName="p"
									value={ item.body }
									onChange={ ( value ) =>
										setAttributes( {
											items: updateItem( items, index, {
												body: value,
											} ),
										} )
									}
									placeholder="Principle description"
								/>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</>
	);
}
