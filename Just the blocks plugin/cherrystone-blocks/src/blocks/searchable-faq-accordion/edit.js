import { useState } from '@wordpress/element';

import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_FAQ = {
	question: 'New question?',
	answer: 'Answer goes here.',
};

const accordionItemStyle = {
	border: '1px solid var(--line)',
	borderRadius: 'var(--radius-lg)',
	background: 'var(--surface)',
	overflow: 'hidden',
};

const triggerStyle = {
	width: '100%',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '20px 24px',
	background: 'none',
	border: 'none',
	cursor: 'pointer',
	fontFamily: 'var(--font-body)',
	fontSize: 16,
	fontWeight: 600,
	color: 'var(--ink)',
	textAlign: 'left',
	gap: 16,
};

const panelStyle = {
	padding: '0 24px 20px',
	fontSize: 15,
	lineHeight: 1.6,
	color: 'var(--ink-muted)',
};

const searchInputStyle = {
	width: '100%',
	maxWidth: 480,
	padding: '14px 20px',
	border: '1px solid var(--line)',
	borderRadius: 'var(--radius-lg)',
	fontFamily: 'var(--font-body)',
	fontSize: 15,
	color: 'var(--ink)',
	background: 'var(--surface)',
	outline: 'none',
	marginBottom: 32,
};

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, faqs = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block faq-accordion-section',
	} );
	const [ openIndex, setOpenIndex ] = useState( 0 );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="FAQ Items"
					items={ faqs }
					setItems={ ( value ) => setAttributes( { faqs: value } ) }
					fields={ [
						{ key: 'question', label: 'Question' },
						{ key: 'answer', label: 'Answer', type: 'textarea' },
					] }
					newItem={ NEW_FAQ }
					getItemLabel={ ( item ) => item.question }
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
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
						/>
					</div>

					<input
						type="text"
						className="faq-search-input"
						placeholder="Search questions…"
						style={ searchInputStyle }
						readOnly
					/>

					<div
						className="faq-accordion-list"
						style={ {
							display: 'flex',
							flexDirection: 'column',
							gap: 12,
						} }
					>
						{ faqs.map( ( faq, index ) => {
							const isOpen = openIndex === index;
							return (
								<div
									className={ `faq-accordion-item${
										isOpen ? ' is-open' : ''
									}` }
									style={ accordionItemStyle }
									key={ index }
								>
									<button
										type="button"
										className="faq-accordion-trigger"
										style={ triggerStyle }
										onClick={ () =>
											setOpenIndex( isOpen ? -1 : index )
										}
									>
										<RichText
											tagName="span"
											value={ faq.question }
											onChange={ ( value ) =>
												setAttributes( {
													faqs: updateItem(
														faqs,
														index,
														{
															question: value,
														}
													),
												} )
											}
										/>
										<span
											style={ {
												fontSize: 20,
												transition: 'transform 0.2s',
												transform: isOpen
													? 'rotate(45deg)'
													: 'rotate(0deg)',
												flexShrink: 0,
											} }
										>
											+
										</span>
									</button>
									{ isOpen && (
										<div
											className="faq-accordion-panel"
											style={ panelStyle }
										>
											<RichText
												tagName="p"
												style={ { margin: 0 } }
												value={ faq.answer }
												onChange={ ( value ) =>
													setAttributes( {
														faqs: updateItem(
															faqs,
															index,
															{ answer: value }
														),
													} )
												}
											/>
										</div>
									) }
								</div>
							);
						} ) }
					</div>
				</div>
			</section>
		</>
	);
}
