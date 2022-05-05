import Harness from '../componentTestHarness'
import 'chai/register-expect'
import { useStores } from '../../../js/stores/stores'
import { buildStores } from '../../../js/stores'

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

  describe('given mockStores', () => {
    const stores = buildStores()
    stores.Qvain.editDataset({ research_dataset: { infrastructure: [{ identifier: 'x' }] } })

    beforeEach(() => {
      useStores.mockReturnValue(stores)
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

    describe('InfrastructureSelection', () => {
      beforeEach(() => {
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
          getter: stores.Qvain.Infrastructures.storage,
          setter: stores.Qvain.Infrastructures.set,
          model: stores.Qvain.Infrastructures.model,
          isMulti: true,
          metaxIdentifier: 'research_infra',
        }

        harness.shouldIncludeChild(select, props)
      })
    })
  })

  describe('given stores with no existing infrastructure', () => {
    const stores = buildStores()
    stores.Qvain.editDataset({ research_dataset: {} })

    beforeEach(() => {
      useStores.mockReturnValue(stores)
      harness.shallow()
      harness.diveInto('Infrastructure')
    })

    test('should not render anything', () => {
      harness.wrapper.isEmptyRender().should.eql(true)
    })
  })
})
