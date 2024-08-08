import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
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
    'import.meta.env.DOMAIN': JSON.stringify(process.env.VITE_DOMAIN)
  },
  plugins: [
    react(),
    sassDts(),
    tsConfigPaths(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
      exclude: undefined,
      include: undefined,
      includePublic: true,
      logStats: true,
      ansiColors: true,
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false
              },
            }
          },
          'sortAttrs',
        ]
      },
      png: {
        quality: 100
      },
      jpeg: {
        quality: 100
      },
      jpg: {
        quality: 100
      },
      tiff: {
        quality: 100
      },
      gif: {},
      webp: {
        lossless: true
      },
      avif: {
        lossless: true
      },
      cache: false,
      cacheLocation: undefined
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
