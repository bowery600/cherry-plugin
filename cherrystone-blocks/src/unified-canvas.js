/* eslint-disable import/no-extraneous-dependencies */
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
uniform float uSpeed;
uniform float uNoiseDensity;
varying vec2 vUv;
varying float vElevation;

float noise(vec2 p) {
	return sin(p.x * 0.5 + sin(p.y * 0.3)) * cos(p.y * 0.4 + cos(p.x * 0.2));
}

void main() {
	vUv = uv;
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
	float mixFactor1 = smoothstep(-1.5, 1.5, vElevation);
	float mixFactor2 = smoothstep(0.0, 1.0, vUv.x);
	vec3 c1 = mix(uColor1, uColor2, mixFactor1);
	vec3 finalColor = mix(c1, uColor3, mixFactor2);
	gl_FragColor = vec4(finalColor, 0.95);
}
`;

function isWebGLSupported() {
	try {
		const canvas = document.createElement( 'canvas' );
		return !! (
			window.WebGLRenderingContext &&
			( canvas.getContext( 'webgl' ) ||
				canvas.getContext( 'experimental-webgl' ) )
		);
	} catch {
		return false;
	}
}

function hidePreloader() {
	const preloader = document.querySelector( '.preloader-overlay' );
	if ( preloader ) {
		preloader.classList.add( 'fade-out' );
	}
}

function setPreloaderProgress( value ) {
	const progress = Math.max( 0, Math.min( 100, Math.round( value ) ) );
	const bar = document.querySelector( '.preloader-bar' );
	const percentage = document.querySelector( '.preloader-percentage' );

	if ( bar ) {
		bar.style.width = `${ progress }%`;
	}

	if ( percentage ) {
		percentage.textContent = `${ progress }%`;
	}
}

function getHeroSettings() {
	const hero = document.querySelector( '.sequence-hero-container' );

	if ( ! hero ) {
		return null;
	}

	return {
		speed: parseFloat( hero.getAttribute( 'data-speed' ) ) || 1,
		noiseDensity: parseFloat( hero.getAttribute( 'data-noise' ) ) || 2,
		color1: hero.getAttribute( 'data-color1' ) || '#b5121b',
		color2: hero.getAttribute( 'data-color2' ) || '#5f6f73',
		color3: hero.getAttribute( 'data-color3' ) || '#0a4266',
	};
}

function syncSettings( material ) {
	const settings = getHeroSettings();

	if ( ! settings ) {
		return false;
	}

	material.uniforms.uSpeed.value = settings.speed;
	material.uniforms.uNoiseDensity.value = settings.noiseDensity;
	material.uniforms.uColor1.value.set( settings.color1 );
	material.uniforms.uColor2.value.set( settings.color2 );
	material.uniforms.uColor3.value.set( settings.color3 );

	return true;
}

function createContainer() {
	let container = document.getElementById( 'unified-root-canvas-container' );

	if ( ! container ) {
		container = document.createElement( 'div' );
		container.id = 'unified-root-canvas-container';
		container.className = 'unified-root-canvas-container';
		document.body.appendChild( container );
	}

	Object.assign( container.style, {
		position: 'fixed',
		inset: '0',
		width: '100vw',
		height: '100vh',
		zIndex: '0',
		pointerEvents: 'none',
		overflow: 'hidden',
		background: 'transparent',
	} );

	document
		.querySelectorAll(
			'.wp-site-blocks, header.wp-block-template-part, main#main-content, footer.wp-block-template-part'
		)
		.forEach( ( element ) => {
			element.style.position = element.style.position || 'relative';
			element.style.zIndex = element.style.zIndex || '1';
		} );

	return container;
}

function bootCanvas() {
	const container = createContainer();
	const renderer = new THREE.WebGLRenderer( {
		alpha: true,
		antialias: true,
		powerPreference: 'high-performance',
	} );
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 55, 1, 0.1, 100 );
	const startTime = window.performance.now();
	const material = new THREE.ShaderMaterial( {
		vertexShader,
		fragmentShader,
		uniforms: {
			uTime: { value: 0 },
			uSpeed: { value: 1 },
			uNoiseDensity: { value: 2 },
			uColor1: { value: new THREE.Color( '#b5121b' ) },
			uColor2: { value: new THREE.Color( '#5f6f73' ) },
			uColor3: { value: new THREE.Color( '#0a4266' ) },
		},
		transparent: true,
		depthWrite: false,
	} );
	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry( 16, 12, 128, 128 ),
		material
	);

	let reducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	).matches;
	let renderedFirstFrame = false;

	renderer.setPixelRatio( Math.min( window.devicePixelRatio || 1, 2 ) );
	renderer.setClearColor( 0x000000, 0 );
	renderer.domElement.addEventListener( 'webglcontextlost', () => {
		document.body.classList.add( 'no-webgl' );
		container.style.display = 'none';
		hidePreloader();
	} );

	container.replaceChildren( renderer.domElement );
	camera.position.z = 5;
	mesh.rotation.set( -Math.PI / 3.5, 0, -Math.PI / 10 );
	mesh.position.set( 0, -1.5, -3 );
	scene.add( mesh );

	const resize = () => {
		const width = window.innerWidth || 1;
		const height = window.innerHeight || 1;
		renderer.setSize( width, height, false );
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	};

	const render = () => {
		if ( ! reducedMotion ) {
			material.uniforms.uTime.value =
				( window.performance.now() - startTime ) / 1000;
		}

		const maxScroll =
			document.documentElement.scrollHeight - window.innerHeight;
		const scrollOffset = maxScroll > 0 ? window.scrollY / maxScroll : 0;
		mesh.rotation.x = -Math.PI / 3.5 + scrollOffset * 0.4;

		syncSettings( material );
		renderer.render( scene, camera );

		if ( ! renderedFirstFrame ) {
			renderedFirstFrame = true;
			setPreloaderProgress( 100 );
			window.setTimeout( hidePreloader, 120 );
		}

		window.requestAnimationFrame( render );
	};

	const motionQuery = window.matchMedia( '(prefers-reduced-motion: reduce)' );
	const updateMotionPreference = ( event ) => {
		reducedMotion = event.matches;
	};

	resize();
	syncSettings( material );
	setPreloaderProgress( 65 );
	window.addEventListener( 'resize', resize, { passive: true } );
	motionQuery.addEventListener( 'change', updateMotionPreference );
	render();
}

if ( ! isWebGLSupported() ) {
	document.body.classList.add( 'no-webgl' );
	const container = document.getElementById( 'unified-root-canvas-container' );

	if ( container ) {
		container.style.display = 'none';
	}

	setPreloaderProgress( 100 );
	hidePreloader();
} else {
	document.body.classList.remove( 'no-webgl' );
	bootCanvas();
}
