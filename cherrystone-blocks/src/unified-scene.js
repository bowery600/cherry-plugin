/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react';
import CoastalWaveMesh from './blocks/coastal-motif-spline-hero/CoastalWaveMesh';

export function UnifiedScene() {
	const [ heroData, setHeroData ] = useState( null );
	const [ scrollOffset, setScrollOffset ] = useState( 0 );

	useEffect( () => {
		const updateData = () => {
			const hero = document.querySelector( '.sequence-hero-container' );
			if ( hero ) {
				setHeroData( {
					speed:
						parseFloat( hero.getAttribute( 'data-speed' ) ) || 1.0,
					noiseDensity:
						parseFloat( hero.getAttribute( 'data-noise' ) ) || 2.0,
					color1: hero.getAttribute( 'data-color1' ) || '#b5121b',
					color2: hero.getAttribute( 'data-color2' ) || '#5f6f73',
					color3: hero.getAttribute( 'data-color3' ) || '#0a4266',
				} );
			} else {
				setHeroData( null );
			}
		};

		updateData();

		// MutationObserver catches Gutenberg editor state updates and navigations
		const observer = new window.MutationObserver( updateData );
		observer.observe( document.body, {
			attributes: true,
			childList: true,
			subtree: true,
		} );

		const handleScroll = () => {
			const maxScroll =
				document.documentElement.scrollHeight - window.innerHeight;
			const currentScroll = window.scrollY;
			setScrollOffset( maxScroll > 0 ? currentScroll / maxScroll : 0 );
		};
		window.addEventListener( 'scroll', handleScroll, { passive: true } );

		return () => {
			observer.disconnect();
			window.removeEventListener( 'scroll', handleScroll );
		};
	}, [] );

	return (
		<>
			{ heroData && (
				<group rotation={ [ scrollOffset * 0.4, 0, 0 ] }>
					<CoastalWaveMesh { ...heroData } />
				</group>
			) }
		</>
	);
}
