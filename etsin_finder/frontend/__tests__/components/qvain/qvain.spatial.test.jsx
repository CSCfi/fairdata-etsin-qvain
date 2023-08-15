import Harness from '../componentTestHarness'
import SpatialFieldContent from '@/components/qvain/sections/Geographics/SpatialFieldContent'
import Form from '@/components/qvain/sections/Geographics/Form'

import FieldList from '@/components/qvain/general/V2/FieldList'
import FieldListAdd from '@/components/qvain/general/V2/FieldListAdd'
import { Location } from '@/stores/view/qvain/qvain.spatials'
import { useStores } from '@/stores/stores'

describe('given mockStore in useStores', () => {
  const harness = new Harness(SpatialFieldContent)
  const mockStores = {
    Qvain: {
      Spatials: {
        translationsRoot: 'translationsRoot',
      },
    },
    Locale: {
      lang: 'en',
    },
  }

  describe('SpatialFieldContent', () => {
    beforeEach(() => {
      useStores.mockReturnValue(mockStores)
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should include children with properties', () => {
      const children = [
        { label: 'FieldList', findArgs: FieldList },
        { label: 'FieldListAdd', findArgs: FieldListAdd },
      ]
      harness.shouldIncludeChildren(children)
    })
  })
})

describe('given required props', () => {
  const props = {
    Field: { value: 'some value' },
  }

  const harness = new Harness(Form, props)

  describe('Spatial Form', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should include children with properties', () => {
      const children = [
        { label: 'InputName', findType: 'prop', findArgs: ['datum', 'name'] },
        { label: 'InputAltitude', findType: 'prop', findArgs: ['datum', 'altitude'] },
        { label: 'InputAddress', findType: 'prop', findArgs: ['datum', 'address'] },
        { label: 'InputGeometry', findType: 'prop', findArgs: ['datum', 'geometry'] },
        { label: 'InputLocation', findType: 'prop', findArgs: ['datum', 'location'] },
      ]

      const expectedProps = {
        InputLocation: {
          ...props,
          model: Location,
          metaxIdentifier: 'location',
          search: true,
        },
      }

      harness.shouldIncludeChildren(children, expectedProps)
    })
  })
})
