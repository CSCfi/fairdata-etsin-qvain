// Helper extensions for enzyme and jest

import { ReactWrapper, ShallowWrapper } from 'enzyme'
import { roleElements, elementRoles } from 'aria-query'

import { toHaveNoViolations } from 'jest-axe'
export { contextRenderer } from './contextRenderer'

const checkSingleHostNode = (wrapper, funcname) => {
  const nodes = wrapper.hostNodes()
  if (nodes.length != 1 || nodes.length != wrapper.length) {
    throw new Error(
      `Method "${funcname}" is meant to run on 1 host node. Found ${wrapper.length} total nodes, ${nodes.length} host nodes.`
    )
  }
  const node = nodes.first()
  return node
}

function getRoles() {
  // Return explicit and implicit roles for DOM node
  const node = checkSingleHostNode(this, 'getRoles')
  return elementRoles.get({ name: node.name() }) || []
}

function hasRole(role) {
  // Return true if DOM node has role, either explicit or implicit
  checkSingleHostNode(this, 'hasRole')
  return this.getRoles().includes(role)
}

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

export const wait = async cond => {
  // Keep advancing timers, resolving promises and
  // updating wrapper until condition is fulfilled.
  let counter = 0
  while (!cond()) {
    counter += 1
    if (counter > 100) {
      throw new Error('Wait timed out')
    }
    jest.advanceTimersByTime(1000)
    await Promise.resolve()
    self.update()
  }
}

export const registerHelpers = () => {
  ShallowWrapper.prototype.getRoles = getRoles
  ReactWrapper.prototype.getRoles = getRoles
  ShallowWrapper.prototype.hasRole = hasRole
  ReactWrapper.prototype.hasRole = hasRole
  ShallowWrapper.prototype.findByRole = findByRole
  ReactWrapper.prototype.findByRole = findByRole
  ShallowWrapper.prototype.leafHostNodes = leafHostNodes
  ReactWrapper.prototype.leafHostNodes = leafHostNodes
  ShallowWrapper.prototype.wait = wait
  ReactWrapper.prototype.wait = wait
  global.jestExpect.extend({ toBeAccessible })
}

export const failTestsWhenTranslationIsMissing = Locale => {
  // Call at top level to add missing translations check to all tests.
  // Returns handler that should be used on a Locale store instance
  // to actually detect missing translations. When using the same Locale
  // instance for the entire test suite, you can also provide it
  // as an argument for this function.

  const missingTranslations = []
  afterEach(() => {
    expect().noMissingTranslations()
    missingTranslations.length = 0
  })

  global.jestExpect.extend({
    noMissingTranslations(args) {
      if (missingTranslations.length === 0) {
        return {
          pass: true,
          message: () => 'Expected missing translations, none found',
        }
      }
      return {
        pass: false,
        message: () => `Found missing translations:\n ${missingTranslations.join('\n')}`,
      }
    },
  })

  // Return handler that modifies Locale store instance
  const registerMissingHandler = Locale => {
    Locale.setMissingTranslationHandler(function (key) {
      missingTranslations.push(key)
    })
  }
  if (Locale) {
    registerMissingHandler(Locale)
  }

  return registerMissingHandler
}
