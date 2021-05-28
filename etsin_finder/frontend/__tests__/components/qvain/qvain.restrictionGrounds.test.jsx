import Harness from '../componentTestHarness'
import 'chai/register-expect'

import { useStores, withStores } from '../../../js/stores/stores'
import RestrictionGrounds from '../../../js/components/qvain/fields/licenses/restrictionGrounds'
import { LabelLarge } from '../../../js/components/qvain/general/modal/form'

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

jest.mock('../../../js/stores/stores', () => ({
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
        { label: 'Label', findType: 'prop', findArgs: ['component', LabelLarge] },
        { label: 'Select', findType: 'prop', findArgs: ['name', 'restrictionGrounds'] },
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
