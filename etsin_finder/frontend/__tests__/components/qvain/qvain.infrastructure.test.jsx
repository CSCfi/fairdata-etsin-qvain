import Harness from '../componentTestHarness'
import 'chai/register-expect'
import { useStores } from '../../../js/stores/stores'

import Infrastructure from '../../../js/components/qvain/fields/history/infrastructure'
import { Field } from '../../../js/components/qvain/general/section'
import InfrastructureSelection from '../../../js/components/qvain/fields/history/infrastructure/InfrastructureSelection'

import Select from '../../../js/components/qvain/general/input/select'

jest.mock('../../../js/stores/stores', () => ({
  withStores: Component => props => <Component Stores={mockStores} {...props} />,
  useStores: jest.fn(),
}))


describe('Infrastructure', () => {
  const harness = new Harness(Infrastructure)

  beforeEach(() => {
    harness.shallow()
    harness.diveInto('Infrastructure')
  })

  test('should exist', () => {
    harness.shouldExist()
  })

  test('should render children with properties', () => {
    const children = [
      { label: 'Field', findArgs: Field },
      { label: 'InfrastructureSelection', findArgs: InfrastructureSelection },
    ]

    const props = {
      Field: {
        brief: {
          title: 'qvain.history.infrastructure.title',
          description: 'qvain.history.infrastructure.description',
        },
        labelFor: 'infrastructure-select',
      },
    }

    harness.shouldIncludeChildren(children, props)
  })

  describe('given mockStores', () => {
    const mockStores = {
      Qvain: {
        Infrastructures: {
          storage: [{ some: 'data' }],
          Model: jest.fn(),
          set: jest.fn(),
        },
      },
    }

    describe('InfrastructureSelection', () => {
      beforeEach(() => {
        useStores.mockReturnValue(mockStores)
        harness.diveInto(InfrastructureSelection)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have select with expected properties', () => {
        const select = { label: 'Select', findArgs: Select }

        const props = {
          inputId: 'infrastructure-select',
          name: 'infrastructure',
          getter: mockStores.Qvain.Infrastructures.storage,
          setter: mockStores.Qvain.Infrastructures.set,
          model: mockStores.Qvain.Infrastructures.model,
          isMulti: true,
          metaxIdentifier: 'research_infra',
        }

        harness.shouldIncludeChild(select, props)
      })
    })
  })
})
