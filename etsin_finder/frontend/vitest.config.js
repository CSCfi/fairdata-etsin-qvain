import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import path from 'path'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from 'vite-plugin-environment'

export default defineConfig(({ mode }) => {
  // Create .env file to set env variables
  // VITEST_WORKERS: number of test workers
  // VITEST_POOL:    pool used for tests. 'vmThreads' can be much faster than the default 'forks'
  //                 but has some downsides https://vitest.dev/config/#vmthreads
  const vitestEnv = loadEnv(mode, process.cwd(), ['VITEST_'])
  let workers, pool
  if (vitestEnv.VITEST_WORKERS) {
    workers = { minWorkers: vitestEnv.VITEST_WORKERS, maxWorkers: vitestEnv.VITEST_WORKERS }
  }
  if (vitestEnv.VITEST_POOL) {
    pool = { pool: vitestEnv.VITEST_POOL }
  }

  return {
    test: {
      ...workers,
      ...pool,
      root: './__tests__/',
      // Use happy-dom for faster test rendering.
      // Has small differences compared to jsdom in some very specific cases.
      environment: 'happy-dom',
      setupFiles: ['./__tests__/test-setup.js'],
      globals: true, // enable 'test', 'it', 'expect' etc.
    },
    plugins: [
      EnvironmentPlugin({
        BUILD: mode, // should be "test" by default when running tests
      }),
      react({
        babel: {
          plugins: [
            ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
            ['@babel/plugin-transform-runtime'],
            ['@babel/plugin-transform-class-properties'],
          ],
        },
      }),
    ],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './js') },
        { find: '@helpers', replacement: path.resolve(__dirname, './__tests__/test-helpers') },
        {
          find: /^@helpers\/(.*)$/,
          replacement: path.resolve(__dirname, './__tests__/test-helpers/$1'),
        },
        {
          find: /@testdata\/(.*)$/,
          replacement: path.resolve(__dirname, './__tests__/__testdata__/$1'),
        },
      ],
    },
  }
})
