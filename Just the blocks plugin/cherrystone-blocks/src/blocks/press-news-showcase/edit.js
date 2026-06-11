import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_ARTICLE = {
	title: 'Article headline goes here.',
	source: 'Publication Name',
	date: 'Date of release',
	isFeatured: false,
};

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, articles = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block press-showcase-section',
	} );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="News Articles"
					items={ articles }
					setItems={ ( value ) =>
						setAttributes( { articles: value } )
					}
					fields={ [
						{ key: 'title', label: 'Headline' },
						{ key: 'source', label: 'Publication Source' },
						{ key: 'date', label: 'Publish Date' },
					] }
					newItem={ NEW_ARTICLE }
					getItemLabel={ ( item, index ) =>
						item.source || `Article ${ index + 1 }`
					}
				/>
				<PanelBody title="Featured Layouts" initialOpen={ true }>
					{ articles.map( ( doc, index ) => (
						<ToggleControl
							key={ index }
							label={ `Feature Card: ${
								doc.source || index + 1
							}` }
							checked={ doc.isFeatured || false }
							onChange={ ( val ) =>
								setAttributes( {
									articles: updateItem( articles, index, {
										isFeatured: val,
									} ),
								} )
							}
						/>
					) ) }
				</PanelBody>
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
								placeholder="MEDIA COVERAGE"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Cherrystone in the press."
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="Write summary..."
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
										<RichText
											tagName="span"
											className="press-news-source"
											value={ art.source }
											onChange={ ( val ) =>
												setAttributes( {
													articles: updateItem(
														articles,
														index,
														{ source: val }
													),
												} )
											}
											placeholder="Source"
										/>
										<span className="dot" />
										<RichText
											tagName="span"
											className="press-news-date"
											value={ art.date }
											onChange={ ( val ) =>
												setAttributes( {
													articles: updateItem(
														articles,
														index,
														{ date: val }
													),
												} )
											}
											placeholder="Date"
										/>
									</div>

									<RichText
										tagName="h3"
										className="press-news-title"
										value={ art.title }
										onChange={ ( val ) =>
											setAttributes( {
												articles: updateItem(
													articles,
													index,
													{ title: val }
												),
											} )
										}
										placeholder="Headline copy..."
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
		</>
	);
}
