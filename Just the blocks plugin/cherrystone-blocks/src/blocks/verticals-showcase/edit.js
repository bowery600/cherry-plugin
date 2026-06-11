import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_VERTICAL = {
	sector: 'New Sector Vertical',
	stat: '00 Backed',
	ticket: '$50K - $150K',
	desc: 'Provide description details for this custom sector expertise.',
};

// Sourced from React component for identical visual matching
const ICONS = [
	// Life Sciences
	<svg
		key="0"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M4.5 16.5c-1.5 1.25-2.5 3-2.5 5h20c0-2-1-3.75-2.5-5" />
		<circle cx="12" cy="7" r="5" />
	</svg>,
	// Software & SaaS
	<svg
		key="1"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
		<line x1="8" y1="21" x2="16" y2="21" />
		<line x1="12" y1="17" x2="12" y2="21" />
	</svg>,
	// Consumer Products
	<svg
		key="2"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
		<line x1="3" y1="6" x2="21" y2="6" />
		<path d="M16 10a4 4 0 0 1-8 0" />
	</svg>,
	// Industrial Tech
	<svg
		key="3"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
		<circle cx="12" cy="12" r="3" />
	</svg>,
	// Healthcare IT
	<svg
		key="4"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
	</svg>,
	// Fintech Vertical
	<svg
		key="5"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="12" y1="1" x2="12" y2="23" />
		<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
	</svg>,
];

const FALLBACK_ICON = (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<circle cx="12" cy="12" r="10" />
		<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
		<line x1="12" y1="17" x2="12.01" y2="17" />
	</svg>
);

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, verticals = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block',
	} );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Sectors / Verticals"
					items={ verticals }
					setItems={ ( value ) =>
						setAttributes( { verticals: value } )
					}
					fields={ [
						{ key: 'sector', label: 'Sector Name' },
						{ key: 'stat', label: 'Stats Badge (e.g. 08 Backed)' },
						{
							key: 'ticket',
							label: 'Allocation (e.g. $100K - $250K)',
						},
						{ key: 'desc', label: 'Description', type: 'textarea' },
					] }
					newItem={ NEW_VERTICAL }
					getItemLabel={ ( item, index ) =>
						item.sector || `Sector ${ index + 1 }`
					}
					initialOpen
				/>
			</InspectorControls>
			<section { ...blockProps }>
				<div className="container">
					<div className="block-head">
						<div>
							<RichText
								tagName="span"
								className="eyebrow accent"
								value={ eyebrow }
								onChange={ ( value ) =>
									setAttributes( { eyebrow: value } )
								}
								placeholder="Verticals"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Six areas of member expertise."
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="We invest where our members have built, sold, or operated..."
						/>
					</div>

					<div className="verticals-showcase-grid">
						{ verticals.map( ( item, index ) => (
							<div
								key={ index }
								className="vertical-showcase-card"
							>
								<div className="vertical-showcase-header">
									<div className="vertical-showcase-icon">
										{ ICONS[ index % ICONS.length ] ||
											FALLBACK_ICON }
									</div>
									<div className="vertical-showcase-meta">
										<span className="vertical-showcase-tag">
											ACTIVE CAP
										</span>
										<RichText
											tagName="span"
											className="vertical-showcase-stat"
											value={ item.stat }
											onChange={ ( value ) =>
												setAttributes( {
													verticals: updateItem(
														verticals,
														index,
														{ stat: value }
													),
												} )
											}
											placeholder="00 Backed"
										/>
									</div>
								</div>
								<RichText
									tagName="h3"
									value={ item.sector }
									onChange={ ( value ) =>
										setAttributes( {
											verticals: updateItem(
												verticals,
												index,
												{ sector: value }
											),
										} )
									}
									placeholder="Sector Name"
								/>
								<RichText
									tagName="p"
									value={ item.desc }
									onChange={ ( value ) =>
										setAttributes( {
											verticals: updateItem(
												verticals,
												index,
												{ desc: value }
											),
										} )
									}
									placeholder="Sector description details..."
								/>
								<div className="vertical-showcase-details">
									<div className="vertical-showcase-detail-row">
										<span className="vertical-showcase-detail-label">
											Allocation Limit:
										</span>
										<RichText
											tagName="span"
											className="vertical-showcase-detail-val"
											value={ item.ticket }
											onChange={ ( value ) =>
												setAttributes( {
													verticals: updateItem(
														verticals,
														index,
														{ ticket: value }
													),
												} )
											}
											placeholder="$100K - $250K"
										/>
									</div>
									<div className="vertical-showcase-detail-row">
										<span className="vertical-showcase-detail-label">
											Participation:
										</span>
										<span className="vertical-showcase-detail-val">
											Active Lead
										</span>
									</div>
								</div>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</>
	);
}
