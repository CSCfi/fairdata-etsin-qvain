import '@testing-library/react/dont-cleanup-after-each' // disable automatic cleanup
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'

import { registerHelpers } from './test-helpers'
import chai from 'chai'
import chaiJestMocks from 'chai-jest-mocks'
chai.should() // register .should to Object.prototype

// isMockFunction is no longer in 'jest-mock' in jest 27 but chai-jest-mocks requires it
import * as jestMock from 'jest-mock'
// eslint-disable-next-line no-import-assign
jestMock.isMockFunction = jest.isMockFunction

import '../js/utils/extendYup'
import '../js/utils/extendPromise'

jest.mock('../js/components/etsin/Dataset/Sidebar/special/importImages', () => {
  return () => ({}) // mock image import as require.context is not available in tests
})

chai.use(chaiJestMocks)

// Allow disabling RTL autocleanup per test file
global.autoCleanup = true
afterEach(() => {
  if (global.autoCleanup) {
    cleanup()
  }
})

global.jestExpect = global.expect
global.chaiExpect = chai.expect
global.setExpect = framework => {
  global.expect = global[`${framework}Expect`]
}

registerHelpers()
