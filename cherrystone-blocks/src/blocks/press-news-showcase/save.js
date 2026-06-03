import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, articles = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block press-showcase-section',
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

				<div className="press-showcase-grid-layout">
					{ articles.map( ( art, index ) => (
						<div
							key={ index }
							className={ `press-news-card ${
								art.isFeatured ? 'is-featured-news' : ''
							}` }
						>
							<div className="press-news-card-inner">
								<div className="press-news-meta mono">
									<RichText.Content
										tagName="span"
										className="press-news-source"
										value={ art.source }
									/>
									<span className="dot" />
									<RichText.Content
										tagName="span"
										className="press-news-date"
										value={ art.date }
									/>
								</div>

								<RichText.Content
									tagName="h3"
									className="press-news-title"
									value={ art.title }
								/>

								<div className="press-news-action-link">
									<span className="mono text-link">
										READ ARTICLE
									</span>
								</div>
							</div>
						</div>
					) ) }
				</div>
			</div>
		</section>
	);
}
