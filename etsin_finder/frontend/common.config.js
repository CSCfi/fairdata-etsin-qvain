import { defineRolldownBabelPreset } from '@rolldown/plugin-babel'

// Common vite, vitest config

export function decoratorPreset(options) {
  return defineRolldownBabelPreset({
    preset: () => ({
      plugins: [
        ['@babel/plugin-proposal-decorators', options],
      ],
    }),
    rolldown: {
      // Only run this transform if the file contains a decorator.
      filter: {
        code: '@',
      },
    },
  })
}
