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
import {
  spatialNameSchema,
  spatialAltitudeSchema,
} from '../../../js/components/qvain/utils/formValidation'

jest.mock('../../../js/components/qvain/utils/formValidation', () => {
  return {
    spatialNameSchema: { validate: jest.fn() },
    spatialAltitudeSchema: { validate: jest.fn() },
  }
})

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
    Qvain: { Spatials: {} },
    Locale: {
      lang: 'en',
    },
  }
  const translationsRoot = 'qvain.temporalAndSpatial.spatial'

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
          lang: mockStores.Locale.lang,
          translationsRoot,
          disableNoItemsText: false,
        },
        FieldListAdd: {
          Store: mockStores.Qvain,
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

      test('should call handleSave with Qvain.Spatials & translationsRoot', () => {
        expect(handleSave).to.have.beenCalledWith(mockStores.Qvain.Spatials, translationsRoot)
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
    save: jest.fn(),
    clearInEdit: jest.fn(),
  }

  beforeEach(async () => {
    const handleSave = jest.requireActual(
      '../../../js/components/qvain/fields/temporalAndSpatial/spatial/handleSave'
    ).default

    spatialNameSchema.validate.mockReturnValue(Promise.resolve())
    spatialAltitudeSchema.validate.mockReturnValue(Promise.resolve())

    await handleSave(field)
  })

  test('should call spatialNameSchema.validate with inEdit.name', () => {
    expect(spatialNameSchema.validate).to.have.beenCalledWith(field.inEdit.name, { strict: true })
  })

  test('should call spatialAltitudeSchema.validate with inEdit.altitude', () => {
    expect(spatialAltitudeSchema.validate).to.have.beenCalledWith(field.inEdit.altitude, {
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
    setValidationError: jest.fn(),
  }

  const message = 'error message'

  beforeEach(async () => {
    const handleSave = jest.requireActual(
      '../../../js/components/qvain/fields/temporalAndSpatial/spatial/handleSave'
    ).default

    spatialNameSchema.validate.mockReturnValue(Promise.reject({ message }))
    spatialAltitudeSchema.validate.mockReturnValue(Promise.resolve())

    await handleSave(field)
  })

  test('should call validationError with error.message', () => {
    expect(field.setValidationError).to.have.beenCalledWith(message)
  })
})
