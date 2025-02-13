import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import {configure} from 'mobx'

import etsinTheme from '../../../../js/styles/theme'
import {buildStores} from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import LandingPage from '../../../../js/components/qvain/views/landingPage/index.jsx'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'


const registerMissingTranslationHandler = failTestsWhenTranslationIsMissing()

describe('Qvain landing page', () => {
  let wrapper
  let stores

  beforeAll(async () => {
    configure({ safeDescriptors: false })
    stores = buildStores()
    registerMissingTranslationHandler(stores.Locale)
    configure({ safeDescriptors: true })
    stores.Accessibility.handleNavigation = jest.fn()

    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <LandingPage />
            </main>
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>
    )
  })

  afterAll(() => {
    jest.resetAllMocks()
    wrapper?.unmount?.()
  })

  it('should be accessible', async () => {
    const results = await axe(wrapper.getDOMNode())
    expect(results).toBeAccessible()
  })

  it('should call Accessibility.handleNavigation', async () => {
    expect(stores.Accessibility.handleNavigation.mock.calls).toEqual([[]])
  })
})
