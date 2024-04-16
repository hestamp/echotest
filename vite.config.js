import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    visualizer({
      // Add the visualizer plugin
      filename: './dist/stats.html', // Output file for the size map
      title: 'Vite Bundle Analyzer', // Title of the generated report
    }),
  ],
  resolve: {
    // eslint-disable-next-line no-undef
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: [
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-switch',
            'dayjs',
            'react-calendar',
            'react-glider',
            'react-hot-toast',
            'react-icons',
            'react-sidebar',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    brotliSize: false,
    assetsInlineLimit: 10000,
    assets: {
      inlineAssetLimit: 5000,
      include: ['**/*.svg'],
      exclude: ['**/*.inline.svg'],
      plugins: [
        {
          name: 'imagemin-svgo',
          async transform(code, id) {
            if (id.endsWith('.svg')) {
              const { optimize } = await import('svgo')
              const result = await optimize(code, {
                plugins: [
                  {
                    name: 'preset-default',
                    params: { overrides: { removeViewBox: false } },
                  },
                  { name: 'removeXMLNS' },
                ],
              })
              return { code: result.data }
            }
          },
        },
      ],
    },
  },
})
