import Harness from '../../components/componentTestHarness'
import React, { useState } from 'react'
import { shallow } from 'enzyme'
import Translate from 'react-translate-component'
import { components } from 'react-select'
import CreatableSelect from 'react-select/creatable'

import etsinTheme from '../../../js/styles/theme'
import { buildStores } from '../../../js/stores'
import { useStores } from '../../../js/stores/stores'
import RightsAndLicenses from '../../../js/components/qvain/fields/licenses'
import LicensesComponent, { License } from '../../../js/components/qvain/fields/licenses/licenses'
import AccessTypeComponent, {
  AccessType,
} from '../../../js/components/qvain/fields/licenses/accessType'
import RestrictionGrounds from '../../../js/components/qvain/fields/licenses/restrictionGrounds'
import { ACCESS_TYPE_URL, LICENSE_URL } from '../../../js/utils/constants'
import { ValidationErrors } from '../../../js/components/qvain/general/errors/validationError'
import Tooltip from '../../../js/components/qvain/general/section/tooltip'
import { HelpIcon } from '../../../js/components/qvain/general/modal/form'
import Licenses from '../../../js/stores/view/qvain/qvain.license'
import LicensesInfo from '../../../js/components/qvain/fields/licenses/licensesInfo'

jest.mock('../../../js/stores/stores', () => {
  const mockUseStores = jest.fn()
  return {
    ...jest.requireActual('../../../js/stores/stores'),
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

describe('Qvain.RightsAndLicenses', () => {
  let stores

  const harness = new Harness(RightsAndLicenses)

  const getRenderedLicenseUrls = shallowLicenseComponent => {
    const selectedOptions = shallowLicenseComponent
      .findWhere(c => c.prop('component') === CreatableSelect)
      .dive()
      .dive()
      .dive()
      .dive()
      .find(components.MultiValue)
    return selectedOptions.map(opt => opt.prop('data').identifier)
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
      Licenses.Model({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'httpöötest.url'),
      Licenses.Model({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'http://ok.url'),
      Licenses.Model({ en: 'Other (URL)', fi: 'Muu (URL)' }, 'httppp:/fail.url'),
    ])
    const component = shallow(<License Stores={stores} theme={etsinTheme} />)
    component.instance().validateLicenses()
    expect(getRenderedLicenseUrls(component)).toEqual([
      LICENSE_URL.CCBY4,
      'httpöötest.url',
      'http://ok.url',
      'httppp:/fail.url',
    ])
    const errors = component
      .find(ValidationErrors)
      .dive()
      .find(Translate) // ValidationErrorItem
      .map(item => item.text())

    expect(errors.length).toBe(2)
    expect(errors[0].startsWith('httpöötest.url'))
    expect(errors[1].startsWith('httppp:/fail.url'))
  })

  it('should render <AccessType />', () => {
    const component = shallow(<AccessType Stores={stores} />)
    expect(component).toMatchSnapshot()
  })

  it('should render <RestrictionGrounds />', () => {
    const { set: setAccessType, Model: AccessTypeConstructor } = stores.Qvain.AccessType
    setAccessType(AccessTypeConstructor(undefined, ACCESS_TYPE_URL.EMBARGO))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(RestrictionGrounds).length).toBe(1)
  })

  it('should NOT render <RestrictionGrounds />', () => {
    const { set: setAccessType, Model: AccessTypeConstructor } = stores.Qvain.AccessType
    setAccessType(AccessTypeConstructor(undefined, ACCESS_TYPE_URL.OPEN))
    const component = shallow(<AccessType Stores={stores} />)
    expect(component.find(RestrictionGrounds).length).toBe(0)
  })

  describe('render', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expedted properties', () => {
      const children = [
        {
          label: 'Title',
          findType: 'prop',
          findArgs: ['content', 'qvain.rightsAndLicenses.title'],
        },
        {
          label: 'Tooltip',
          findArgs: Tooltip,
        },
        {
          label: 'Help',
          findArgs: HelpIcon,
        },
        {
          label: 'Licenses',
          findArgs: LicensesComponent,
        },
        {
          label: 'AccessType',
          findArgs: AccessTypeComponent,
        },
      ]

      const props = {
        Tooltip: {
          isOpen: false,
          align: 'Right',
          text: <LicensesInfo />,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })

    describe('given tootlipOpen: true, when Tooltip close', () => {
      const setTooltipOpen = jest.fn()
      let tooltipOpen = true

      beforeEach(() => {
        useState.mockImplementationOnce(() => [tooltipOpen, setTooltipOpen])
        harness.shallow()
        harness.find(Tooltip)
        harness.props.close()
      })

      test('should call setTooltipOpen false', () => {
        expect(setTooltipOpen).toHaveBeenCalledWith(false)
      })
    })

    describe('given tooltipOpen: false, when Tooltip close', () => {
      const setTooltipOpen = jest.fn()
      let tooltipOpen = false

      beforeEach(() => {
        useState.mockImplementationOnce(() => [tooltipOpen, setTooltipOpen])
        harness.shallow()
        harness.find(Tooltip)
        harness.props.close()
      })

      test('should call setTooltipOpen with true', () => {
        expect(setTooltipOpen).toHaveBeenCalledWith(true)
      })
    })

    describe('given tootlipOpen: true, when HelpIcon onClick', () => {
      const setTooltipOpen = jest.fn()
      let tooltipOpen = true

      beforeEach(() => {
        useState.mockImplementationOnce(() => [tooltipOpen, setTooltipOpen])
        harness.shallow()
        harness.find(HelpIcon)
        harness.trigger('click')
      })

      test('should call setTooltipOpen false', () => {
        expect(setTooltipOpen).toHaveBeenCalledWith(false)
      })
    })

    describe('given tooltipOpen: false, when HelpIcon onClick', () => {
      const setTooltipOpen = jest.fn()
      let tooltipOpen = false

      beforeEach(() => {
        useState.mockImplementationOnce(() => [tooltipOpen, setTooltipOpen])
        harness.shallow()
        harness.find(HelpIcon)
        harness.trigger('click')
      })

      test('should call setTooltipOpen with true', () => {
        expect(setTooltipOpen).toHaveBeenCalledWith(true)
      })
    })
  })
})
