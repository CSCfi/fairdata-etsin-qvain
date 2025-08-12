module.exports = {
  testEnvironment: './__tests__/timezonedJSDOMEnvironment.js',
  setupFilesAfterEnv: ['./__tests__/test-setup.js'],
  moduleNameMapper: {
    // empty mocks for image and css files not supported in tests
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/imageMock.js',
    // alias for the main js directory
    '@/(.*)$': '<rootDir>/js/$1',
    // @helpers and @testdata aliases only available for tests, see also __tests__/jsconfig.json
    '@helpers$': '<rootDir>/__tests__/test-helpers',
    '@helpers/(.*)$': '<rootDir>/__tests__/test-helpers/$1',
    '@testdata/(.*)$': '<rootDir>/__tests__/__testdata__/$1',
    // replacements for esm-only dependencies
    'remark-gfm': '<rootDir>/__mocks__/remarkPluginMock.js',
    'react-leaflet': '<rootDir>/__mocks__/reactLeafletMock.jsx',
    'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
  },
  testPathIgnorePatterns: [
    './__tests__/test-setup.js',
    './__tests__/ensureTextEncoder.js',
    './__tests__/test-helpers',
    './__tests__/timezonedJSDOMEnvironment.js',
    './__tests__/timezonedNodeEnvironment.js',
    './__tests__/__testdata__',
  ],
  testEnvironmentOptions: {
    url: 'http://localhost',
    globalsCleanup: 'on',
  },
  globals: {
    BUILD: 'test',
  },
}
