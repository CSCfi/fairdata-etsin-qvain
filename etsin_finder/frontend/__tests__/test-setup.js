import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import chaiJestMocks from 'chai-jest-mocks'
import 'chai/register-should'

chai.use(chaiEnzyme)
chai.use(chaiJestMocks)

configure({
  adapter: new Adapter(),
})
