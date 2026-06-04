/* eslint-disable react/no-unknown-property */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const blobVertexShader = `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const blobFragmentShader = `
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
void main() {
	float d = distance(vUv, vec2(0.5));
	float alpha = uOpacity * exp(-d * d * 14.0);
	gl_FragColor = vec4(uColor, alpha);
}
`;

const BLOB_CONFIGS = [
	{ color: '#b5121b', opacity: 0.06,  baseX: -2.8, baseY:  1.8, z: -2.0, size: 7, amp: 0.25, freq: 0.11, phase: 0.0 },
	{ color: '#0E4164', opacity: 0.09,  baseX:  3.2, baseY: -0.8, z: -2.5, size: 8, amp: 0.28, freq: 0.09, phase: 2.1 },
	{ color: '#9a7a3d', opacity: 0.055, baseX:  0.5, baseY: -2.5, z: -1.5, size: 6, amp: 0.22, freq: 0.13, phase: 4.2 },
];

function BlobMesh( { cfg } ) {
	const meshRef = useRef();

	const uniforms = useMemo( () => ( {
		uColor: { value: new THREE.Color( cfg.color ) },
		uOpacity: { value: cfg.opacity },
	} ), [] ); // eslint-disable-line react-hooks/exhaustive-deps

	const prefersReducedMotion = useRef(
		typeof window !== 'undefined' &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
	);

	useFrame( ( { clock } ) => {
		if ( ! meshRef.current || prefersReducedMotion.current ) return;
		const t = clock.getElapsedTime();
		meshRef.current.position.x = cfg.baseX + cfg.amp * Math.sin( t * cfg.freq + cfg.phase );
		meshRef.current.position.y = cfg.baseY + cfg.amp * Math.cos( t * cfg.freq * 0.7 + cfg.phase * 1.3 );
	} );

	return (
		<mesh
			ref={ meshRef }
			position={ [ cfg.baseX, cfg.baseY, cfg.z ] }
			scale={ [ cfg.size, cfg.size, 1 ] }
		>
			<planeGeometry args={ [ 1, 1 ] } />
			<shaderMaterial
				vertexShader={ blobVertexShader }
				fragmentShader={ blobFragmentShader }
				uniforms={ uniforms }
				transparent
				depthWrite={ false }
			/>
		</mesh>
	);
}

// Props are accepted but unused — callers (edit.js, unified-scene.js) may still pass
// legacy wave attributes; the blob design uses fixed brand colours.
export default function CoastalWaveMesh() {
	return (
		<>
			{ BLOB_CONFIGS.map( ( cfg, i ) => (
				<BlobMesh key={ i } cfg={ cfg } />
			) ) }
		</>
	);
}
