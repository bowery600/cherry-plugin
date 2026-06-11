import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const {
		eyebrow,
		heading,
		lede,
		defaultSector,
		defaultStage,
		defaultRoots,
	} = attributes;
	const blockProps = useBlockProps( {
		className: 'block pitch-calculator-section',
	} );

	// Editor interactive state simulation
	const [ amt, setAmt ] = useState( 500000 );
	const [ sector, setSector ] = useState( defaultSector );
	const [ stage, setStage ] = useState( defaultStage );
	const [ roots, setRoots ] = useState( defaultRoots );

	// Calculate a simulated score
	let score = 50;
	if ( stage === 'Seed' ) {
		score += 20;
	} else if ( stage === 'Pre-seed' ) {
		score += 15;
	} else {
		score -= 10;
	}

	if (
		sector === 'SaaS' ||
		sector === 'DeepTech' ||
		sector === 'LifeSciences'
	) {
		score += 20;
	} else {
		score += 5;
	}

	if ( roots === 'New England' ) {
		score += 30;
	} else if ( roots === 'Expansion' ) {
		score += 15;
	}

	if ( amt >= 250000 && amt <= 1000000 ) {
		score += 10;
	} else {
		score -= 5;
	}

	score = Math.min( 100, Math.max( 10, score ) );
	let scoreStatus = 'MODERATE';
	let feedback =
		'Cherrystone typically requires New England presence, software/tech verticals, and $250k–$1M investment sizes.';
	if ( score >= 80 ) {
		scoreStatus = 'EXCELLENT';
		feedback =
			'Highly aligned! Cherrystone actively seeks early stage startups with your exact profile in New England. Apply today.';
	} else if ( score >= 60 ) {
		scoreStatus = 'STRONG';
		feedback =
			'Strong potential. While some of your parameters are on our borderlines, we encourage submitting an application for review.';
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title="Calculator Settings" initialOpen={ true }>
					<SelectControl
						label="Default Sector Fit"
						value={ defaultSector }
						options={ [
							{ label: 'SaaS / Enterprise', value: 'SaaS' },
							{
								label: 'Life Sciences / MedTech',
								value: 'LifeSciences',
							},
							{
								label: 'DeepTech / ClimateTech',
								value: 'DeepTech',
							},
							{ label: 'Consumer / Other', value: 'Other' },
						] }
						onChange={ ( val ) =>
							setAttributes( { defaultSector: val } )
						}
					/>
					<SelectControl
						label="Default Stage Fit"
						value={ defaultStage }
						options={ [
							{ label: 'Pre-Seed', value: 'Pre-seed' },
							{ label: 'Seed', value: 'Seed' },
							{ label: 'Series A', value: 'Series A' },
							{ label: 'Late Stage', value: 'Late' },
						] }
						onChange={ ( val ) =>
							setAttributes( { defaultStage: val } )
						}
					/>
					<SelectControl
						label="Default Roots Fit"
						value={ defaultRoots }
						options={ [
							{ label: 'New England', value: 'New England' },
							{
								label: 'Willing to Relocate / Expand',
								value: 'Expansion',
							},
							{ label: 'No NE Roots', value: 'None' },
						] }
						onChange={ ( val ) =>
							setAttributes( { defaultRoots: val } )
						}
					/>
				</PanelBody>
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
								placeholder="FIT ASSESSMENT"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Are you a Cherrystone fit?"
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="Select your parameters to test fit..."
						/>
					</div>

					<div className="calculator-wrapper">
						<div className="calculator-grid">
							{ /* Left Side: Inputs */ }
							<div className="calculator-controls-panel">
								<div className="calc-control-group">
									<div className="mono control-label">
										01 / ROUND SIZE
									</div>
									<div className="slider-wrapper">
										<input
											type="range"
											min="100000"
											max="2500000"
											step="50000"
											value={ amt }
											onChange={ ( e ) =>
												setAmt(
													parseInt(
														e.target.value,
														10
													)
												)
											}
											className="calc-range-slider"
										/>
										<div className="slider-values">
											<span>$100k</span>
											<strong className="active-amt">
												$
												{ ( amt / 1000000 ).toFixed(
													2
												) }
												M
											</strong>
											<span>$2.5M</span>
										</div>
									</div>
								</div>

								<div className="calc-control-group">
									<div className="mono control-label">
										02 / VERTICAL SECTOR
									</div>
									<div className="calc-radio-grid">
										{ [
											{
												id: 'SaaS',
												label: 'SaaS / Software',
											},
											{
												id: 'LifeSciences',
												label: 'Life Sciences',
											},
											{
												id: 'DeepTech',
												label: 'DeepTech / Climate',
											},
											{
												id: 'Other',
												label: 'Consumer & Other',
											},
										].map( ( sec ) => (
											<button
												key={ sec.id }
												className={ `calc-selector-btn ${
													sector === sec.id
														? 'is-active'
														: ''
												}` }
												onClick={ () =>
													setSector( sec.id )
												}
											>
												{ sec.label }
											</button>
										) ) }
									</div>
								</div>

								<div className="calc-control-group">
									<div className="mono control-label">
										03 / FUNDING STAGE
									</div>
									<div className="calc-radio-grid">
										{ [
											{
												id: 'Pre-seed',
												label: 'Pre-Seed',
											},
											{ id: 'Seed', label: 'Seed Round' },
											{
												id: 'Series A',
												label: 'Series A',
											},
											{ id: 'Late', label: 'Late Stage' },
										].map( ( stg ) => (
											<button
												key={ stg.id }
												className={ `calc-selector-btn ${
													stage === stg.id
														? 'is-active'
														: ''
												}` }
												onClick={ () =>
													setStage( stg.id )
												}
											>
												{ stg.label }
											</button>
										) ) }
									</div>
								</div>

								<div className="calc-control-group">
									<div className="mono control-label">
										04 / NEW ENGLAND ROOTS
									</div>
									<div className="calc-radio-grid">
										{ [
											{
												id: 'New England',
												label: 'NE Based',
											},
											{
												id: 'Expansion',
												label: 'Willing to Expand',
											},
											{ id: 'None', label: 'Outside NE' },
										].map( ( rts ) => (
											<button
												key={ rts.id }
												className={ `calc-selector-btn ${
													roots === rts.id
														? 'is-active'
														: ''
												}` }
												onClick={ () =>
													setRoots( rts.id )
												}
											>
												{ rts.label }
											</button>
										) ) }
									</div>
								</div>
							</div>

							{ /* Right Side: Live Alignment Indicator */ }
							<div className="calculator-score-panel">
								<div className="score-dial-outer">
									<svg
										viewBox="0 0 100 100"
										className="score-svg"
									>
										<circle
											cx="50"
											cy="50"
											r="45"
											className="score-circle-bg"
										/>
										<circle
											cx="50"
											cy="50"
											r="45"
											className="score-circle-value"
											style={ {
												strokeDasharray: '283',
												strokeDashoffset: `${
													283 - ( 283 * score ) / 100
												}`,
											} }
										/>
									</svg>
									<div className="score-display">
										<span className="mono score-label">
											ALIGNMENT
										</span>
										<strong className="score-num">
											{ score }%
										</strong>
										<span className="mono score-status">
											{ scoreStatus }
										</span>
									</div>
								</div>

								<div className="calc-feedback-box">
									<p
										className="mono font-semibold"
										style={ {
											color: 'var(--accent-ink)',
											fontSize: '11px',
											textTransform: 'uppercase',
											letterSpacing: '0.08em',
											margin: '0 0 8px',
										} }
									>
										Diligence Insight
									</p>
									<p
										style={ {
											fontSize: '13px',
											margin: 0,
											color: 'var(--ink-muted)',
										} }
									>
										{ feedback }
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
