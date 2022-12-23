import Harness from '../componentTestHarness'
import { expect } from 'chai'
import { useStores } from '@/stores/stores'
import { buildStores } from '@/stores'

import Infrastructure from '@/components/qvain/sections/Infrastructure'
import InfrastructureSelection from '@/components/qvain/sections/Infrastructure/InfrastructureSelection'
import Select from '@/components/qvain/general/V2/Select'

jest.mock('@/stores/stores', () => ({
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
      const children = [{ label: 'InfrastructureSelection', findArgs: InfrastructureSelection }]
      harness.shouldIncludeChildren(children)
    })

    describe('InfrastructureSelection', () => {
      beforeEach(() => {
        harness.diveInto(InfrastructureSelection)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have select with expected properties', () => {
        const select = { label: 'Select', findArgs: { component: Select } }

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
