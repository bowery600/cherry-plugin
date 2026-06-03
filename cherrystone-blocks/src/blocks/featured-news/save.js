import { RichText, useBlockProps } from '@wordpress/block-editor';

import { MeshGradient, WaveMotif } from '../../shared/motifs';

export default function save( { attributes } ) {
	const {
		featuredCategory,
		featuredDate,
		featuredTitle,
		featuredDesc,
		featuredUrl,
		sidePosts = [],
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: 'featured-news-row',
	} );

	const FeaturedCardTag = featuredUrl ? 'a' : 'div';
	const featuredCardProps = featuredUrl
		? { href: featuredUrl, className: 'featured-editorial-card' }
		: { className: 'featured-editorial-card' };

	return (
		<div { ...blockProps }>
			{ /* Left: Featured Post */ }
			<FeaturedCardTag { ...featuredCardProps }>
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
						<RichText.Content
							tagName="span"
							value={ featuredCategory }
						/>
						<span className="dot" />
						<RichText.Content
							tagName="span"
							value={ featuredDate }
						/>
					</div>
					<RichText.Content tagName="h3" value={ featuredTitle } />
					<RichText.Content tagName="p" value={ featuredDesc } />
					<span className="featured-editorial-cta">
						Read full letter →
					</span>
				</div>
			</FeaturedCardTag>

			{ /* Right: Sidebar Posts Stack */ }
			<div className="featured-news-sidebar">
				<h4 className="featured-sidebar-title">Recent Letters</h4>
				{ sidePosts.map( ( post, index ) => {
					const PostCardTag = post.url ? 'a' : 'div';
					const postCardProps = post.url
						? { href: post.url, className: 'sidebar-post-card', key: index }
						: { className: 'sidebar-post-card', key: index };
					return (
						<PostCardTag { ...postCardProps }>
							<span className="date">{ post.date }</span>
							<RichText.Content tagName="h4" value={ post.title } />
							<RichText.Content
								tagName="span"
								className="cat"
								value={ post.cat }
							/>
						</PostCardTag>
					);
				} ) }
			</div>
		</div>
	);
}
