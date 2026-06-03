import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_EVENT = {
	day: '01',
	month: 'Jan',
	year: '2027',
	title: 'New meeting',
	loc: 'Location',
	type: 'In-person',
	ctaLabel: '',
	url: '',
};
const NEW_RESOURCE = {
	tag: 'NEW',
	title: 'New resource',
	desc: 'Resource description.',
};

export default function Edit( { attributes, setAttributes } ) {
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
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Meetings"
					items={ events }
					setItems={ ( value ) => setAttributes( { events: value } ) }
					fields={ [
						{ key: 'day', label: 'Day' },
						{ key: 'month', label: 'Month' },
						{ key: 'year', label: 'Year' },
						{ key: 'title', label: 'Title' },
						{ key: 'loc', label: 'Location' },
						{ key: 'type', label: 'Type' },
						{ key: 'ctaLabel', label: 'Optional CTA label' },
						{ key: 'url', label: 'Optional CTA URL' },
					] }
					newItem={ NEW_EVENT }
					getItemLabel={ ( item ) => item.title }
					initialOpen
				/>
				<RepeaterControls
					title="Resources"
					items={ resources }
					setItems={ ( value ) =>
						setAttributes( { resources: value } )
					}
					fields={ [
						{ key: 'tag', label: 'Tag' },
						{ key: 'title', label: 'Title' },
						{ key: 'desc', label: 'Description', type: 'textarea' },
					] }
					newItem={ NEW_RESOURCE }
					getItemLabel={ ( item ) => item.title }
				/>
			</InspectorControls>
			<div { ...blockProps }>
				<section className="page-hero">
					<div className="container">
						<RichText
							tagName="span"
							className="eyebrow accent"
							value={ heroEyebrow }
							onChange={ ( value ) =>
								setAttributes( { heroEyebrow: value } )
							}
						/>
						<RichText
							tagName="h1"
							style={ {
								marginTop: 24,
								fontSize: 'clamp(48px, 6vw, 88px)',
							} }
							value={ heroHeading }
							onChange={ ( value ) =>
								setAttributes( { heroHeading: value } )
							}
						/>
						<RichText
							tagName="p"
							className="lede"
							value={ heroLede }
							onChange={ ( value ) =>
								setAttributes( { heroLede: value } )
							}
						/>
					</div>
				</section>
				<section className="block">
					<div className="container">
						<div className="block-head">
							<div>
								<RichText
									tagName="span"
									className="eyebrow accent"
									value={ eventsEyebrow }
									onChange={ ( value ) =>
										setAttributes( {
											eventsEyebrow: value,
										} )
									}
								/>
								<RichText
									tagName="h2"
									style={ { marginTop: 24 } }
									value={ eventsHeading }
									onChange={ ( value ) =>
										setAttributes( {
											eventsHeading: value,
										} )
									}
								/>
							</div>
							<RichText
								tagName="p"
								className="lede"
								value={ eventsLede }
								onChange={ ( value ) =>
									setAttributes( { eventsLede: value } )
								}
							/>
						</div>
						{ events.map( ( event, index ) => (
							<div className="event-card" key={ index }>
								<div className="event-date">
									<span className="month">
										{ event.month } { event.year }
									</span>
									{ event.day && (
										<RichText
											tagName="span"
											className="day"
											value={ event.day }
											onChange={ ( value ) =>
												setAttributes( {
													events: updateItem(
														events,
														index,
														{ day: value }
													),
												} )
											}
										/>
									) }
								</div>
								<div className="event-info">
									<RichText
										tagName="h3"
										style={ {
											color: ! event.day
												? 'var(--ink-muted)'
												: 'inherit',
										} }
										value={ event.title }
										onChange={ ( value ) =>
											setAttributes( {
												events: updateItem(
													events,
													index,
													{ title: value }
												),
											} )
										}
									/>
									{ event.loc && (
										<div className="meta">
											<RichText
												tagName="span"
												value={ event.loc }
												onChange={ ( value ) =>
													setAttributes( {
														events: updateItem(
															events,
															index,
															{ loc: value }
														),
													} )
												}
											/>
											<span className="sep">-</span>
											<RichText
												tagName="span"
												value={ event.type }
												onChange={ ( value ) =>
													setAttributes( {
														events: updateItem(
															events,
															index,
															{ type: value }
														),
													} )
												}
											/>
										</div>
									) }
								</div>
								{ event.ctaLabel && (
									<span className="btn btn-ghost cherrystone-editable-link">
										{ event.ctaLabel }
									</span>
								) }
							</div>
						) ) }
					</div>
				</section>
				<section className="block warm">
					<div className="container">
						<div className="block-head">
							<div>
								<RichText
									tagName="span"
									className="eyebrow accent"
									value={ resourcesEyebrow }
									onChange={ ( value ) =>
										setAttributes( {
											resourcesEyebrow: value,
										} )
									}
								/>
								<RichText
									tagName="h2"
									style={ { marginTop: 24 } }
									value={ resourcesHeading }
									onChange={ ( value ) =>
										setAttributes( {
											resourcesHeading: value,
										} )
									}
								/>
							</div>
							<RichText
								tagName="p"
								className="lede"
								value={ resourcesLede }
								onChange={ ( value ) =>
									setAttributes( { resourcesLede: value } )
								}
							/>
						</div>
						<div className="value-grid">
							{ resources.map( ( resource, index ) => (
								<div
									className="value-card"
									style={ { height: '100%' } }
									key={ index }
								>
									<RichText
										tagName="span"
										className="num"
										value={ `0${ index + 1 } - ${
											resource.tag
										}` }
										onChange={ ( value ) =>
											setAttributes( {
												resources: updateItem(
													resources,
													index,
													{
														tag: value.replace(
															/^0\\d+\\s*-\\s*/i,
															''
														),
													}
												),
											} )
										}
									/>
									<RichText
										tagName="h3"
										value={ resource.title }
										onChange={ ( value ) =>
											setAttributes( {
												resources: updateItem(
													resources,
													index,
													{ title: value }
												),
											} )
										}
									/>
									<RichText
										tagName="p"
										value={ resource.desc }
										onChange={ ( value ) =>
											setAttributes( {
												resources: updateItem(
													resources,
													index,
													{ desc: value }
												),
											} )
										}
									/>
								</div>
							) ) }
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
