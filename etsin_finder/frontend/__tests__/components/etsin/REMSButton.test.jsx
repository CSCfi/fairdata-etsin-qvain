import { ThemeProvider } from 'styled-components'
import { StoresProvider } from '@/stores/stores'
import etsinTheme from '@/styles/theme'

import REMSButton from '@/components/etsin/Dataset/AskForAccess/REMSButton'
import { render, screen } from '@testing-library/react'

const getStores = () => ({
  Locale: { translate: v => v },
  Auth: { userLogged: true },
  Etsin: {
    EtsinDataset: { isRemoved: false, isDraft: false, isDeprecated: false },
  },
})

const renderButton = (stores = getStores()) => {
  render(
    <ThemeProvider theme={etsinTheme}>
      <StoresProvider store={stores}>
        <REMSButton />
      </StoresProvider>
    </ThemeProvider>
  )
  return screen.getByRole('button')
}

describe('REMSButton', () => {
  it('should be active', () => {
    const button = renderButton()
    expect(button.hasAttribute('disabled')).toBe(false)
  })

  it('should be disabled for draft dataset', () => {
    const stores = getStores()
    stores.Etsin.EtsinDataset.isDraft = true
    const button = renderButton(stores)
    expect(button.hasAttribute('disabled')).toBe(true)
  })

  it('should be disabled for deprecated dataset', () => {
    const stores = getStores()
    stores.Etsin.EtsinDataset.isDeprecated = true
    const button = renderButton(stores)
    expect(button.hasAttribute('disabled')).toBe(true)
  })

  it('should be disabled for removed dataset', () => {
    const stores = getStores()
    stores.Etsin.EtsinDataset.isRemoved = true
    const button = renderButton(stores)
    expect(button.hasAttribute('disabled')).toBe(true)
  })
})
