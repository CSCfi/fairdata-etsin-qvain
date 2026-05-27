import { BrowserRouter } from 'react-router'
import { render, screen } from '@testing-library/react'
import { runInAction } from 'mobx'
import { ThemeProvider } from 'styled-components'

import EtsinHeader from '@/components/header'
import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'

const renderHeader = app => {
  const stores = buildStores()
  runInAction(() => {
    stores.Env.app = app
  })

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

describe('Etsin header LUMI AIF logo', () => {
  it('shows LUMI AIF logo when app is lumi-aif.etsin', () => {
    renderHeader('lumi-aif.etsin')

    expect(screen.getByAltText('LUMI AIF logo')).toBeInTheDocument()
    expect(screen.getByText('Dataset-as-a-Service')).toBeInTheDocument()
    expect(screen.getByAltText('LUMI AIF logo')).toHaveAttribute(
      'src',
      expect.stringContaining('LAIF_horizontal_logo_dark.png')
    )
    expect(screen.getByRole('link', { name: /LUMI AIF logo/ })).toHaveAttribute(
      'href',
      '/'
    )
  })

  it('does not show LUMI AIF logo when app is etsin', () => {
    renderHeader('etsin')

    expect(screen.queryByAltText('LUMI AIF logo')).not.toBeInTheDocument()
  })
})
