import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { eyebrow, heading, lede, vaultDocuments = [] } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'block document-vault-section',
	} );

	return (
		<section { ...blockProps }>
			<div className="container">
				<div className="block-head">
					<div>
						<RichText.Content
							tagName="span"
							className="eyebrow accent"
							value={ eyebrow }
						/>
						<RichText.Content
							tagName="h2"
							style={ { marginTop: 24 } }
							value={ heading }
						/>
					</div>
					<RichText.Content
						tagName="p"
						className="lede"
						value={ lede }
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
									<span className="mono">{ doc.type }</span>
								</div>
							</div>

							<div className="vault-doc-details">
								<RichText.Content
									tagName="strong"
									className="vault-doc-title"
									value={ doc.title }
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
	);
}
