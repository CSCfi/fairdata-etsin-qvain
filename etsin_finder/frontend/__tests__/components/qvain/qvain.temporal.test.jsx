import Harness from '../componentTestHarness'
import 'chai/register-expect'

import Temporal, { brief } from '../../../js/components/qvain/fields/temporalAndSpatial/temporal'
import TemporalFieldContent from '../../../js/components/qvain/fields/temporalAndSpatial/temporal/temporalFieldContent'
import handleSave from '../../../js/components/qvain/fields/temporalAndSpatial/temporal/handleSave'
import { useStores } from '../../../js/stores/stores'
import Field from '../../../js/components/qvain/general/section/field'
import temporalFieldContent from '../../../js/components/qvain/fields/temporalAndSpatial/temporal/temporalFieldContent'
import TemporalList, {
  RemoveButton,
} from '../../../js/components/qvain/fields/temporalAndSpatial/temporal/TemporalList'
import DurationPicker from '../../../js/components/qvain/general/input/durationpicker'
import { AddNewButton } from '../../../js/components/qvain/general/buttons'
import ValidationError from '../../../js/components/qvain/general/errors/validationError'
import { temporalDateSchema } from '../../../js/components/qvain/utils/formValidation'
import Label from '../../../js/components/qvain/general/card/label'

jest.mock('../../../js/components/qvain/fields/temporalAndSpatial/temporal/handleSave')

jest.mock('../../../js/components/qvain/utils/formValidation')

describe('given mocked Stores', () => {
  const mockStores = {
    Qvain: { some: 'data' },
    Locale: {
      lang: 'lang',
    },
  }

  const harness = new Harness(Temporal)

  describe('Temporal', () => {
    beforeEach(() => {
      useStores.mockReturnValue(mockStores)
      harness.shallow()
      harness.diveInto('Temporal')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    describe('Field', () => {
      beforeEach(() => {
        harness.find(Field)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have brief:brief', () => {
        harness.props.brief.should.eql(brief)
      })
    })

    describe('TemporalFieldContent', () => {
      beforeEach(() => {
        harness.find(temporalFieldContent)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have props Store: Qvain and lang: Locale.lang', () => {
        const expectedProps = {
          Store: mockStores.Qvain,
          lang: mockStores.Locale.lang,
        }

        harness.shouldIncludeProps(expectedProps)
      })
    })
  })
})

describe('given required props', () => {
  const Store = {
    Temporals: {
      storage: [],
      removeTemporal: jest.fn(),
      readonly: false,
    },
  }

  const lang = 'en'

  const harness = new Harness(TemporalFieldContent, { Store, lang })
  beforeEach(() => {})

  describe('TemporalFieldContent', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    describe('TemporalList', () => {
      beforeEach(() => {
        harness.find(TemporalList)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have expectedProps', () => {
        const expectedProps = {
          lang,
          temporals: Store.Temporals.storage,
          remove: Store.Temporals.removeTemporal,
          readonly: Store.Temporals.readonly,
        }

        harness.shouldIncludeProps(expectedProps)
      })
    })

    describe('DurationPicker', () => {
      beforeEach(() => {
        harness.find(DurationPicker)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have expectedProps', () => {
        const expectedProps = {
          Store,
          Field: Store.Temporals,
          translationsRoot: 'qvain.temporalAndSpatial.temporal',
          datum: 'duration',
          id: 'temporal-period',
        }

        harness.shouldIncludeProps(expectedProps)
      })
    })

    describe('Translate component=AddNewButton', () => {
      beforeEach(() => {
        harness.findWithProp('component', AddNewButton)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have expectedProps', () => {
        const expectedProps = {
          content: 'qvain.temporalAndSpatial.temporal.addButton',
          disabled: Store.Temporals.readonly,
        }

        harness.shouldIncludeProps(expectedProps)
      })

      describe('when calling onClick', () => {
        beforeEach(() => {
          harness.props.onClick()
        })

        afterAll(() => {
          handleSave.mockImplementation(
            jest.requireActual(
              '../../../js/components/qvain/fields/temporalAndSpatial/temporal/handleSave'
            )
          )
        })

        test('should call handleSave', () => {
          expect(handleSave).to.have.beenCalledTimes(1)
        })
      })
    })
  })

  describe('given Field.validationError', () => {
    beforeEach(() => {
      harness.shallow({
        Store: {
          Temporals: {
            ...Store.Temporals,
            validationError: 'validationError',
          },
        },
      })
    })

    describe('ValidationError', () => {
      beforeEach(() => {
        harness.find(ValidationError)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have text:validationError', () => {
        harness.wrapper.children().text().should.include('validationError')
      })
    })
  })
})

describe('when calling handleSave, on successful validation', () => {
  const field = {
    inEdit: { some: 'data' },
    create: jest.fn(),
    setValidationError: jest.fn(),
    addTemporal: jest.fn(),
  }

  beforeEach(async () => {
    temporalDateSchema.validate.mockReturnValue(Promise.resolve())
    handleSave.mockImplementation(
      jest.requireActual(
        '../../../js/components/qvain/fields/temporalAndSpatial/temporal/handleSave'
      ).default
    )
    await handleSave(undefined, field)
  })

  test('should call temporalDateSchema with Field.inEdit', () => {
    expect(temporalDateSchema.validate).to.have.beenCalledWith(field.inEdit)
  })

  test('should call field.addTemporal', () => {
    expect(field.addTemporal).to.have.beenCalledWith()
  })

  test('should call field.create', () => {
    expect(field.create).to.have.beenCalledWith()
  })
})

describe('given required props and with one item in temporals array', () => {
  const props = {
    temporals: [
      {
        startDate: 1,
        endDate: 2,
        uiid: 3,
      },
    ],
    lang: 'en',
    remove: jest.fn(),
  }

  const harness = new Harness(TemporalList, props)

  describe('TemporalList', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    describe('Label', () => {
      beforeEach(() => {
        harness.find(Label)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have key:item.uiid', () => {
        const key = props.temporals[0].uiid.toString()
        harness.wrapper.key().should.eql(key)
      })
    })

    describe('PaddedWord', () => {
      beforeEach(() => {
        harness.findWithName('PaddedWord')
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have parsed "item.startDate - item.endDate" in text', () => {
        const expectedText = '1/1/1970 - 1/1/1970'
        harness.wrapper.text().should.eql(expectedText)
      })
    })

    describe('Translate component:RemoveButton', () => {
      beforeEach(() => {
        harness.findWithProp('component', RemoveButton)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      describe('when triggering click', () => {
        beforeEach(() => {
          harness.trigger('click')
        })

        test('should call remove with item.uiid', () => {
          const uiid = props.temporals[0].uiid
          expect(props.remove).to.have.beenCalledWith(uiid)
        })
      })
    })
  })
})
