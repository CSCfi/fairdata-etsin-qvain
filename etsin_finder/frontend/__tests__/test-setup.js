import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { registerHelpers } from './test-helpers'
import chai from 'chai'
import chaiJestMocks from 'chai-jest-mocks'
import 'chai/register-should'

import '../js/utils/extendYup'

chai.use(chaiJestMocks)

configure({
  adapter: new Adapter(),
})

global.jestExpect = global.expect
global.chaiExpect = chai.expect
global.setExpect = framework => {
  global.expect = global[`${framework}Expect`]
}

global.Promise = require('bluebird')
Promise.config({
  cancellation: true,
})

registerHelpers()
