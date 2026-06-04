/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react';
import CoastalWaveMesh from './blocks/coastal-motif-spline-hero/CoastalWaveMesh';

export function UnifiedScene() {
	const [ scrollOffset, setScrollOffset ] = useState( 0 );

	useEffect( () => {
		const handleScroll = () => {
			const maxScroll =
				document.documentElement.scrollHeight - window.innerHeight;
			setScrollOffset( maxScroll > 0 ? window.scrollY / maxScroll : 0 );
		};
		window.addEventListener( 'scroll', handleScroll, { passive: true } );
		return () => window.removeEventListener( 'scroll', handleScroll );
	}, [] );

	return (
		<group rotation={ [ scrollOffset * 0.2, 0, 0 ] }>
			<CoastalWaveMesh />
		</group>
	);
}
