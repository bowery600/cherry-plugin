import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { heading, description, submitLabel, recipient } = attributes;
	const blockProps = useBlockProps( {
		className: 'block cherrystone-form-block',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Form settings" initialOpen>
					<TextControl
						label="Submit button label"
						value={ submitLabel }
						onChange={ ( value ) =>
							setAttributes( { submitLabel: value } )
						}
					/>
					<TextControl
						label="Recipient email"
						value={ recipient }
						onChange={ ( value ) =>
							setAttributes( { recipient: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<section { ...blockProps }>
				<div className="container">
					<div className="block-head">
						<div>
							<RichText
								tagName="h2"
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Form heading"
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder="Intro copy"
						/>
					</div>
					<div className="form-grid" aria-hidden="true">
						<div className="field">
							<span className="field-label">Name *</span>
							<input type="text" disabled />
						</div>
						<div className="field">
							<span className="field-label">Email *</span>
							<input type="email" disabled />
						</div>
						<div className="field full">
							<span className="field-label">Location</span>
							<input type="text" disabled />
						</div>
						<div className="field full">
							<span className="field-label">
								Professional / investing background *
							</span>
							<textarea disabled></textarea>
						</div>
						<div className="field full">
							<span className="field-label">
								Why are you interested in Cherrystone? *
							</span>
							<textarea disabled></textarea>
						</div>
					</div>
					<div className="cherrystone-form-actions">
						<span className="btn btn-accent">{ submitLabel }</span>
					</div>
				</div>
			</section>
		</>
	);
}
