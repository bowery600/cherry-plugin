export const ShellArcs = ( { color = 'var(--accent)', opacity = 0.5 } ) => (
	<svg
		className="shell-anim"
		viewBox="0 0 400 400"
		style={ { width: '100%', height: '100%', opacity } }
		aria-hidden="true"
	>
		<g stroke={ color } fill="none" strokeWidth="1">
			{ Array.from( { length: 14 } ).map( ( _item, index ) => (
				<path
					key={ index }
					d={ `M ${ 20 + index * 5 } 380 Q 200 ${
						380 - ( index + 1 ) * 22
					} ${ 380 - index * 5 } 380` }
				/>
			) ) }
		</g>
	</svg>
);

export const MeshGradient = ( { opacity = 0.55 } ) => (
	<div className="mesh-gradient" aria-hidden="true" style={ { opacity } }>
		<span className="mesh-blob mesh-blob-1" />
		<span className="mesh-blob mesh-blob-2" />
		<span className="mesh-blob mesh-blob-3" />
	</div>
);

export const WaveMotif = ( { opacity = 1, color = '#ffffff' } ) => (
	<svg
		className="wave-anim"
		viewBox="0 0 1200 600"
		preserveAspectRatio="none"
		style={ { width: '100%', height: '100%', opacity } }
		aria-hidden="true"
	>
		<g stroke={ color } fill="none" strokeWidth="1">
			<path d="M 0,300 Q 150,220 300,300 T 600,300 T 900,300 T 1200,300" />
			<path
				d="M 0,330 Q 150,250 300,330 T 600,330 T 900,330 T 1200,330"
				opacity="0.6"
			/>
			<path
				d="M 0,410 Q 180,300 360,410 T 720,410 T 1080,410 T 1440,410"
				opacity="0.5"
			/>
			<path
				d="M 0,500 Q 200,370 400,500 T 800,500 T 1200,500 T 1600,500"
				opacity="0.35"
			/>
		</g>
	</svg>
);

export const GrainOverlay = ( { opacity = 0.05 } ) => (
	<svg
		className="grain-overlay"
		aria-hidden="true"
		style={ { opacity } }
		preserveAspectRatio="none"
	>
		<filter id="cherry-grain">
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.9"
				numOctaves="2"
				stitchTiles="stitch"
			/>
			<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
		</filter>
		<rect width="100%" height="100%" filter="url(#cherry-grain)" />
	</svg>
);
