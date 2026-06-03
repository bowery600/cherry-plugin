import { RichText, useBlockProps } from '@wordpress/block-editor';

import { ArrowIcon } from '../../shared/icons';

const sectorBar = ( count, max ) =>
	`${ Math.max(
		16,
		Math.round( ( Number( count ) / Math.max( 1, max ) ) * 100 )
	) }%`;

export default function save( { attributes } ) {
	const {
		eyebrow,
		heading,
		lede,
		signals = [],
		ctaLabel,
		ctaUrl,
		sectors = [],
	} = attributes;
	const maxSectorCount = Math.max(
		...sectors.map( ( item ) => Number( item.count ) || 0 ),
		1
	);
	const blockProps = useBlockProps.save( {
		className: 'block thesis-block',
	} );

	return (
		<section { ...blockProps }>
			<div className="container">
				<div className="insight-board">
					<div className="insight-copy">
						<RichText.Content
							tagName="span"
							className="eyebrow accent"
							value={ eyebrow }
						/>
						<RichText.Content tagName="h2" value={ heading } />
						<RichText.Content
							tagName="p"
							className="lede"
							value={ lede }
						/>
						<div
							className="signal-list"
							aria-label="Cherrystone investment signals"
						>
							{ signals.map( ( signal, index ) => (
								<RichText.Content
									key={ index }
									tagName="span"
									value={ signal.text }
								/>
							) ) }
						</div>
						<a className="btn btn-primary" href={ ctaUrl }>
							<RichText.Content
								tagName="span"
								value={ ctaLabel }
							/>
							<ArrowIcon />
						</a>
					</div>
					<div
						className="sector-radar"
						aria-label="Active portfolio distribution by sector"
					>
						{ sectors.map( ( item, index ) => (
							<a
								key={ index }
								className="sector-tile"
								href={ item.url }
								style={ {
									'--bar': sectorBar(
										item.count,
										maxSectorCount
									),
									textDecoration: 'none',
								} }
							>
								<RichText.Content
									tagName="span"
									className="sector-count"
									value={ String( item.count ).padStart(
										2,
										'0'
									) }
								/>
								<RichText.Content
									tagName="span"
									className="sector-name"
									value={ item.sector }
								/>
								<span className="sector-bar" aria-hidden="true">
									<span></span>
								</span>
								<RichText.Content
									tagName="span"
									className="sector-sample"
									value={ item.sample }
								/>
							</a>
						) ) }
					</div>
				</div>
			</div>
		</section>
	);
}
