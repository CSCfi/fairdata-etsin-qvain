import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from 'vite-plugin-environment'
import path from 'path'

// Vite config that builds the JS code but not the index.html page.
// Build produces ./build/.vite/manifest.json that the backend
// uses to determine script files to import when rendering
// the index.html template.
// https://vite.dev/guide/backend-integration.html
//
// Any files in ./static are copied to ./build.

export default defineConfig(({ command, mode }) => {
  const isProd = mode == 'production'
  const isDev = mode == 'development'
  const isServing = command == 'serve'

  return {
    esbuild: {
      target: 'es2022',
    },
    build: {
      outDir: 'build',
      assetsDir: 'assets',
      manifest: true, // generate .vite/manifest.json in outDir
      rollupOptions: {
        input: '/js/index.jsx', // overwrite default .html entry
      },
      // Avoid minifying code when in development build
      minify: !isDev,
      terserOptions: {
        minify: !isDev,
        mangle: !isDev,
      },
    },
    // When serving, run development server in /vite/ endpoint.
    // Serve built files from /build/.
    base: isServing ? '/vite/' : '/build/',
    publicDir: 'static',
    plugins: [
      EnvironmentPlugin({
        BUILD: mode,
      }),
      react({
        babel: {
          plugins: [
            ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
            ['@babel/plugin-transform-runtime'],
            [
              'babel-plugin-styled-components',
              {
                // Minify styled components in prod
                displayName: !isProd,
                minify: isProd,
                transpileTemplateLiterals: isProd,
              },
            ],
          ],
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                targets: '> 0.25%, not dead',
                // needed by legacy decorators
                include: ['@babel/plugin-transform-class-properties'],
              },
            ],
          ],
        },
      }),
    ],
    server: {
      port: 8080,
      host: '0.0.0.0',
      allowedHosts: ['etsin.fd-dev.csc.fi', 'qvain.fd-dev.csc.fi'],
      hmr: {
        webSocketServer: 'ws',
        clientPort: 443,
        port: 8080, // WS server listens to :8080
        path: '/ws', // Socket is served at /vite/ws
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './js'),
      },
    },
  }
})
