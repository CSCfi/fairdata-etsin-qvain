import React from 'react'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { render, screen } from '@testing-library/react'

import etsinTheme from '../../../../js/styles/theme'
import { buildStores } from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import EtsinHeader from '../../../../js/components/header'
import { failTestsWhenTranslationIsMissing } from '../../../test-helpers'

const stores = buildStores()
failTestsWhenTranslationIsMissing(stores.Locale)

describe('Etsin header', () => {

  const renderHeader =  async () => {
    render(
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
  }

  it('should be accessible', async () => {
    await renderHeader()
    const results = await axe(screen.getByRole("banner"))
    expect(results).toBeAccessible()
  })
})
