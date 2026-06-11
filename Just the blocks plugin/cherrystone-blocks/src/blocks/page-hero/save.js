import { RichText, useBlockProps } from '@wordpress/block-editor';

import { ArrowIcon } from '../../shared/icons';
import { ShellArcs } from '../../shared/motifs';

export default function save( { attributes } ) {
	const {
		eyebrow,
		heading,
		lede,
		showGraphic,
		showMeta,
		showActions,
		showProgress,
		progressLabel,
		progressValue,
		primaryCtaLabel,
		primaryCtaUrl,
		secondaryCtaLabel,
		secondaryCtaUrl,
		metaItems = [],
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: `page-hero${ showGraphic ? ' with-graphic' : '' }`,
	} );

	return (
		<section { ...blockProps }>
			{ showGraphic && (
				<div className="page-hero-graphic">
					<ShellArcs color="var(--accent)" opacity={ 0.32 } />
				</div>
			) }
			<div className="container">
				<RichText.Content
					tagName="span"
					className="eyebrow accent"
					value={ eyebrow }
				/>
				<RichText.Content
					tagName="h1"
					style={ { marginTop: 24 } }
					value={ heading }
				/>
				<RichText.Content tagName="p" className="lede" value={ lede } />
				{ showActions && (
					<div className="page-hero-actions">
						<a className="btn btn-accent" href={ primaryCtaUrl }>
							<RichText.Content
								tagName="span"
								value={ primaryCtaLabel }
							/>
							<ArrowIcon />
						</a>
						<a className="btn btn-ghost" href={ secondaryCtaUrl }>
							<RichText.Content
								tagName="span"
								value={ secondaryCtaLabel }
							/>
							<ArrowIcon />
						</a>
					</div>
				) }
				{ showMeta && metaItems.length > 0 && (
					<div className="page-hero-meta">
						{ metaItems.map( ( item, index ) => (
							<span key={ index }>
								<RichText.Content
									tagName="strong"
									value={ item.label }
								/>{ ' ' }
								<RichText.Content
									tagName="span"
									value={ item.value }
								/>
							</span>
						) ) }
					</div>
				) }
				{ showProgress && (
					<div
						className="application-progress"
						data-cherry-progress
						aria-label={ `${ progressLabel } ${ progressValue }%` }
					>
						<div>
							<RichText.Content
								tagName="span"
								value={ progressLabel }
							/>
							<strong data-cherry-progress-value>
								{ progressValue }%
							</strong>
						</div>
						<span
							className="application-progress-track"
							role="progressbar"
							aria-valuemin={ 0 }
							aria-valuemax={ 100 }
							aria-valuenow={ progressValue }
						>
							<span
								data-cherry-progress-bar
								style={ { width: `${ progressValue }%` } }
							/>
						</span>
					</div>
				) }
			</div>
		</section>
	);
}
