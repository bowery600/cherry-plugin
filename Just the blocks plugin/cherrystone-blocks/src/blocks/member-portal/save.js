import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		heroEyebrow,
		heroHeading,
		heroLede,
		eventsEyebrow,
		eventsHeading,
		eventsLede,
		events = [],
		resourcesEyebrow,
		resourcesHeading,
		resourcesLede,
		resources = [],
	} = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<section className="page-hero">
				<div className="container">
					<RichText.Content
						tagName="span"
						className="eyebrow accent"
						value={ heroEyebrow }
					/>
					<RichText.Content
						tagName="h1"
						style={ {
							marginTop: 24,
							fontSize: 'clamp(48px, 6vw, 88px)',
						} }
						value={ heroHeading }
					/>
					<RichText.Content
						tagName="p"
						className="lede"
						value={ heroLede }
					/>
				</div>
			</section>
			<section className="block">
				<div className="container">
					<div className="block-head">
						<div>
							<RichText.Content
								tagName="span"
								className="eyebrow accent"
								value={ eventsEyebrow }
							/>
							<RichText.Content
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ eventsHeading }
							/>
						</div>
						<RichText.Content
							tagName="p"
							className="lede"
							value={ eventsLede }
						/>
					</div>
					{ events.map( ( event, index ) => (
						<div className="event-card" key={ index }>
							<div className="event-date">
								<span className="month">
									{ event.month } { event.year }
								</span>
								{ event.day && (
									<RichText.Content
										tagName="span"
										className="day"
										value={ event.day }
									/>
								) }
							</div>
							<div className="event-info">
								<RichText.Content
									tagName="h3"
									style={ {
										color: ! event.day
											? 'var(--ink-muted)'
											: 'inherit',
									} }
									value={ event.title }
								/>
								{ event.loc && (
									<div className="meta">
										<RichText.Content
											tagName="span"
											value={ event.loc }
										/>
										<span className="sep">-</span>
										<RichText.Content
											tagName="span"
											value={ event.type }
										/>
									</div>
								) }
							</div>
							{ event.ctaLabel && event.url && (
								<a className="btn btn-ghost" href={ event.url }>
									{ event.ctaLabel }
								</a>
							) }
						</div>
					) ) }
				</div>
			</section>
			<section className="block warm">
				<div className="container">
					<div className="block-head">
						<div>
							<RichText.Content
								tagName="span"
								className="eyebrow accent"
								value={ resourcesEyebrow }
							/>
							<RichText.Content
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ resourcesHeading }
							/>
						</div>
						<RichText.Content
							tagName="p"
							className="lede"
							value={ resourcesLede }
						/>
					</div>
					<div className="value-grid">
						{ resources.map( ( resource, index ) => (
							<div
								className="value-card"
								style={ { height: '100%' } }
								key={ index }
							>
								<RichText.Content
									tagName="span"
									className="num"
									value={ `0${ index + 1 } - ${
										resource.tag
									}` }
								/>
								<RichText.Content
									tagName="h3"
									value={ resource.title }
								/>
								<RichText.Content
									tagName="p"
									value={ resource.desc }
								/>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</div>
	);
}
