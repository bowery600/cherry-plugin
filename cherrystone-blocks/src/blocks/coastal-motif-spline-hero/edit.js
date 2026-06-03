import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, ColorPalette, TextControl } from '@wordpress/components';
import { webglTunnel } from '../../webgl-tunnel';
import CoastalWaveMesh from './CoastalWaveMesh';

export default function Edit( { attributes, setAttributes } ) {
	const {
		kicker,
		headline,
		subheading,
		btnPrimaryText,
		btnSecondaryText,
		speed,
		noiseDensity,
		color1,
		color2,
		color3,
		videoSrc,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-cherrystone-image-sequence-editor-preview',
		style: {
			background: '#05263d',
			borderRadius: '12px',
			padding: '60px 40px',
			color: 'white',
			textAlign: 'center',
			border: '1px solid rgba(255,255,255,0.1)',
			fontFamily:
				'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			boxShadow: '0 20px 50px rgba(10, 66, 102, 0.25)',
			position: 'relative',
			overflow: 'hidden',
		},
	} );

	return (
		<>
			{ /* Gutenberg Sidebar controls */ }
			<InspectorControls>
				<PanelBody title="Video Settings" initialOpen={ true }>
					<TextControl
						label="Video Source URL"
						value={ videoSrc }
						onChange={ ( val ) =>
							setAttributes( { videoSrc: val } )
						}
						help="Relative or absolute URL of the scroll-animation .webm file (e.g. /wp-content/uploads/output.webm)."
					/>
				</PanelBody>
			<PanelBody title="WebGL Wave Settings (Editor Preview)" initialOpen={ false }>
					<RangeControl
						label="Animation Speed"
						value={ speed }
						onChange={ ( val ) => setAttributes( { speed: val } ) }
						min={ 0.1 }
						max={ 4.0 }
						step={ 0.1 }
					/>
					<RangeControl
						label="Noise Wave Density"
						value={ noiseDensity }
						onChange={ ( val ) =>
							setAttributes( { noiseDensity: val } )
						}
						min={ 0.5 }
						max={ 5.0 }
						step={ 0.1 }
					/>
					<p style={ { margin: '12px 0 4px', fontWeight: 'bold' } }>
						Wave Color 1
					</p>
					<ColorPalette
						colors={ [
							{ name: 'Red', color: '#b5121b' },
							{ name: 'Cool Gray', color: '#5f6f73' },
							{ name: 'Navy', color: '#0a4266' },
						] }
						value={ color1 }
						onChange={ ( val ) => setAttributes( { color1: val } ) }
					/>
					<p style={ { margin: '12px 0 4px', fontWeight: 'bold' } }>
						Wave Color 2
					</p>
					<ColorPalette
						colors={ [
							{ name: 'Red', color: '#b5121b' },
							{ name: 'Cool Gray', color: '#5f6f73' },
							{ name: 'Navy', color: '#0a4266' },
						] }
						value={ color2 }
						onChange={ ( val ) => setAttributes( { color2: val } ) }
					/>
					<p style={ { margin: '12px 0 4px', fontWeight: 'bold' } }>
						Wave Color 3
					</p>
					<ColorPalette
						colors={ [
							{ name: 'Red', color: '#b5121b' },
							{ name: 'Cool Gray', color: '#5f6f73' },
							{ name: 'Navy', color: '#0a4266' },
						] }
						value={ color3 }
						onChange={ ( val ) => setAttributes( { color3: val } ) }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Teleport Wave mesh to the unified root canvas */ }
			<webglTunnel.In>
				<CoastalWaveMesh
					speed={ speed }
					noiseDensity={ noiseDensity }
					color1={ color1 }
					color2={ color2 }
					color3={ color3 }
				/>
			</webglTunnel.In>

			<div { ...blockProps }>
				<div
					style={ {
						position: 'absolute',
						top: '20px',
						right: '20px',
						background: 'rgba(255, 106, 77, 0.15)',
						color: 'var(--accent, #ff6a4d)',
						fontFamily: 'monospace',
						fontSize: '10px',
						padding: '4px 8px',
						borderRadius: '4px',
						letterSpacing: '0.05em',
						fontWeight: '600',
					} }
				>
					UNIFIED R3F WEBGL BACKDROP ACTIVE
				</div>

				<div
					style={ {
						maxWidth: '800px',
						margin: '0 auto',
						display: 'flex',
						flexDirection: 'column',
						gap: '20px',
						alignItems: 'center',
					} }
				>
					{ /* Kicker Input */ }
					<div
						style={ {
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
						} }
					>
						<span
							style={ {
								display: 'inline-block',
								width: '6px',
								height: '6px',
								borderRadius: '50%',
								background: 'var(--accent, #ff6a4d)',
							} }
						/>
						<RichText
							tagName="span"
							value={ kicker }
							onChange={ ( val ) =>
								setAttributes( { kicker: val } )
							}
							placeholder="Pitch Night 2026 / Providence / October 21"
							style={ {
								fontFamily: 'monospace',
								fontSize: '12px',
								color: 'var(--accent, #ff6a4d)',
								letterSpacing: '0.14em',
								textTransform: 'uppercase',
								fontWeight: '600',
							} }
						/>
					</div>

					{ /* Headline Input */ }
					<RichText
						tagName="h1"
						value={ headline }
						onChange={ ( val ) =>
							setAttributes( { headline: val } )
						}
						placeholder="Investment capital for founders, when they need it most."
						style={ {
							fontSize: 'clamp(32px, 4vw, 54px)',
							lineHeight: '1.1',
							fontWeight: '600',
							margin: '0',
							color: '#ffffff',
							letterSpacing: '-0.015em',
						} }
					/>

					{ /* Subheading Input */ }
					<RichText
						tagName="p"
						value={ subheading }
						onChange={ ( val ) =>
							setAttributes( { subheading: val } )
						}
						placeholder="Cherrystone Angel Group is a community of accredited investors based in Providence..."
						style={ {
							fontSize: '16px',
							lineHeight: '1.55',
							color: 'rgba(255, 255, 255, 0.8)',
							maxWidth: '560px',
							margin: '0 auto',
						} }
					/>

					{ /* Buttons/Actions Inputs */ }
					<div
						style={ {
							display: 'flex',
							gap: '12px',
							marginTop: '10px',
							flexWrap: 'wrap',
							justifyContent: 'center',
						} }
					>
						<div
							style={ {
								background: 'var(--accent, #ff6a4d)',
								padding: '10px 20px',
								borderRadius: '999px',
								color: 'white',
								fontWeight: '600',
								fontSize: '13px',
							} }
						>
							<RichText
								tagName="span"
								value={ btnPrimaryText }
								onChange={ ( val ) =>
									setAttributes( { btnPrimaryText: val } )
								}
								placeholder="Apply for capital"
							/>
						</div>
						<div
							style={ {
								background: 'rgba(255,255,255,0.1)',
								border: '1px solid rgba(255,255,255,0.3)',
								padding: '10px 20px',
								borderRadius: '999px',
								color: 'white',
								fontWeight: '600',
								fontSize: '13px',
							} }
						>
							<RichText
								tagName="span"
								value={ btnSecondaryText }
								onChange={ ( val ) =>
									setAttributes( { btnSecondaryText: val } )
								}
								placeholder="See the portfolio"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
