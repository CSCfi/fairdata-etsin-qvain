import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import etsinTheme from '@/styles/theme'

import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import TabsStore from '@/stores/view/tabs'
import Tabs from '@/components/qvain/views/datasetsV2/tabs'

let stores

beforeEach(() => {
  stores = buildStores()
  stores.Locale.setMissingTranslationHandler(key => key)
  stores.QvainDatasets.tabs = new TabsStore(
    { all: 'test.tabs.all', another: 'test.tabs.another' },
    'all'
  )
})

describe('Datasets Tabs', () => {
  const renderTabs = () => {
    render(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <Tabs />
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>
    )
  }

  const findTabWithText = text => screen.getByRole('tab', { name: text })

  it('should initially show default tab', async () => {
    renderTabs()
    expect(findTabWithText('test.tabs.all').getAttribute('aria-selected')).toBe('true')
    expect(findTabWithText('test.tabs.another').getAttribute('aria-selected')).toBe('false')
  })

  it('should change tab', async () => {
    renderTabs()
    await userEvent.click(findTabWithText('test.tabs.another'))
    expect(findTabWithText('test.tabs.another').getAttribute('aria-selected')).toBe('true')
    expect(findTabWithText('test.tabs.all').getAttribute('aria-selected')).toBe('false')
  })
})
