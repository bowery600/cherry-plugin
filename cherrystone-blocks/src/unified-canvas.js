/* eslint-disable import/no-extraneous-dependencies */
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

function isWebGLSupported() {
	try {
		const canvas = document.createElement( 'canvas' );
		return !! (
			window.WebGLRenderingContext &&
			( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) )
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
	if ( bar ) bar.style.width = `${ progress }%`;
	if ( percentage ) percentage.textContent = `${ progress }%`;
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
		antialias: false,
		powerPreference: 'low-power',
	} );
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 55, 1, 0.1, 100 );
	const startTime = window.performance.now();

	let reducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	let renderedFirstFrame = false;

	renderer.setPixelRatio( Math.min( window.devicePixelRatio || 1, 1.5 ) );
	renderer.setClearColor( 0x000000, 0 );
	renderer.domElement.addEventListener( 'webglcontextlost', () => {
		document.body.classList.add( 'no-webgl' );
		container.style.display = 'none';
		hidePreloader();
	} );

	const planeGeo = new THREE.PlaneGeometry( 1, 1 );

	const blobs = BLOB_CONFIGS.map( ( cfg ) => {
		const material = new THREE.ShaderMaterial( {
			vertexShader: blobVertexShader,
			fragmentShader: blobFragmentShader,
			uniforms: {
				uColor: { value: new THREE.Color( cfg.color ) },
				uOpacity: { value: cfg.opacity },
			},
			transparent: true,
			depthWrite: false,
		} );
		const mesh = new THREE.Mesh( planeGeo, material );
		mesh.position.set( cfg.baseX, cfg.baseY, cfg.z );
		mesh.scale.set( cfg.size, cfg.size, 1 );
		scene.add( mesh );
		return { mesh, cfg };
	} );

	// ── 3D Translucent Glass Pebbles ─────────────────────────────────────────
	const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 );
	scene.add( ambientLight );

	const dirLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
	dirLight.position.set( 5, 5, 4 );
	scene.add( dirLight );

	const pointLights = BLOB_CONFIGS.map( ( cfg ) => {
		const light = new THREE.PointLight( cfg.color, 4.0, 15 );
		scene.add( light );
		return { light, cfg };
	} );

	const glassMaterial = new THREE.MeshPhysicalMaterial( {
		color: 0xffffff,
		roughness: 0.2,
		transmission: 0.92,
		thickness: 1.2,
		ior: 1.5,
		clearcoat: 1.0,
		clearcoatRoughness: 0.1,
		metalness: 0.05,
		transparent: true,
		depthWrite: false,
	} );

	const pebbles = PEBBLE_CONFIGS.map( ( cfg ) => {
		const geo = createPebbleGeometry( cfg.radius, 3 );
		const mesh = new THREE.Mesh( geo, glassMaterial );
		mesh.position.set( cfg.baseX, cfg.baseY, cfg.z );
		scene.add( mesh );
		return { mesh, baseX: cfg.baseX, baseY: cfg.baseY, z: cfg.z };
	} );

	container.replaceChildren( renderer.domElement );
	camera.position.z = 5;

	const resize = () => {
		const width = window.innerWidth || 1;
		const height = window.innerHeight || 1;
		renderer.setSize( width, height, false );
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	};

	const render = () => {
		const t = reducedMotion ? 0 : ( window.performance.now() - startTime ) / 1000;

		blobs.forEach( ( { mesh, cfg } ) => {
			mesh.position.x = cfg.baseX + cfg.amp * Math.sin( t * cfg.freq + cfg.phase );
			mesh.position.y = cfg.baseY + cfg.amp * Math.cos( t * cfg.freq * 0.7 + cfg.phase * 1.3 );
		} );

		pointLights.forEach( ( { light, cfg } ) => {
			light.position.x = cfg.baseX + cfg.amp * Math.sin( t * cfg.freq + cfg.phase );
			light.position.y = cfg.baseY + cfg.amp * Math.cos( t * cfg.freq * 0.7 + cfg.phase * 1.3 );
			light.position.z = cfg.z + 1.0;
		} );

		const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
		const scrollOffset = maxScroll > 0 ? window.scrollY / maxScroll : 0;

		pebbles.forEach( ( pebble, idx ) => {
			const speedMultiplier = 1.0 + idx * 0.15;
			pebble.mesh.rotation.x = t * 0.04 * speedMultiplier;
			pebble.mesh.rotation.y = t * 0.06 * speedMultiplier;

			const floatOffset = Math.sin( t * 0.18 * speedMultiplier + idx * 2.0 ) * 0.12;
			pebble.mesh.position.x = pebble.baseX;
			pebble.mesh.position.y = pebble.baseY + floatOffset - scrollOffset * 1.8 * ( idx + 1 );
		} );

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
	setPreloaderProgress( 65 );
	window.addEventListener( 'resize', resize, { passive: true } );
	motionQuery.addEventListener( 'change', updateMotionPreference );
	render();
}

if ( ! isWebGLSupported() ) {
	document.body.classList.add( 'no-webgl' );
	const container = document.getElementById( 'unified-root-canvas-container' );
	if ( container ) container.style.display = 'none';
	setPreloaderProgress( 100 );
	hidePreloader();
} else {
	document.body.classList.remove( 'no-webgl' );
	bootCanvas();
}
