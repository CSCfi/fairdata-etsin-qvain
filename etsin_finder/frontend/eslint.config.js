import { defineConfig } from 'eslint/config'
import globals from 'globals'
import eslintJS from '@eslint/js'
import prettierConfig from 'eslint-config-prettier/flat'
import babelParser from '@babel/eslint-parser'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import babelPlugin from '@babel/eslint-plugin'
import importPlugin from 'eslint-plugin-import'

// Old version of globals (which some babel stuff still depends on) has a bug
// where `browsers.AudioWorkletGlobalScope ` has an extra space which causes
// eslint to throw an error on config load.
// This workaround can probably be deleted after
// globals@11.12.0 dependency is gone, check with `npm ls globals`.
const browserGlobals = { ...globals.browser }
delete browserGlobals['AudioWorkletGlobalScope ']

// Globals exported by vitest
const vitestGlobals = {
  vitest: 'readonly',
  vi: 'readonly',
  suite: 'readonly',
  test: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  chai: 'readonly',
  expect: 'readonly',
  assert: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  onTestFailed: 'readonly',
  onTestFinished: 'readonly',
}

export default defineConfig([
  eslintJS.configs.recommended,
  jsxA11yPlugin.flatConfigs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  prettierConfig,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      'react-hooks': reactHooksPlugin,
      '@babel': babelPlugin,
    },

    languageOptions: {
      ecmaVersion: 'latest',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: [
            ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
            ['@babel/plugin-transform-runtime'],
            ['@babel/plugin-transform-class-properties'],
          ],
          presets: ['@babel/preset-react'],
        },
      },
      globals: {
        ...browserGlobals,
        ...globals.node,
        ...globals.es6,
        ...vitestGlobals,
        BUILD: 'readonly',
      },
    },
    rules: {
      'arrow-parens': 0,
      'class-methods-use-this': 0,
      'comma-dangle': 0,
      'function-paren-newline': 0,
      'implicit-arrow-linebreak': 0,
      'import/extensions': 0,
      'import/first': 0,
      'import/no-extraneous-dependencies': 0,
      'import/no-unresolved': 0,
      'import/no-named-as-default': 'off',
      'import/prefer-default-export': 0,
      indent: 0,
      'max-len': ['warn', { code: 150 }],
      'max-classes-per-file': 'off',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'no-console': 0,
      'no-extra-semi': 1,
      'no-lone-blocks': 0,
      'no-param-reassign': ['error', { props: false }],
      'no-restricted-syntax': ['warn', "BinaryExpression[operator='of']"],
      'no-underscore-dangle': [0],
      'no-use-before-define': 0,
      // Usually `this` should be an error when used outside of classes-like objects
      'no-invalid-this': 2,
      'object-curly-newline': 0,
      'one-var-declaration-per-line': 0,
      'one-var': 0,
      'operator-linebreak': 0,
      'prefer-destructuring': 0,
      'react/destructuring-assignment': 0,
      'react/forbid-prop-types': [2, { forbid: ['any'] }],
      'react/jsx-curly-newline': 'off',
      'react/jsx-curly-brace-presence': 0,
      'react/jsx-one-expression-per-line': 0,
      'react/prefer-stateless-function': 0,
      'react/prop-types': 2,
      'react/jsx-props-no-spreading': 'off',
      'react/static-property-placement': 'off',
      'react/state-in-constructor': 'off',
      'react/require-default-props': 'off', // defaultProps deprecated
      semi: 0,
      'template-curly-spacing': 0,
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['to', 'hrefLeft', 'hrefRight'],
          aspects: ['noHref', 'invalidHref', 'preferButton'],
        },
      ],
      'jsx-a11y/label-has-associated-control': [
        2,
        {
          components: ['Label'],
        },
      ],
      'jsx-a11y/no-autofocus': 'off',
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    },
    ignores: ['static/**'],
  },
  {
    // eslint configuration specific for tests
    ...testingLibraryPlugin.configs['flat/react'],
    files: ['**/__tests__/**/*.[jt]s?(x)'],
    rules: {
      ...testingLibraryPlugin.configs['flat/react'].rules,
      // Allow e.g. selecting a section based on a heading it contains
      // See https://stackoverflow.com/questions/62770973/parent-node-in-react-testing-library
      'testing-library/no-node-access': 0,
      // Rule disallowing `wrapper = render(...)` style assignments is too sensitive
      // and matches all assignments that contain `render` e.g. `thing = thingThatWasRendered`
      'testing-library/render-result-naming-convention': 0,
      camelcase: 0,
      // Our tests allow disabling auto cleanup (globalThis.autoCleanup = false)
      // so this rule is too strict
      'testing-library/no-manual-cleanup': 0,
    },
  },
])
