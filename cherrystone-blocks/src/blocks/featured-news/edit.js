import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';
import { MeshGradient, WaveMotif } from '../../shared/motifs';

const NEW_SIDE_POST = {
	date: 'May 30, 2026',
	title: 'New Recent Announcement Title',
	cat: 'Announcement',
	url: '',
};

export default function Edit( { attributes, setAttributes } ) {
	const {
		featuredCategory,
		featuredDate,
		featuredTitle,
		featuredDesc,
		featuredUrl = '',
		sidePosts = [],
	} = attributes;
	const blockProps = useBlockProps( {
		className: 'featured-news-row',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Featured Story Link" initialOpen>
					<TextControl
						label="Featured Article URL"
						value={ featuredUrl }
						onChange={ ( value ) =>
							setAttributes( { featuredUrl: value } )
						}
					/>
				</PanelBody>
				<RepeaterControls
					title="Sidebar News Stack"
					items={ sidePosts }
					setItems={ ( value ) =>
						setAttributes( { sidePosts: value } )
					}
					fields={ [
						{ key: 'date', label: 'Date' },
						{ key: 'title', label: 'Title' },
						{ key: 'cat', label: 'Category' },
						{ key: 'url', label: 'URL / Link' },
					] }
					newItem={ NEW_SIDE_POST }
					getItemLabel={ ( item, index ) =>
						item.title || `Post ${ index + 1 }`
					}
					initialOpen
				/>
			</InspectorControls>
			<div { ...blockProps }>
				{ /* Left: Featured Post */ }
				<div className="featured-editorial-card">
					<div className="featured-editorial-image-pane">
						<span className="featured-editorial-badge">
							Featured Story
						</span>
						<div className="featured-editorial-graphic-wrap">
							<WaveMotif
								color="rgba(255, 255, 255, 0.15)"
								opacity={ 0.8 }
							/>
							<MeshGradient opacity={ 0.35 } />
						</div>
					</div>
					<div className="featured-editorial-content">
						<div className="featured-editorial-meta">
							<RichText
								tagName="span"
								value={ featuredCategory }
								onChange={ ( value ) =>
									setAttributes( {
										featuredCategory: value,
									} )
								}
								placeholder="Featured Letter"
							/>
							<span className="dot" />
							<RichText
								tagName="span"
								value={ featuredDate }
								onChange={ ( value ) =>
									setAttributes( { featuredDate: value } )
								}
								placeholder="Date"
							/>
						</div>
						<RichText
							tagName="h3"
							value={ featuredTitle }
							onChange={ ( value ) =>
								setAttributes( { featuredTitle: value } )
							}
							placeholder="Article Title"
						/>
						<RichText
							tagName="p"
							value={ featuredDesc }
							onChange={ ( value ) =>
								setAttributes( { featuredDesc: value } )
							}
							placeholder="Summary description..."
						/>
						<span className="featured-editorial-cta">
							Read full letter →
						</span>
					</div>
				</div>

				{ /* Right: Sidebar Posts Stack */ }
				<div className="featured-news-sidebar">
					<h4 className="featured-sidebar-title">Recent Letters</h4>
					{ sidePosts.map( ( post, index ) => (
						<div className="sidebar-post-card" key={ index }>
							<span className="date">{ post.date }</span>
							<RichText
								tagName="h4"
								value={ post.title }
								onChange={ ( value ) =>
									setAttributes( {
										sidePosts: updateItem(
											sidePosts,
											index,
											{ title: value }
										),
									} )
								}
								placeholder="Post Title"
							/>
							<RichText
								tagName="span"
								className="cat"
								value={ post.cat }
								onChange={ ( value ) =>
									setAttributes( {
										sidePosts: updateItem(
											sidePosts,
											index,
											{ cat: value }
										),
									} )
								}
								placeholder="Category"
							/>
						</div>
					) ) }
				</div>
			</div>
		</>
	);
}
