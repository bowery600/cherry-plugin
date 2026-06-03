import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, partners = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block logo-ticker-section',
	} );
	const trackItems = [ ...partners, ...partners ];

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
				<div className="ticker-track-wrapper">
					<div className="ticker-track">
						{ trackItems.map( ( partner, index ) => (
							<div className="ticker-partner-card" key={ index }>
								<strong className="ticker-partner-name">
									{ partner.name }
								</strong>
								<span className="ticker-partner-tier mono">
									{ partner.tier }
								</span>
							</div>
						) ) }
					</div>
				</div>
			</div>
		</section>
	);
}
