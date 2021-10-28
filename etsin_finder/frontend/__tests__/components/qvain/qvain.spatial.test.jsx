import 'chai/register-expect'

import Harness from '../componentTestHarness'
import Spatials from '../../../js/components/qvain/fields/temporalAndSpatial/spatial'
import SpatialFieldContent from '../../../js/components/qvain/fields/temporalAndSpatial/spatial/SpatialFieldContent'
import Form from '../../../js/components/qvain/fields/temporalAndSpatial/spatial/form'

import Field from '../../../js/components/qvain/general/section/field'
import FieldList from '../../../js/components/qvain/general/section/fieldList'
import FieldListAdd from '../../../js/components/qvain/general/section/fieldListAdd'
import { Location } from '../../../js/stores/view/qvain/qvain.spatials'
import { useStores } from '../../../js/stores/stores'

describe('given required props', () => {
  const harness = new Harness(Spatials)

  describe('Spatials', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto('Spatial')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should include children with properties', () => {
      const children = [{ label: 'Field', findArgs: Field }]

      const props = {
        Field: {
          brief: {
            title: 'qvain.temporalAndSpatial.spatial.title',
            description: 'qvain.temporalAndSpatial.spatial.description',
          },
          labelFor: 'spatial-coverage',
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})

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

      const props = {
        FieldList: {
          Field: mockStores.Qvain.Spatials,
          disableNoItemsText: false,
        },
        FieldListAdd: {
          Field: mockStores.Qvain.Spatials,
          Form: Form,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})

describe('given required props', () => {
  const props = {
    Store: { value: 'some value' },
    Field: { value: 'some value' },
    translationsRoot: 'translationsRoot',
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

      const props = {
        InputLocation: {
          ...props,
          model: Location,
          metaxIdentifier: 'location',
          search: true,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})
