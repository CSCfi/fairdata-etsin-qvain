import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import chai from 'chai'
import chaiJestMocks from 'chai-jest-mocks'
import 'chai/register-should'
import { toHaveNoViolations } from 'jest-axe'

import '../js/utils/extendYup'

chai.use(chaiJestMocks)

configure({
  adapter: new Adapter(),
})

global.jestExpect = global.expect
global.chaiExpect = chai.expect

const toBeAccessible = (results, options = { ignore: [] }) => {
  // Stricter accessibility check than the jest-axe default.
  // Counts "incomplete" issues as violations unless they
  // are explicitly ignored.
  //
  // Usage example:
  //   const wrapper = mount(<Component>)
  //   const results = await axe(wrapper.getDOMNode())
  //   expect(results).toBeAccessible({ ignore: ['id-of-ignored-issue'] })
  const skip = ['color-contrast', ...(options.ignore || [])] // color-contrast not supported in JSDOM
  const incomplete = results.incomplete.filter(issue => !skip.includes(issue.id))
  const strictResults = { ...results, violations: [...results.violations, ...incomplete] }
  return toHaveNoViolations.toHaveNoViolations(strictResults)
}
global.jestExpect.extend({ toBeAccessible })

global.setExpect = framework => {
  global.expect = global[`${framework}Expect`]
}

global.Promise = require('bluebird')
Promise.config({
  cancellation: true,
})
