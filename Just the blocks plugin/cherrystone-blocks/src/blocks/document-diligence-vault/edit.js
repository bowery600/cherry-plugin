import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

import { RepeaterControls, updateItem } from '../../shared/editor-controls';

const NEW_DOC = {
	title: 'New Diligence Document',
	type: 'PDF',
	size: '1.0 MB',
	isLocked: false,
};

export default function Edit( { attributes, setAttributes } ) {
	const { eyebrow, heading, lede, vaultDocuments = [] } = attributes;
	const blockProps = useBlockProps( {
		className: 'block document-vault-section',
	} );

	return (
		<>
			<InspectorControls>
				<RepeaterControls
					title="Vault Documents"
					items={ vaultDocuments }
					setItems={ ( value ) =>
						setAttributes( { vaultDocuments: value } )
					}
					fields={ [
						{ key: 'title', label: 'Document Title' },
						{ key: 'type', label: 'Type (e.g. PDF, XLSX, DOCX)' },
						{ key: 'size', label: 'File Size' },
					] }
					newItem={ NEW_DOC }
					getItemLabel={ ( item, index ) =>
						item.title || `Document ${ index + 1 }`
					}
				/>
				<PanelBody title="Security Settings" initialOpen={ true }>
					{ vaultDocuments.map( ( doc, index ) => (
						<ToggleControl
							key={ index }
							label={ `Lock: ${ doc.title || index + 1 }` }
							checked={ doc.isLocked || false }
							onChange={ ( val ) =>
								setAttributes( {
									vaultDocuments: updateItem(
										vaultDocuments,
										index,
										{ isLocked: val }
									),
								} )
							}
						/>
					) ) }
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
								placeholder="RESOURCES & GUIDELINES"
							/>
							<RichText
								tagName="h2"
								style={ { marginTop: 24 } }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								placeholder="Diligence templates."
							/>
						</div>
						<RichText
							tagName="p"
							className="lede"
							value={ lede }
							onChange={ ( value ) =>
								setAttributes( { lede: value } )
							}
							placeholder="Introduce resource vault..."
						/>
					</div>

					<div className="document-vault-grid">
						{ vaultDocuments.map( ( doc, index ) => (
							<div
								key={ index }
								className={ `vault-document-card ${
									doc.isLocked ? 'is-locked-vault' : ''
								}` }
							>
								<div className="vault-doc-icon-pane">
									<div className="vault-file-icon">
										<span className="mono">
											{ doc.type }
										</span>
									</div>
								</div>

								<div className="vault-doc-details">
									<RichText
										tagName="strong"
										className="vault-doc-title"
										value={ doc.title }
										onChange={ ( val ) =>
											setAttributes( {
												vaultDocuments: updateItem(
													vaultDocuments,
													index,
													{ title: val }
												),
											} )
										}
										placeholder="Document Title"
									/>
									<div className="vault-doc-meta mono">
										<span>{ doc.size }</span>
										{ doc.isLocked ? (
											<span className="secure-badge-gold">
												SECURE MEMBER ACCESS ONLY
											</span>
										) : (
											<span className="secure-badge-open">
												PUBLIC DOWNLOAD
											</span>
										) }
									</div>
								</div>

								<div className="vault-doc-actions">
									{ doc.isLocked ? (
										<span className="vault-action-locked-btn">
											<span className="icon-lock-gold">
												&nbsp;
											</span>
										</span>
									) : (
										<button className="btn btn-ghost doc-download-btn-vault">
											DOWNLOAD
										</button>
									) }
								</div>
							</div>
						) ) }
					</div>
				</div>
			</section>
		</>
	);
}
