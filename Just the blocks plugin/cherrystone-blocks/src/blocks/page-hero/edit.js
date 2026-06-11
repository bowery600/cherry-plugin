import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';
import { ArrowIcon } from '../../shared/icons';
import { ShellArcs } from '../../shared/motifs';

const NEW_META_ITEM = { label: 'Label', value: 'Value' };

export default function Edit( { attributes, setAttributes } ) {
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
		secondaryCtaLabel,
		metaItems = [],
	} = attributes;
	const blockProps = useBlockProps( {
		className: `page-hero${ showGraphic ? ' with-graphic' : '' }`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Hero display" initialOpen>
					<ToggleControl
						label="Show right-side graphic"
						checked={ showGraphic }
						onChange={ ( value ) =>
							setAttributes( { showGraphic: value } )
						}
					/>
					<ToggleControl
						label="Show metadata row"
						checked={ showMeta }
						onChange={ ( value ) =>
							setAttributes( { showMeta: value } )
						}
					/>
					<ToggleControl
						label="Show action buttons"
						checked={ showActions }
						onChange={ ( value ) =>
							setAttributes( { showActions: value } )
						}
					/>
					<ToggleControl
						label="Show readiness meter"
						checked={ showProgress }
						onChange={ ( value ) =>
							setAttributes( { showProgress: value } )
						}
					/>
					{ showProgress && (
						<RangeControl
							label="Readiness value"
							value={ progressValue }
							onChange={ ( value ) =>
								setAttributes( { progressValue: value } )
							}
							min={ 0 }
							max={ 100 }
						/>
					) }
				</PanelBody>
				<RepeaterControls
					title="Metadata"
					items={ metaItems }
					setItems={ ( value ) =>
						setAttributes( { metaItems: value } )
					}
					fields={ [
						{ key: 'label', label: 'Label' },
						{ key: 'value', label: 'Value' },
					] }
					newItem={ NEW_META_ITEM }
					getItemLabel={ ( item ) => item.label || item.value }
				/>
			</InspectorControls>
			<section { ...blockProps }>
				{ showGraphic && (
					<div className="page-hero-graphic">
						<ShellArcs color="var(--accent)" opacity={ 0.32 } />
					</div>
				) }
				<div className="container">
					<RichText
						tagName="span"
						className="eyebrow accent"
						value={ eyebrow }
						onChange={ ( value ) =>
							setAttributes( { eyebrow: value } )
						}
						placeholder="Eyebrow"
					/>
					<RichText
						tagName="h1"
						style={ { marginTop: 24 } }
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder="Page heading"
					/>
					<RichText
						tagName="p"
						className="lede"
						value={ lede }
						onChange={ ( value ) =>
							setAttributes( { lede: value } )
						}
						placeholder="Intro copy"
					/>
					{ showActions && (
						<div className="page-hero-actions">
							<span className="btn btn-accent">
								<RichText
									tagName="span"
									value={ primaryCtaLabel }
									onChange={ ( value ) =>
										setAttributes( {
											primaryCtaLabel: value,
										} )
									}
									placeholder="Primary CTA"
								/>
								<ArrowIcon />
							</span>
							<span className="btn btn-ghost">
								<RichText
									tagName="span"
									value={ secondaryCtaLabel }
									onChange={ ( value ) =>
										setAttributes( {
											secondaryCtaLabel: value,
										} )
									}
									placeholder="Secondary CTA"
								/>
								<ArrowIcon />
							</span>
						</div>
					) }
					{ showMeta && metaItems.length > 0 && (
						<div className="page-hero-meta">
							{ metaItems.map( ( item, index ) => (
								<span key={ index }>
									<RichText
										tagName="strong"
										value={ item.label }
										onChange={ ( value ) =>
											setAttributes( {
												metaItems: updateItem(
													metaItems,
													index,
													{ label: value }
												),
											} )
										}
									/>{ ' ' }
									<RichText
										tagName="span"
										value={ item.value }
										onChange={ ( value ) =>
											setAttributes( {
												metaItems: updateItem(
													metaItems,
													index,
													{ value }
												),
											} )
										}
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
								<RichText
									tagName="span"
									value={ progressLabel }
									onChange={ ( value ) =>
										setAttributes( {
											progressLabel: value,
										} )
									}
									placeholder="Readiness label"
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
		</>
	);
}
