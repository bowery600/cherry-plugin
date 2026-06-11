import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_STAT = {
	num: '10',
	suffix: '+',
	label: 'Stat Name',
	desc: 'Provide details about this milestone.',
	icon: 'trending-up',
};

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, stats = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block stats-dashboard-section',
	} );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Dashboard Stats"
					items={ stats }
					setItems={ ( value ) => setAttributes( { stats: value } ) }
					fields={ [
						{ key: 'num', label: 'Number Value (e.g. 18.5)' },
						{ key: 'suffix', label: 'Suffix (e.g. M+)' },
						{ key: 'label', label: 'Label' },
						{
							key: 'desc',
							label: 'Brief Description',
							type: 'textarea',
						},
						{
							key: 'icon',
							label: 'Icon Name (e.g. briefcase, users, award, trending-up)',
						},
					] }
					newItem={ NEW_STAT }
					getItemLabel={ ( item, index ) =>
						item.label || `Stat ${ index + 1 }`
					}
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
								placeholder="IMPACT & SCALE"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Cherrystone by the numbers."
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="Provide subtext description..."
						/>
					</div>

					<div className="stats-dashboard-grid">
						{ stats.map( ( stat, index ) => (
							<div key={ index } className="stats-dashboard-card">
								<div className="stats-card-header">
									<div className="stats-icon-wrap">
										<span className="mono stats-card-idx">
											0{ index + 1 }
										</span>
									</div>
								</div>
								<div className="stats-card-body">
									<div className="stats-number-display">
										<RichText
											tagName="strong"
											className="stats-number-value"
											value={ stat.num }
											onChange={ ( val ) =>
												setAttributes( {
													stats: updateItem(
														stats,
														index,
														{ num: val }
													),
												} )
											}
											placeholder="00"
										/>
										<RichText
											tagName="span"
											className="stats-number-suffix"
											value={ stat.suffix }
											onChange={ ( val ) =>
												setAttributes( {
													stats: updateItem(
														stats,
														index,
														{ suffix: val }
													),
												} )
											}
											placeholder="+"
										/>
									</div>
									<RichText
										tagName="h3"
										className="stats-card-label"
										value={ stat.label }
										onChange={ ( val ) =>
											setAttributes( {
												stats: updateItem(
													stats,
													index,
													{ label: val }
												),
											} )
										}
										placeholder="Stat Label"
									/>
									<RichText
										tagName="p"
										className="stats-card-desc"
										value={ stat.desc }
										onChange={ ( val ) =>
											setAttributes( {
												stats: updateItem(
													stats,
													index,
													{ desc: val }
												),
											} )
										}
										placeholder="Stat Description"
									/>
								</div>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</>
	);
}
