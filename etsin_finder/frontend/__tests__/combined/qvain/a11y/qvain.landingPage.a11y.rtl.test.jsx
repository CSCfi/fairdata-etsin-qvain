import { axe } from 'jest-axe'
import { configure } from 'mobx'
import { screen } from '@testing-library/react'

import { buildStores } from '@/stores/index.js'
import LandingPage from '@/components/qvain/views/landingPage/index.jsx'
import { failTestsWhenTranslationIsMissing, contextRenderer } from '@/../__tests__/test-helpers'

const registerMissingTranslationHandler = failTestsWhenTranslationIsMissing()

describe('Qvain landing page', () => {
  let stores

  const renderPage = async () => {
    configure({ safeDescriptors: false })
    stores = buildStores()
    registerMissingTranslationHandler(stores.Locale)
    configure({ safeDescriptors: true })
    stores.Accessibility.handleNavigation = jest.fn()

    contextRenderer(
      <main>
        <LandingPage />
      </main>,
      { stores }
    )
  }

  it('should be accessible', async () => {
    await renderPage()
    const results = await axe(screen.getByRole('main'))
    expect(results).toBeAccessible()
    expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([[]])
  })
})
