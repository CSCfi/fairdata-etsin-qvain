import React from 'react'
import { ThemeProvider } from 'styled-components'
import translate from 'counterpart'

import { screen, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import '../../../locale/translations'
import etsinTheme from '@/styles/theme'
import License from '@/components/etsin/Dataset/Sidebar/special/license'
import { LICENSE_URL } from '@/utils/constants'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'

const otherLicense = {
  title: { en: 'Other' },
  url: LICENSE_URL.OTHER,
}

const licenseWithDescription = {
  title: { en: 'Some license' },
  description: { en: 'This is some license' },
  custom_url: 'https://example.com/license_access_url',
  url: 'https://example.com/license',
}

const licenseWithoutDescription = {
  title: { en: 'Another license' },
  custom_url: 'https://example.com/license_access_url',
  url: 'https://example.com/license',
}

const customLicense = {
  custom_url: 'https://example.com/license',
}

describe('License', () => {
  const renderLicense = async licenseData => {
    const stores = buildStores()
    render(
      <ThemeProvider theme={etsinTheme}>
        <StoresProvider store={stores}>
          <License license={licenseData} />
        </StoresProvider>
      </ThemeProvider>
    )
  }

  const openPopUp = async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Additional information' }))
    return screen.getByRole('dialog')
  }

  it('shows info text for "Other" license', async () => {
    renderLicense(otherLicense)
    expect(screen.getByText('Additional information')).toBeInTheDocument()

    const dialog = await openPopUp()
    expect(within(dialog).getByText(translate('dataset.otherLicense'))).toBeInTheDocument()
  })

  it('shows popup for license with description', async () => {
    renderLicense(licenseWithDescription)
    expect(screen.getByText('https://example.com/license_access_url')).toBeInTheDocument()
    expect(screen.getByText('Additional information')).toBeInTheDocument()

    const dialog = await openPopUp()
    expect(within(dialog).getByText('https://example.com/license_access_url')).toBeInTheDocument()
    expect(within(dialog).getByText('This is some license')).toBeInTheDocument()
    expect(within(dialog).getByText('https://example.com/license_access_url')).toBeInTheDocument()
  })

  it('does not show popup for license without description', async () => {
    renderLicense(licenseWithoutDescription)
    expect(screen.getByText('https://example.com/license_access_url')).toBeInTheDocument()
    expect(screen.queryByText('Additional information')).not.toBeInTheDocument()
  })

  it('shows custom license', async () => {
    renderLicense(customLicense)
    expect(screen.getByText('https://example.com/license')).toBeInTheDocument()
    expect(screen.queryByText('Additional information')).not.toBeInTheDocument()
  })
})
