import { RichText, useBlockProps } from '@wordpress/block-editor';

import { ArrowIcon } from '../../shared/icons';

export default function save( { attributes } ) {
	const {
		kicker,
		kickerCtaLabel,
		kickerCtaUrl,
		headlineLine1,
		headlineLine2Prefix,
		headlineAccent,
		headlineLine3,
		subheading,
		proofItems = [],
		primaryCtaLabel,
		primaryCtaUrl,
		secondaryCtaLabel,
		secondaryCtaUrl,
	} = attributes;
	const blockProps = useBlockProps.save( { className: 'hero' } );

	return (
		<section { ...blockProps }>
			<div className="container">
				<div className="hero-kicker">
					<span className="dot"></span>
					<RichText.Content tagName="span" value={ kicker } />
					<span style={ { opacity: 0.5 } }>-</span>
					<a
						href={ kickerCtaUrl }
						style={ {
							color: 'var(--accent-ink)',
							cursor: 'pointer',
						} }
					>
						<RichText.Content
							tagName="span"
							value={ kickerCtaLabel }
						/>
					</a>
				</div>
				<div className="hero-grid hero-grid-spline">
					<div className="hero-left">
						<h1>
							<RichText.Content
								tagName="span"
								className="line"
								value={ headlineLine1 }
							/>
							<span className="line">
								<RichText.Content
									tagName="span"
									value={ headlineLine2Prefix }
								/>{ ' ' }
								<RichText.Content
									tagName="span"
									className="accent-word"
									value={ headlineAccent }
								/>
							</span>
							<RichText.Content
								tagName="span"
								className="line"
								value={ headlineLine3 }
							/>
						</h1>
						<RichText.Content
							tagName="p"
							className="hero-sub"
							value={ subheading }
						/>
						<div
							className="hero-proof-row"
							aria-label="Cherrystone highlights"
						>
							{ proofItems.map( ( item, index ) => (
								<span key={ index }>
									<RichText.Content
										tagName="strong"
										value={ item.value }
									/>
									<RichText.Content
										tagName="small"
										value={ item.label }
									/>
								</span>
							) ) }
						</div>
						<div className="hero-actions">
							<a
								className="btn btn-accent"
								href={ primaryCtaUrl }
							>
								<RichText.Content
									tagName="span"
									value={ primaryCtaLabel }
								/>
								<ArrowIcon />
							</a>
							<a
								className="btn btn-ghost"
								href={ secondaryCtaUrl }
							>
								<RichText.Content
									tagName="span"
									value={ secondaryCtaLabel }
								/>
							</a>
						</div>
					</div>
					<div
						className="hero-right hero-spline-column"
						aria-hidden="true"
					></div>
				</div>
			</div>
		</section>
	);
}
