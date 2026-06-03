/**
 * Custom webpack config for Cherrystone Blocks.
 *
 * This plugin builds with @wordpress/scripts (webpack under the hood), not
 * Vite, so the upstream `vite-plugin-glsl` does not apply here. Instead we
 * extend the default wp-scripts config and teach webpack to import shader
 * sources (.glsl/.vert/.frag/.vs/.fs) as raw string modules via webpack's
 * native `asset/source` type. That gives the same ergonomic as
 * vite-plugin-glsl for basic imports:
 *
 *     import fragmentShader from './waves.frag';   // -> string
 *
 * Note: `asset/source` returns the file verbatim. It does NOT resolve GLSL
 * `#include` directives or chunk de-duplication. If we later need includes,
 * add `glslify-loader` + `raw-loader` and swap the rule below.
 *
 * The wp-scripts default config already externalizes react/react-dom to the
 * WordPress editor runtime, so shaders imported into editor (edit.js) bundles
 * just work. Front-end shader usage would belong to a future, separately
 * enqueued view bundle (see project notes on the vanilla-JS front end).
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.(glsl|vert|frag|vs|fs)$/,
				type: 'asset/source',
			},
		],
	},
};
