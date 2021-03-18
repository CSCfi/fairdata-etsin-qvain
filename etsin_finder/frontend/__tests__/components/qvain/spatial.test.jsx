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

describe('Spatials', () => {
  const harness = new Harness(Spatials)

  describe('given required props', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto('Spatial')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    describe('Field', () => {
      let field

      beforeEach(() => {
        field = harness.wrapper.find(Field)
      })

      test('should exist', () => {
        harness.shouldExist('Field')
      })

      test('should have expected props', () => {
        const expectedProps = {
          brief: {
            title: 'qvain.temporalAndSpatial.spatial.title',
            description: 'qvain.temporalAndSpatial.spatial.description',
          },
          labelFor: 'spatial-coverage',
        }

        field.props().should.deep.include(expectedProps)
      })
    })
  })
})

describe('SpatialFieldContent', () => {
  const harness = new Harness(SpatialFieldContent)
  const mockStores = {
    Qvain: { Spatials: {} },
    Locale: {
      lang: 'en',
    },
  }
  const translationsRoot = 'qvain.temporalAndSpatial.spatial'

  describe('given mockStore in useStores', () => {
    beforeEach(() => {
      useStores.mockReturnValue(mockStores)
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    describe('FieldList', () => {
      beforeEach(() => {
        harness.find(FieldList)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have expectedProps', () => {
        const expectedProps = {
          Field: mockStores.Qvain.Spatials,
          lang: mockStores.Locale.lang,
          translationsRoot,
          disableNoItemsText: false,
        }

        harness.shouldIncludeProps(expectedProps)
      })
    })

    describe('FieldListAdd', () => {
      beforeEach(() => {
        harness.find(FieldListAdd)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have expectedProps', () => {
        const expectedProps = {
          Store: mockStores.Qvain,
          Field: mockStores.Qvain.Spatials,
          Form: Form,
        }

        harness.shouldIncludeProps(expectedProps)
      })

      describe('when calling props.handleSave', () => {
        beforeEach(() => {
          harness.props.handleSave()
        })

        test('should call handleSave with Qvain.Spatials & translationsRoot', () => {
          expect(handleSave).to.have.beenCalledWith(mockStores.Qvain.Spatials, translationsRoot)
        })
      })
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
    expect(spatialNameSchema.validate).to.have.beenCalledWith(field.inEdit.name)
  })

  test('should call spatialAltitudeSchema.validate with inEdit.altitude', () => {
    expect(spatialAltitudeSchema.validate).to.have.beenCalledWith(field.inEdit.altitude)
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

describe('Spatial Form', () => {
  const props = {
    Store: { value: 'some value' },
    Field: { value: 'some value' },
    translationsRoot: 'transltaionsRoot',
  }

  const harness = new Harness(Form, props)

  describe('given required props', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    describe('ModalInput datum=name', () => {
      beforeEach(() => {
        harness.findWithProp('datum', 'name')
      })

      test('should exist', () => {
        harness.shouldExist()
      })
    })

    describe('ModalInput datum=altitude', () => {
      beforeEach(() => {
        harness.findWithProp('datum', 'altitude')
      })

      test('should exist', () => {
        harness.shouldExist()
      })
    })

    describe('ModalInput datum=address', () => {
      beforeEach(() => {
        harness.findWithProp('datum', 'address')
      })
      test('should exist', () => {
        harness.shouldExist()
      })
    })

    describe('SpatialArrayInput datum=geometry', () => {
      beforeEach(() => {
        harness.findWithProp('datum', 'geometry')
      })

      test('should exist', () => {
        harness.shouldExist()
      })
    })

    describe('ModalReferenceInput datum=location', () => {
      beforeEach(() => {
        harness.findWithProp('datum', 'location')
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should include expectedProps', () => {
        const expectedProps = {
          ...props,
          model: Location,
          metaxIdentifier: 'location',
          search: true,
        }

        harness.shouldIncludeProps(expectedProps)
      })
    })
  })
})
