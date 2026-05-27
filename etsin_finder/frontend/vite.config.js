import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from 'vite-plugin-environment'
import path from 'path'

import { decoratorPreset } from './common.config'

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
    oxc: {
      target: 'es2022',
      plugins: {
        styledComponents: {
          displayName: true,
          ssr: false,
          fileName: true,
          minify: !isDev,
        },
      },
    },
    build: {
      outDir: 'build',
      assetsDir: 'assets',
      manifest: true, // generate .vite/manifest.json in outDir
      rollupOptions: {
        input: '/js/index.jsx', // overwrite default .html entry
      },
      // Avoid minifying code when in development build
      minify: isDev ? false : 'terser',
      terserOptions: {
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
      react(),
      babel({
        presets: [decoratorPreset({ version: 'legacy' })],
      }),
    ],
    server: {
      port: 8080,
      host: '0.0.0.0',
      allowedHosts: ['.fd-dev.csc.fi'],
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
