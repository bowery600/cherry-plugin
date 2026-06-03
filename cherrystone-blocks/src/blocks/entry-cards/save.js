import { RichText, useBlockProps } from '@wordpress/block-editor';

import { ArrowIcon } from '../../shared/icons';

export default function save( { attributes } ) {
	const {
		dividerLabel,
		headingLevel = 2,
		statusItems = [],
		cards = [],
	} = attributes;
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
								tagName={ `h${ headingLevel }` }
								value={ card.title }
							/>
							<RichText.Content tagName="p" value={ card.body } />
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
}
