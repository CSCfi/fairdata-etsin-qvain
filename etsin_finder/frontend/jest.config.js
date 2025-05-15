module.exports = {
  testEnvironment: './__tests__/timezonedJSDOMEnvironment.js',
  setupFilesAfterEnv: ['./__tests__/test-setup.js'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/imageMock.js',
    '@/(.*)$': '<rootDir>/js/$1',
    'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
    'remark-gfm': '<rootDir>/__mocks__/remarkPluginMock.js',
    'react-leaflet': '<rootDir>/__mocks__/reactLeafletMock.jsx',
  },
  testPathIgnorePatterns: [
    './__tests__/test-setup.js',
    './__tests__/test-helpers',
    './__tests__/timezonedJSDOMEnvironment.js',
    './__tests__/timezonedNodeEnvironment.js',
    './__tests__/__testdata__',
  ],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  globals: {
    BUILD: 'test',
  },
}
