import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, faqs = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block faq-accordion-section',
	} );

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

				<input
					type="text"
					className="faq-search-input"
					placeholder="Search questions..."
					aria-label="Search frequently asked questions"
				/>

				<div
					className="faq-accordion-list"
					data-faq-list
					role="region"
					aria-label="Frequently asked questions"
				>
					{ faqs.map( ( faq, index ) => (
						<div
							className={ `faq-accordion-item${
								index === 0 ? ' is-open' : ''
							}` }
							data-faq-item
							key={ index }
						>
							<button
								type="button"
								className="faq-accordion-trigger"
								aria-expanded={ index === 0 }
							>
								<RichText.Content
									tagName="span"
									value={ faq.question }
								/>
								<span
									className="faq-accordion-icon"
									aria-hidden="true"
								>
									+
								</span>
							</button>
							<div
								className="faq-accordion-panel"
								hidden={ index !== 0 }
							>
								<RichText.Content
									tagName="p"
									className="faq-accordion-answer"
									value={ faq.answer }
								/>
							</div>
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
