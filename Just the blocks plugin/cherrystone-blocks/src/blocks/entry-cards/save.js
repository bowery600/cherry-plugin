import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		dividerLabel,
		headingLevel = 3,
		cards = [],
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: 'section entry-section',
		style: { paddingTop: 'clamp(40px,6vh,80px)' }
	} );

	return (
		<section { ...blockProps }>
			<div className="wrap">
				<RichText.Content
					tagName="p"
					className="eyebrow reveal"
					value={ dividerLabel }
				/>
				<div className="entry">
					{ cards.map( ( card, index ) => (
						<a
							className={ `entry-card reveal ${ index % 2 !== 0 ? 'alt d1' : '' }` }
							key={ index }
							href={ card.url }
						>

							<RichText.Content
								tagName={ `h${ headingLevel }` }
								value={ card.title }
							/>
							<RichText.Content tagName="p" value={ card.body } />
							<span className="entry-link">
								<RichText.Content
									tagName="span"
									value={ card.ctaLabel }
								/>
								<svg className="arr" width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M3 8h9M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</span>
						</a>
					) ) }
				</div>
			</div>
		</section>
	);
}
