import { RichText, useBlockProps } from '@wordpress/block-editor';

import { ArrowIcon } from '../../shared/icons';
import metadata from './block.json';

/**
 * v1 used <h3> for card titles. The current save uses <h2> to fix a
 * heading-hierarchy skip; this deprecation keeps existing saved instances
 * valid so the editor does not flag them as broken.
 */
const v1 = {
	attributes: metadata.attributes,
	supports: metadata.supports,
	save( { attributes } ) {
		const { dividerLabel, statusItems = [], cards = [] } = attributes;
		const blockProps = useBlockProps.save( {
			className: 'hero-entry-section',
		} );

		return (
			<section { ...blockProps }>
				<div className="container">
					<RichText.Content
						tagName="div"
						className="divider-mono"
						value={ dividerLabel }
					/>
					<div className="hero-entry-grid">
						<div
							className="scene-status hero-entry-status"
							aria-label="Current investment flow"
						>
							{ statusItems.map( ( item, index ) => (
								<span key={ index }>
									<RichText.Content
										tagName="strong"
										value={ item.value }
									/>
									<RichText.Content
										tagName="span"
										value={ item.label }
									/>
								</span>
							) ) }
						</div>
						{ cards.map( ( card, index ) => (
							<a
								className="split-panel split-panel-action"
								key={ index }
								href={ card.url }
								style={ {
									cursor: 'pointer',
									textDecoration: 'none',
									color: 'inherit',
								} }
							>
								<RichText.Content
									tagName="span"
									className="split-panel-tag"
									value={ card.tag }
								/>
								<RichText.Content
									tagName="span"
									className="mono"
									style={ {
										fontSize: 11,
										color: 'var(--accent-ink)',
										letterSpacing: '0.08em',
									} }
									value={ card.eyebrow }
								/>
								<RichText.Content
									tagName="h3"
									value={ card.title }
								/>
								<RichText.Content
									tagName="p"
									value={ card.body }
								/>
								<span className="split-panel-cta">
									<RichText.Content
										tagName="span"
										value={ card.ctaLabel }
									/>
									<ArrowIcon />
								</span>
							</a>
						) ) }
					</div>
				</div>
			</section>
		);
	},
};

export default [ v1 ];
