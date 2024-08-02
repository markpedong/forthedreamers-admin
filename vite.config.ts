import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import sassDts from 'vite-plugin-sass-dts'
import tsConfigPaths from 'vite-tsconfig-paths'
import packageJson from './package.json'

// https://vitejs.dev/config
export default defineConfig({
	base: '/',
	server: {
		port: 6602
	},
	define: {
		'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
		// 'import.meta.env.DOMAIN': process.env.VITE_DOMAIN
	},
	plugins: [react(), sassDts(), tsConfigPaths()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
})
