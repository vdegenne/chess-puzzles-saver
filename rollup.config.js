import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'

export default {
	input: './src/app.ts',
	output: { file: 'app.js', format: 'iife' },
	plugins: [typescript(), nodeResolve()],
	watch: {
		chokidar: false
	}
}