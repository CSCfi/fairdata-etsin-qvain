import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { contextRenderer } from '@/../__tests__/test-helpers'
import License from '@/components/qvain/sections/DataOrigin/general/AccessRights/License'
import { buildStores } from '@/stores'
import { useStores } from '@/stores/stores'
import { LICENSE_URL } from '@/utils/constants'

jest.mock('@/stores/stores', () => {
  const mockUseStores = jest.fn()
  return {
    ...jest.requireActual('@/stores/stores'),
    useStores: mockUseStores,
  }
})

jest.mock('react', () => {
  const original = jest.requireActual('react')
  return {
    ...original,
    useState: jest.fn(original.useState),
  }
})

jest.mock('axios', () => ({
  get: jest.fn().mockReturnValue(Promise.resolve({ data: { hits: { hits: [] } } })),
}))

describe('Qvain.License', () => {
  let stores

  const getRenderedLicenseUrls = () => {
    const inputs = Array.from(document.querySelectorAll('input[type="hidden"]'))
    return inputs.map(v => v.value)
  }

  beforeEach(() => {
    stores = buildStores()
    stores.Qvain.resetQvainStore()
    useStores.mockReturnValue(stores)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render default license', () => {
    contextRenderer(<License />, { stores })
    expect(getRenderedLicenseUrls()).toEqual([LICENSE_URL.CCBY4])
  })

  it('should render one added license, Other (URL)', () => {
    const { set: setLicenseArray, Model: LicenseConstructor } = stores.Qvain.Licenses
    setLicenseArray([
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'https://test.url'),
    ])
    contextRenderer(<License />, { stores })
    expect(getRenderedLicenseUrls()).toEqual(['https://test.url'])
  })

  it('should render one added license, CCBY4', () => {
    const { set: setLicenseArray, Model: LicenseConstructor } = stores.Qvain.Licenses
    setLicenseArray([])
    setLicenseArray([
      LicenseConstructor(
        { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
        LICENSE_URL.CCBY4
      ),
    ])
    contextRenderer(<License />, { stores })
    expect(getRenderedLicenseUrls()).toEqual([LICENSE_URL.CCBY4])
  })

  it('should render three added licenses, Other (URL) x 2 + CCBY4', () => {
    const { set: setLicenseArray, Model: LicenseConstructor } = stores.Qvain.Licenses
    setLicenseArray([
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'https://test.url'),
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'https://test2.url'),
      LicenseConstructor(
        { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
        LICENSE_URL.CCBY4
      ),
    ])
    contextRenderer(<License />, { stores })
    expect(getRenderedLicenseUrls()).toEqual([
      'https://test.url',
      'https://test2.url',
      LICENSE_URL.CCBY4,
    ])
  })

  it('should render four licenses where two have errors', async () => {
    const { Licenses } = stores.Qvain
    Licenses.set([
      Licenses.Model(
        { en: 'Creative Commons Attribution 4.0 International (CC BY 4.0)' },
        LICENSE_URL.CCBY4
      ),
      Licenses.CustomLicenseModel({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'httpöötest.url'),
      Licenses.CustomLicenseModel({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'http://ok.url'),
      Licenses.CustomLicenseModel({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'httppp:/fail.url'),
    ])
    contextRenderer(<License />, { stores })

    // Trigger blur event to validate licenses
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(document.body)

    expect(getRenderedLicenseUrls()).toEqual([
      LICENSE_URL.CCBY4,
      'custom:httpöötest.url',
      'custom:http://ok.url',
      'custom:httppp:/fail.url',
    ])
    const errors = screen.getByTestId('license-errors')
    const labels = Array.from(errors.querySelectorAll('span')).map(e => e.textContent)
    expect(labels).toEqual(['httpöötest.url:', 'httppp:/fail.url:'])
  })

  it('should render invalid url error', async () => {
    const { Licenses } = stores.Qvain
    Licenses.set([
      Licenses.CustomLicenseModel({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'httpöötest.url'),
    ])
    contextRenderer(<License />, { stores })

    // Trigger blur event to validate licenses
    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(document.body)

    const errors = screen.getByTestId('license-errors')
    expect(errors.textContent).toContain(
      stores.Locale.translate('qvain.validationMessages.license.otherUrl.url')
    )
  })
})
