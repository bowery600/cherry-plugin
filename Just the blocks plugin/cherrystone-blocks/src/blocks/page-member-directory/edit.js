import ServerSideRender from '@wordpress/server-side-render';
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps( {
		className:
			'cherrystone-page-template cherrystone-page-member-directory-template',
	} );

	return (
		<div { ...blockProps }>
			<ServerSideRender block="cherrystone/page-member-directory" />
		</div>
	);
}
