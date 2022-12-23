import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { registerHelpers } from './test-helpers'
import chai from 'chai'
import chaiJestMocks from 'chai-jest-mocks'
chai.should() // register .should to Object.prototype

// isMockFunction is no longer in 'jest-mock' in jest 27 but chai-jest-mocks requires it
import * as jestMock from 'jest-mock'
jestMock.isMockFunction = jest.isMockFunction

// uuid library needs crypto.getRandomValues which is not available in jest by default
import { randomFillSync } from 'crypto'
global.crypto = {
  getRandomValues: buffer => randomFillSync(buffer),
}

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
