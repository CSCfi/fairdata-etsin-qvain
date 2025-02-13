import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { axe } from 'jest-axe'

import etsinTheme from '../../../../js/styles/theme'
import { buildStores } from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import EtsinHeader from '../../../../js/components/header'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

const stores = buildStores()
failTestsWhenTranslationIsMissing(stores.Locale)

describe('Etsin header', () => {
  let wrapper

  beforeAll(async () => {
    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <header>
              <EtsinHeader />
            </header>
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
})
