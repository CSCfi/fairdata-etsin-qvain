import Harness from '../componentTestHarness'
import { expect } from 'chai'

import { useStores } from '@/stores/stores'
import RestrictionGrounds from '@/components/qvain/sections/DataOrigin/general/AccessType/RestrictionGrounds'
import { Title } from '@/components/qvain/general/V2'

const mockStores = {
  Qvain: {
    RestrictionGrounds: {
      value: 'value',
      set: jest.fn(),
      Model: jest.fn(),
      validate: jest.fn(),
    },
  },
}

jest.mock('@/stores/stores', () => ({
  withStores: Component => props => <Component Stores={mockStores} {...props} />,
  useStores: jest.fn(),
}))

describe('given mockStores', () => {
  const harness = new Harness(RestrictionGrounds)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('RestrictionGrounds', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should render children with expected properties', () => {
      const children = [
        { label: 'Label', findArgs: { component: Title } },
        { label: 'Select', findArgs: { name: 'restrictionGrounds' } },
        {
          label: 'InfoText',
          findType: 'prop',
          findArgs: ['content', 'qvain.rightsAndLicenses.restrictionGrounds.text'],
        },
      ]

      const props = {
        Label: {
          htmlFor: 'restrictionGrounds-select',
          content: 'qvain.rightsAndLicenses.restrictionGrounds.title',
        },
        Select: {
          name: 'restrictionGrounds',
          metaxIdentifier: 'restriction_grounds',
          placeholder: 'qvain.rightsAndLicenses.restrictionGrounds.placeholder',
          model: mockStores.Qvain.RestrictionGrounds.Model,
          getter: mockStores.Qvain.RestrictionGrounds.value,
          setter: mockStores.Qvain.RestrictionGrounds.set,
          onBlur: mockStores.Qvain.RestrictionGrounds.validate,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})
