const assert = require( 'node:assert' );
const { buildMailto } = require( '../assets/js/form-utils.js' );

const result = buildMailto( {
	recipient: 'info@cherrystoneangelgroup.com',
	subject: 'Member interest: Jane Investor',
	lines: [ 'Hello Cherrystone team,', '', 'Name: Jane Investor' ],
} );

assert.strictEqual(
	result,
	'mailto:info@cherrystoneangelgroup.com' +
		'?subject=' +
		encodeURIComponent( 'Member interest: Jane Investor' ) +
		'&body=' +
		encodeURIComponent( 'Hello Cherrystone team,\n\nName: Jane Investor' ),
	'buildMailto should produce an encoded mailto string'
);
