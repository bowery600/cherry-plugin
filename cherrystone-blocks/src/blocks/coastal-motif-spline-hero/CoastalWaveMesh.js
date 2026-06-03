/* eslint-disable react/no-unknown-property */
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Inline GLSL Shaders for ease of compilation in wp-scripts
const vertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uNoiseDensity;
  varying vec2 vUv;
  varying float vElevation;

  // Simple 2D Noise function
  float noise(vec2 p) {
    return sin(p.x * 0.5 + sin(p.y * 0.3)) * cos(p.y * 0.4 + cos(p.x * 0.2));
  }

  void main() {
    vUv = uv;
    
    // Calculate elevation using sine splines and noise
    float t = uTime * uSpeed;
    float e1 = sin(position.x * uNoiseDensity + t) * cos(position.y * uNoiseDensity * 0.8 + t);
    float e2 = noise(position.xy * uNoiseDensity * 0.5 + vec2(t * 0.3, t * 0.2));
    float elevation = (e1 * 0.6 + e2 * 0.4) * 1.5;
    
    vElevation = elevation;
    
    vec3 newPosition = position;
    newPosition.z += elevation;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Generate organic ambient gradient based on UV and distorted elevation
    float mixFactor1 = smoothstep(-1.5, 1.5, vElevation);
    float mixFactor2 = smoothstep(0.0, 1.0, vUv.x);
    
    vec3 c1 = mix(uColor1, uColor2, mixFactor1);
    vec3 finalColor = mix(c1, uColor3, mixFactor2);
    
    gl_FragColor = vec4(finalColor, 0.95);
  }
`;

export default function CoastalWaveMesh( {
	speed = 1.0,
	noiseDensity = 2.0,
	color1 = '#b5121b',
	color2 = '#5f6f73',
	color3 = '#0a4266',
} ) {
	const materialRef = useRef();

	// Parse hex colors safely to THREE.Color (memoized to prevent render thrashing)
	const { c1, c2, c3 } = useMemo( () => {
		return {
			c1: new THREE.Color( color1 ),
			c2: new THREE.Color( color2 ),
			c3: new THREE.Color( color3 ),
		};
	}, [ color1, color2, color3 ] );

	// Update uniforms dynamically when props change
	useEffect( () => {
		if ( materialRef.current ) {
			materialRef.current.uniforms.uSpeed.value = speed;
			materialRef.current.uniforms.uNoiseDensity.value = noiseDensity;
			materialRef.current.uniforms.uColor1.value.copy( c1 );
			materialRef.current.uniforms.uColor2.value.copy( c2 );
			materialRef.current.uniforms.uColor3.value.copy( c3 );
		}
	}, [ speed, noiseDensity, c1, c2, c3 ] );

	const prefersReducedMotionRef = useRef( false );

	useEffect( () => {
		const mediaQuery = window.matchMedia(
			'(prefers-reduced-motion: reduce)'
		);
		prefersReducedMotionRef.current = mediaQuery.matches;

		const listener = ( event ) => {
			prefersReducedMotionRef.current = event.matches;
		};

		mediaQuery.addEventListener( 'change', listener );
		return () => mediaQuery.removeEventListener( 'change', listener );
	}, [] );

	// Animate time uniform
	useFrame( ( state ) => {
		if ( materialRef.current && !prefersReducedMotionRef.current ) {
			materialRef.current.uniforms.uTime.value =
				state.clock.getElapsedTime();
		}
	} );

	return (
		<mesh
			rotation={ [ -Math.PI / 3.5, 0, -Math.PI / 10 ] }
			position={ [ 0, -1.5, -3 ] }
		>
			<planeGeometry args={ [ 16, 12, 128, 128 ] } />
			<shaderMaterial
				ref={ materialRef }
				vertexShader={ vertexShader }
				fragmentShader={ fragmentShader }
				uniforms={ {
					uTime: { value: 0 },
					uSpeed: { value: speed },
					uNoiseDensity: { value: noiseDensity },
					uColor1: { value: c1 },
					uColor2: { value: c2 },
					uColor3: { value: c3 },
				} }
				transparent
				depthWrite={ false }
			/>
		</mesh>
	);
}
