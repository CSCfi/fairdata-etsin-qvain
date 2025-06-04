// Helper extensions for jest

import { toHaveNoViolations } from 'jest-axe'
export { contextRenderer } from './contextRenderer'
export * from './textNodes'

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
    noMissingTranslations() {
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
