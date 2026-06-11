import { RichText, useBlockProps } from '@wordpress/block-editor';

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

	const blockProps = useBlockProps.save( {
		className: 'section lens-section',
	} );

	const MAX_BARS = 7;

	return (
		<section { ...blockProps }>
			<div className="wrap lens">
				<div className="lens-left reveal">
					<RichText.Content
						tagName="p"
						className="eyebrow"
						value={ eyebrow }
					/>
					<RichText.Content tagName="h2" value={ heading } />
					<RichText.Content
						tagName="p"
						className="lede"
						value={ lede }
					/>
					<div className="signals">
						{ signals.map( ( signal, index ) => (
							<RichText.Content
								key={ index }
								tagName="span"
								className="signal"
								value={ signal.text }
							/>
						) ) }
					</div>
					<a className="lens-link" href={ ctaUrl }>
						<RichText.Content
							tagName="span"
							value={ ctaLabel }
						/>
						<svg className="arr" width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M3 8h9M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</a>
				</div>
				<div className="sector-card reveal d1">
					<div className="sector-card-head">
						<span className="t">Where members invest</span>
						<span className="n">{ sectors.length } verticals</span>
					</div>
					<div id="sectorRows">
						{ sectors.map( ( item, index ) => (
							<div key={ index } className="sector-row">
								<div>
									<RichText.Content
										tagName="div"
										className="sector-name"
										value={ item.sector }
									/>
									<div className="sector-sample">
										e.g. <RichText.Content tagName="span" value={ item.sample } />
									</div>
								</div>
								<div className="sector-meter">
									<div className="sector-bars">
										{ Array.from( { length: MAX_BARS } ).map( ( _, i ) => (
											<i key={ i } className={ i < Number( item.count ) ? 'on' : '' }></i>
										) ) }
									</div>
									<RichText.Content
										tagName="span"
										className="sector-count"
										value={ String( item.count ) }
									/>
								</div>
							</div>
						) ) }
					</div>
				</div>
			</div>
		</section>
	);
}
