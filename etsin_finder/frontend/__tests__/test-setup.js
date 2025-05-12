import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom'

import { registerHelpers } from './test-helpers'
import chai from 'chai'
import chaiJestMocks from 'chai-jest-mocks'
chai.should() // register .should to Object.prototype

// isMockFunction is no longer in 'jest-mock' in jest 27 but chai-jest-mocks requires it
import * as jestMock from 'jest-mock'
jestMock.isMockFunction = jest.isMockFunction

import '../js/utils/extendYup'
import '../js/utils/extendPromise'

chai.use(chaiJestMocks)

configure({
  adapter: new Adapter(),
})

global.jestExpect = global.expect
global.chaiExpect = chai.expect
global.setExpect = framework => {
  global.expect = global[`${framework}Expect`]
}

registerHelpers()
