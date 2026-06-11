import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { heading, description, submitLabel, recipient } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block cherrystone-form-block',
	} );

	return (
		<section { ...blockProps }>
			<div className="container">
				<div className="block-head">
					<div>
						<RichText.Content
							tagName="h2"
							className="cherrystone-form-heading"
							value={ heading }
						/>
					</div>
					<RichText.Content
						tagName="p"
						className="lede"
						value={ description }
					/>
				</div>

				<form
					className="cherrystone-member-form"
					data-cherry-form="member-interest"
					data-recipient={ recipient }
					noValidate
				>
					<div className="form-grid">
						<div className="field">
							<label htmlFor="cs-mi-name">Name *</label>
							<input
								id="cs-mi-name"
								name="name"
								type="text"
								placeholder="Jane Investor"
								autoComplete="name"
							/>
							<span
								className="field-error-msg"
								data-error-for="name"
								hidden
							></span>
						</div>
						<div className="field">
							<label htmlFor="cs-mi-email">Email *</label>
							<input
								id="cs-mi-email"
								name="email"
								type="email"
								placeholder="you@example.com"
								autoComplete="email"
							/>
							<span
								className="field-error-msg"
								data-error-for="email"
								hidden
							></span>
						</div>
						<div className="field full">
							<label htmlFor="cs-mi-location">Location</label>
							<input
								id="cs-mi-location"
								name="location"
								type="text"
								placeholder="Providence, Boston, New York, etc."
							/>
						</div>
						<div className="field full">
							<label htmlFor="cs-mi-background">
								Professional / investing background *
							</label>
							<textarea
								id="cs-mi-background"
								name="background"
								placeholder="Operating, investing, industry, or board experience."
							></textarea>
							<span
								className="field-error-msg"
								data-error-for="background"
								hidden
							></span>
						</div>
						<div className="field full">
							<label htmlFor="cs-mi-interest">
								Why are you interested in Cherrystone? *
							</label>
							<textarea
								id="cs-mi-interest"
								name="interest"
								placeholder="What draws you to the group, and how would you like to participate?"
							></textarea>
							<span
								className="field-error-msg"
								data-error-for="interest"
								hidden
							></span>
						</div>
					</div>
					<div className="cherrystone-form-actions">
						<button type="submit" className="btn btn-accent">
							{ submitLabel }
						</button>
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
					<h3>Email draft ready</h3>
					<p>
						Your email app should open with a prefilled message to
						Cherrystone. Send it to complete your inquiry.
					</p>
					<button
						type="button"
						className="btn btn-ghost"
						data-cherry-form-copy
					>
						Copy email text
					</button>
				</div>
			</div>
		</section>
	);
}
