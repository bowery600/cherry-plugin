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

const PEBBLE_CONFIGS = [
	{ baseX: -1.6, baseY: 1.4, z: 0.8, radius: 0.52 },
	{ baseX: 1.8, baseY: -0.8, z: 1.2, radius: 0.4 },
	{ baseX: -0.7, baseY: -2.0, z: 0.4, radius: 0.28 },
];

function createPebbleGeometry( radius, detail ) {
	const geo = new THREE.IcosahedronGeometry( radius, detail );
	const pos = geo.attributes.position;
	for ( let i = 0; i < pos.count; i++ ) {
		const x = pos.getX( i );
		const y = pos.getY( i );
		const z = pos.getZ( i );
		const noise = Math.sin( x * 2.5 ) * Math.cos( y * 2.5 ) * Math.sin( z * 2.5 ) * 0.15;
		const factor = 1.0 + noise;
		pos.setXYZ( i, x * factor, y * factor * 0.72, z * factor * 1.15 );
	}
	geo.computeVertexNormals();
	return geo;
}

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

function PointLightSource( { cfg } ) {
	const lightRef = useRef();
	const prefersReducedMotion = useRef(
		typeof window !== 'undefined' &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
	);

	useFrame( ( { clock } ) => {
		if ( ! lightRef.current || prefersReducedMotion.current ) return;
		const t = clock.getElapsedTime();
		lightRef.current.position.x = cfg.baseX + cfg.amp * Math.sin( t * cfg.freq + cfg.phase );
		lightRef.current.position.y = cfg.baseY + cfg.amp * Math.cos( t * cfg.freq * 0.7 + cfg.phase * 1.3 );
		lightRef.current.position.z = cfg.z + 1.0;
	} );

	return (
		<pointLight
			ref={ lightRef }
			color={ cfg.color }
			intensity={ 4.0 }
			distance={ 15 }
			position={ [ cfg.baseX, cfg.baseY, cfg.z + 1.0 ] }
		/>
	);
}

function PebbleMesh( { cfg, idx } ) {
	const meshRef = useRef();

	const geometry = useMemo( () => createPebbleGeometry( cfg.radius, 3 ), [ cfg.radius ] );

	const prefersReducedMotion = useRef(
		typeof window !== 'undefined' &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
	);

	useFrame( ( { clock } ) => {
		if ( ! meshRef.current || prefersReducedMotion.current ) return;
		const t = clock.getElapsedTime();
		const speedMultiplier = 1.0 + idx * 0.15;

		meshRef.current.rotation.x = t * 0.04 * speedMultiplier;
		meshRef.current.rotation.y = t * 0.06 * speedMultiplier;

		const floatOffset = Math.sin( t * 0.18 * speedMultiplier + idx * 2.0 ) * 0.12;

		const scrollOffset = typeof window !== 'undefined' && document.documentElement.scrollHeight > window.innerHeight
			? window.scrollY / ( document.documentElement.scrollHeight - window.innerHeight )
			: 0;

		meshRef.current.position.x = cfg.baseX;
		meshRef.current.position.y = cfg.baseY + floatOffset - scrollOffset * 1.8 * ( idx + 1 );
	} );

	return (
		<mesh
			ref={ meshRef }
			geometry={ geometry }
			position={ [ cfg.baseX, cfg.baseY, cfg.z ] }
		>
			<meshPhysicalMaterial
				color={ 0xffffff }
				roughness={ 0.2 }
				transmission={ 0.92 }
				thickness={ 1.2 }
				ior={ 1.5 }
				clearcoat={ 1.0 }
				clearcoatRoughness={ 0.1 }
				metalness={ 0.05 }
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
			{ /* Ambient and Directional Lights for Glass Pebbles */ }
			<ambientLight intensity={ 0.75 } />
			<directionalLight position={ [ 5, 5, 4 ] } intensity={ 1.5 } />

			{ /* Synced Point Lights */ }
			{ BLOB_CONFIGS.map( ( cfg, i ) => (
				<PointLightSource key={ `light-${ i }` } cfg={ cfg } />
			) ) }

			{ /* Background Blobs */ }
			{ BLOB_CONFIGS.map( ( cfg, i ) => (
				<BlobMesh key={ `blob-${ i }` } cfg={ cfg } />
			) ) }

			{ /* 3D Glass Cherrystones */ }
			{ PEBBLE_CONFIGS.map( ( cfg, i ) => (
				<PebbleMesh key={ `pebble-${ i }` } idx={ i } cfg={ cfg } />
			) ) }
		</>
	);
}
