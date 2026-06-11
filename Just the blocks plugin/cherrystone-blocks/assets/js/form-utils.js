( function ( root ) {
	function buildMailto( { recipient, subject, lines } ) {
		const body = lines.join( '\n' );
		return (
			'mailto:' +
			recipient +
			'?subject=' +
			encodeURIComponent( subject ) +
			'&body=' +
			encodeURIComponent( body )
		);
	}

	const api = { buildMailto };

	if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = api;
	}
	root.cherrystoneFormUtils = api;
} )( typeof window !== 'undefined' ? window : globalThis );
