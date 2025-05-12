import React from 'react'
import { shallow } from 'enzyme'
import { components } from 'react-select'
import CreatableSelect from 'react-select/creatable'

import etsinTheme from '@/styles/theme'
import { buildStores } from '@/stores'
import { useStores } from '@/stores/stores'
import {
  License,
  ErrorLabel,
} from '@/components/qvain/sections/DataOrigin/general/AccessRights/License'
import { LICENSE_URL } from '@/utils/constants'
import { ValidationError } from '@/components/qvain/general/errors/validationError'

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

  const getRenderedLicenseUrls = shallowLicenseComponent => {
    const selectedOptions = shallowLicenseComponent
      .findWhere(c => c.prop('component') === CreatableSelect)
      .dive()
      .dive()
      .dive()
      .dive()
      .find(components.MultiValue)

    return selectedOptions.map(
      opt => opt.prop('data').identifier || opt.prop('data').otherLicenseUrl
    )
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
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual([LICENSE_URL.CCBY4])
  })

  it('should render one added license, Other (URL)', () => {
    const { set: setLicenseArray, Model: LicenseConstructor } = stores.Qvain.Licenses
    setLicenseArray([
      LicenseConstructor({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'https://test.url'),
    ])
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual(['https://test.url'])
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
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual([LICENSE_URL.CCBY4])
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
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    expect(getRenderedLicenseUrls(component)).toEqual([
      'https://test.url',
      'https://test2.url',
      LICENSE_URL.CCBY4,
    ])
  })

  it('should render four licenses where two have errors', () => {
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
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    component.instance().validateLicenses()
    expect(getRenderedLicenseUrls(component)).toEqual([
      LICENSE_URL.CCBY4,
      'httpöötest.url',
      'http://ok.url',
      'httppp:/fail.url',
    ])
    const errorLabels = component.find(ErrorLabel).map(item => item.text())
    expect(errorLabels).toEqual(['httpöötest.url:', 'httppp:/fail.url:'])
  })

  it('should render invalid url error', () => {
    const { Licenses } = stores.Qvain
    Licenses.set([
      Licenses.CustomLicenseModel({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'httpöötest.url'),
    ])
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    component.instance().validateLicenses()
    const errors = component.find(ValidationError).map(item => item.children().text())
    expect(errors).toEqual(['qvain.validationMessages.license.otherUrl.url'])
  })
})
