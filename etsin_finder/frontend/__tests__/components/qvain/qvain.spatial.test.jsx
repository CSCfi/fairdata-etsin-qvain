import 'chai/register-expect'

import Harness from '../componentTestHarness'
import Spatials from '../../../js/components/qvain/fields/temporalAndSpatial/spatial'
import SpatialFieldContent from '../../../js/components/qvain/fields/temporalAndSpatial/spatial/SpatialFieldContent'
import Form from '../../../js/components/qvain/fields/temporalAndSpatial/spatial/form'
import handleSave from '../../../js/components/qvain/fields/temporalAndSpatial/spatial/handleSave'

import Field from '../../../js/components/qvain/general/section/field'
import FieldList from '../../../js/components/qvain/general/section/fieldList'
import FieldListAdd from '../../../js/components/qvain/general/section/fieldListAdd'
import { Location } from '../../../js/stores/view/qvain/qvain.spatials'
import { useStores } from '../../../js/stores/stores'

jest.mock('../../../js/components/qvain/fields/temporalAndSpatial/spatial/handleSave')

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

    describe('when calling props.handleSave', () => {
      beforeEach(() => {
        harness.restoreWrapper('FieldListAdd')
        harness.props.handleSave()
      })

      test('should call handleSave with Qvain.Spatials', () => {
        expect(handleSave).to.have.beenCalledWith(mockStores.Qvain.Spatials)
      })
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

describe('when calling Spatial handleSave and validations are successful', () => {
  const field = {
    inEdit: {
      name: 'name',
      altitude: 'alt',
    },
    schema: {
      validate: jest.fn(),
    },
    save: jest.fn(),
    clearInEdit: jest.fn(),
  }

  beforeEach(async () => {
    const handleSave = jest.requireActual(
      '../../../js/components/qvain/fields/temporalAndSpatial/spatial/handleSave'
    ).default

    field.schema.validate.mockReturnValue(Promise.resolve())

    await handleSave(field)
  })

  test('should call schema.validate with inEdit', () => {
    expect(field.schema.validate).to.have.beenCalledWith(field.inEdit, {
      strict: true,
    })
  })

  test('should call field.save', () => {
    expect(field.save).to.have.beenCalled()
  })

  test('should call field.clearInEdit', () => {
    expect(field.clearInEdit).to.have.beenCalled()
  })
})

describe('when calling Spatial handleSave and validation fails', () => {
  const field = {
    inEdit: {
      name: 'name',
      altitude: 'alt',
    },
    schema: {
      validate: jest.fn(),
    },
    setValidationError: jest.fn(),
  }

  const message = 'error message'

  beforeEach(async () => {
    const handleSave = jest.requireActual(
      '../../../js/components/qvain/fields/temporalAndSpatial/spatial/handleSave'
    ).default

    field.schema.validate.mockReturnValue(Promise.reject({ message }))

    await handleSave(field)
  })

  test('should call validationError with error.message', () => {
    expect(field.setValidationError).to.have.beenCalledWith(message)
  })
})