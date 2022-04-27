// Helper extensions for enzyme and jest

import { ReactWrapper, ShallowWrapper } from 'enzyme'
import { roleElements } from 'aria-query'

import './test-helpers'
import 'chai/register-should'
import { toHaveNoViolations } from 'jest-axe'

import '../js/utils/extendYup'

function findByRole(role) {
  // Return DOM nodes that have a specific role, either explicitly or implicitly
  const elementTestFns = {}
  const elements = roleElements.get(role) || []
  elements.forEach(element => {
    elementTestFns[element.name] = props => {
      const requiredAttributes = element.attributes || []
      return requiredAttributes.every(attr => props[attr.name].toLowerCase() == attr.value)
    }
  })
  return this.findWhere(
    w => w.prop('role') === role || elementTestFns[w.name()]?.(w.props())
  ).hostNodes()
}

function leafHostNodes() {
  // Return DOM nodes that have no children or only 1 child containing text.
  return this.findWhere(v => {
    const children = v.children()
    if (children.length === 0) {
      return true
    }
    // wrapper.type() is undefined for text
    if (children.length === 1 && children.type() === undefined) {
      return true
    }
    return false
  }).hostNodes()
}

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

export const registerHelpers = () => {
  ShallowWrapper.prototype.findByRole = findByRole
  ReactWrapper.prototype.findByRole = findByRole
  ShallowWrapper.prototype.leafHostNodes = leafHostNodes
  ReactWrapper.prototype.leafHostNodes = leafHostNodes
  global.jestExpect.extend({ toBeAccessible })
}
