import { useBlockProps, RichText } from '@wordpress/block-editor';

const STAGES = [ 'Pre-seed', 'Seed', 'Series A', 'Bridge' ];
const SECTORS = [
	'Life sciences',
	'Software',
	'Consumer',
	'Industrial tech',
	'Healthcare',
	'Fintech',
];

export default function save( { attributes } ) {
	const { heading, submitLabel, recipient } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block cherrystone-form-block',
	} );

	return (
		<section { ...blockProps }>
			<div className="container">
				<div className="block-head">
					<div>
						<RichText.Content tagName="h2" value={ heading } />
					</div>
				</div>

				<form
					className="cherrystone-apply-form multi-step-form"
					data-cherry-form="founder-application"
					data-recipient={ recipient }
					noValidate
				>
					<div className="form-progress">
						<div className="progress-track">
							<div
								className="progress-fill"
								data-cherry-progress-bar
								style={ { width: '25%' } }
							></div>
						</div>
						<div className="progress-labels">
							<span className="step-label is-active" data-step-label="1">
								Basic Info
							</span>
							<span className="step-label" data-step-label="2">
								Company
							</span>
							<span className="step-label" data-step-label="3">
								Financials
							</span>
							<span className="step-label" data-step-label="4">
								Pitch
							</span>
						</div>
					</div>

					<div className="form-steps-container">
						<div className="form-step is-active" data-step="1">
							<div className="form-grid">
								<div className="field">
									<label htmlFor="cs-ap-name">Founder name *</label>
									<input
										id="cs-ap-name"
										name="name"
										type="text"
										data-required
										autoComplete="name"
									/>
									<span
										className="field-error-msg"
										data-error-for="name"
										hidden
									></span>
								</div>
								<div className="field">
									<label htmlFor="cs-ap-email">Email *</label>
									<input
										id="cs-ap-email"
										name="email"
										type="email"
										data-required
										autoComplete="email"
									/>
									<span
										className="field-error-msg"
										data-error-for="email"
										hidden
									></span>
								</div>
								<div className="field">
									<label htmlFor="cs-ap-company">Company name *</label>
									<input
										id="cs-ap-company"
										name="company"
										type="text"
										data-required
									/>
									<span
										className="field-error-msg"
										data-error-for="company"
										hidden
									></span>
								</div>
								<div className="field">
									<label htmlFor="cs-ap-website">Website</label>
									<input
										id="cs-ap-website"
										name="website"
										type="url"
										placeholder="https://"
									/>
								</div>
							</div>
							<div className="cherrystone-form-actions step-actions">
								<button type="button" className="btn btn-accent btn-next">
									Next Step
								</button>
							</div>
						</div>

						<div className="form-step" data-step="2" hidden>
							<div className="form-grid">
								<fieldset className="field full">
									<legend>Stage — select all that apply *</legend>
									<div className="check-group" data-required-group="stages">
										{ STAGES.map( ( s, index ) => (
											<label
												key={ s }
												className="check"
												htmlFor={ `cs-ap-stage-${ index }` }
											>
												<input
													id={ `cs-ap-stage-${ index }` }
													type="checkbox"
													name="stages"
													value={ s }
												/>{ ' ' }
												{ s }
											</label>
										) ) }
									</div>
									<span
										className="field-error-msg"
										data-error-for="stages"
										hidden
									></span>
								</fieldset>

								<fieldset className="field full">
									<legend>Vertical — select all that apply *</legend>
									<div className="check-group" data-required-group="sectors">
										{ SECTORS.map( ( s, index ) => (
											<label
												key={ s }
												className="check"
												htmlFor={ `cs-ap-sector-${ index }` }
											>
												<input
													id={ `cs-ap-sector-${ index }` }
													type="checkbox"
													name="sectors"
													value={ s }
												/>{ ' ' }
												{ s }
											</label>
										) ) }
									</div>
									<span
										className="field-error-msg"
										data-error-for="sectors"
										hidden
									></span>
								</fieldset>
							</div>
							<div className="cherrystone-form-actions step-actions">
								<button type="button" className="btn btn-ghost btn-prev">
									Previous
								</button>
								<button type="button" className="btn btn-accent btn-next">
									Next Step
								</button>
							</div>
						</div>

						<div className="form-step" data-step="3" hidden>
							<div className="form-grid">
								<div className="field">
									<label htmlFor="cs-ap-raising">Amount raising *</label>
									<input
										id="cs-ap-raising"
										name="amtRaising"
										type="text"
										data-required
										placeholder="$1.5M"
									/>
									<span
										className="field-error-msg"
										data-error-for="amtRaising"
										hidden
									></span>
								</div>
								<div className="field">
									<label htmlFor="cs-ap-committed">
										Amount committed so far
									</label>
									<input
										id="cs-ap-committed"
										name="amtCommitted"
										type="text"
										placeholder="$400K SAFE"
									/>
								</div>
							</div>
							<div className="cherrystone-form-actions step-actions">
								<button type="button" className="btn btn-ghost btn-prev">
									Previous
								</button>
								<button type="button" className="btn btn-accent btn-next">
									Next Step
								</button>
							</div>
						</div>

						<div className="form-step" data-step="4" hidden>
							<div className="form-grid">
								<div className="field full">
									<label htmlFor="cs-ap-what">
										What are you building, and who is it for? *
									</label>
									<textarea
										id="cs-ap-what"
										name="whatBuilding"
										data-required
									></textarea>
									<span
										className="field-error-msg"
										data-error-for="whatBuilding"
										hidden
									></span>
								</div>
								<div className="field full">
									<label htmlFor="cs-ap-why">Why now? Why you? *</label>
									<textarea
										id="cs-ap-why"
										name="whyNow"
										data-required
									></textarea>
									<span
										className="field-error-msg"
										data-error-for="whyNow"
										hidden
									></span>
								</div>

								<div className="field">
									<label htmlFor="cs-ap-deck">Deck (link)</label>
									<input
										id="cs-ap-deck"
										name="deck"
										type="url"
										placeholder="https://docsend.com/…"
									/>
								</div>
								<div className="field">
									<label htmlFor="cs-ap-referral">Referred by (optional)</label>
									<input
										id="cs-ap-referral"
										name="referral"
										type="text"
										placeholder="Member name"
									/>
								</div>
							</div>
							<div className="cherrystone-form-actions step-actions">
								<button type="button" className="btn btn-ghost btn-prev">
									Previous
								</button>
								<button type="submit" className="btn btn-accent">
									{ submitLabel }
								</button>
							</div>
						</div>
					</div>
				</form>

				<div
					className="form-success"
					data-cherry-form-success
					role="status"
					aria-live="polite"
					tabIndex={ -1 }
					hidden
				>
					<div className="form-success-icon" aria-hidden="true">
						✓
					</div>
					<h3>Application email ready</h3>
					<p>
						Your email app should open with a prefilled message to Cherrystone.
						The application is not complete until that email is sent.
					</p>
					<button
						type="button"
						className="btn btn-ghost"
						data-cherry-form-copy
					>
						Copy application text
					</button>
				</div>
			</div>
		</section>
	);
}
