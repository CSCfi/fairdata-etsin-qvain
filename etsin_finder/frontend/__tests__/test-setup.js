import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import chaiJestMocks from 'chai-jest-mocks'
import 'chai/register-should'

import extendYup from '../js/utils/extendYup'

extendYup()

chai.use(chaiEnzyme)
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
