import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { heading, submitLabel, recipient, wpformsId } = attributes;
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
					<TextControl
						label="WPForms form ID"
						help="Optional. If set and WPForms is active, this form renders on the front end instead of the email-draft fallback."
						value={ wpformsId ? String( wpformsId ) : '' }
						onChange={ ( value ) =>
							setAttributes( {
								wpformsId: parseInt( value, 10 ) || 0,
							} )
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
					</div>
					<p className="lede" aria-hidden="true">
						Founder application form (founder name, email, company,
						stage, verticals, amounts, what/why, deck) with a live
						readiness meter. Renders interactively on the front end.
					</p>
					<div className="cherrystone-form-actions">
						<span className="btn btn-accent">{ submitLabel }</span>
					</div>
				</div>
			</section>
		</>
	);
}
