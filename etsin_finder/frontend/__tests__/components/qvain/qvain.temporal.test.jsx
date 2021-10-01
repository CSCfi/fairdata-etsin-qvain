import Harness from '../componentTestHarness'
import 'chai/register-expect'

import Temporal, { brief } from '../../../js/components/qvain/fields/temporalAndSpatial/temporal'
import TemporalFieldContent from '../../../js/components/qvain/fields/temporalAndSpatial/temporal/temporalFieldContent'
import handleSave from '../../../js/components/qvain/fields/temporalAndSpatial/temporal/handleSave'
import { useStores } from '../../../js/stores/stores'
import Field from '../../../js/components/qvain/general/section/field'
import TemporalList, {
  RemoveButton,
} from '../../../js/components/qvain/fields/temporalAndSpatial/temporal/TemporalList'
import DurationPicker from '../../../js/components/qvain/general/input/durationpicker'
import { AddNewButton } from '../../../js/components/qvain/general/buttons'
import ValidationError from '../../../js/components/qvain/general/errors/validationError'
import Label from '../../../js/components/qvain/general/card/label'
import '../../../locale/translations'

jest.mock('../../../js/components/qvain/fields/temporalAndSpatial/temporal/handleSave')

jest.mock('../../../js/stores/view/qvain/qvain.submit.schemas')

const mockStores = {
  Qvain: {
    Temporals: {
      storage: [],
      removeTemporal: jest.fn(),
      readonly: false,
      validationError: undefined,
      translationsRoot: 'translationsRoot',
    },
  },
  Locale: {
    lang: 'lang',
  },
}

describe('given mocked stores', () => {
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

    test('should find children with props', () => {
      const children = [
        { label: 'Field', findArgs: Field },
        { label: 'FieldContent', findArgs: TemporalFieldContent },
      ]

      const props = {
        Field: {
          brief,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})

describe('given required props', () => {
  const lang = 'lang'

  const harness = new Harness(TemporalFieldContent, {}, 'TemporalFieldContent')

  describe('TemporalFieldContent', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should include children with properties', () => {
      const children = [
        { label: 'TemporalList', findArgs: TemporalList },
        { label: 'DurationPicker', findArgs: DurationPicker },
        {
          label: 'AddNewButton',
          findType: 'prop',
          findArgs: ['component', AddNewButton],
        },
      ]

      const props = {
        TemporalList: {
          lang,
          temporals: mockStores.Qvain.Temporals.storage,
          remove: mockStores.Qvain.Temporals.removeTemporal,
          readonly: mockStores.Qvain.Temporals.readonly,
        },
        DurationPicker: {
          Field: mockStores.Qvain.Temporals,
          datum: 'duration',
          id: 'temporal-period',
        },
        AddNewButton: {
          content: 'translationsRoot.addButton',
          disabled: mockStores.Qvain.Temporals.readonly,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })

    describe('AddNewButton', () => {
      beforeEach(() => {
        harness.restoreWrapper('AddNewButton')
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

  describe('given additional prop Store.Temporals.validationError', () => {
    beforeEach(() => {
      harness.restoreWrapper('TemporalFieldContent')
      useStores.mockReturnValue({
        ...mockStores,
        Qvain: {
          ...mockStores.Qvain,
          Temporals: {
            ...mockStores.Qvain.Temporals,
            validationError: 'validationError',
          },
        },
      })
      harness.shallow()
    })

    test('should have child ValidationError with text', () => {
      harness.shouldIncludeChild({
        label: 'ValidationError',
        findArgs: ValidationError,
      })
      harness.children.text().should.eql('validationError')
    })
  })
})

describe('when calling handleSave, on successful validation', () => {
  const field = {
    inEdit: { some: 'data' },
    create: jest.fn(),
    setValidationError: jest.fn(),
    addTemporal: jest.fn(),
    schema: {
      validate: jest.fn(),
    },
  }

  beforeEach(async () => {
    field.schema.validate.mockReturnValue(Promise.resolve())
    handleSave.mockImplementation(
      jest.requireActual(
        '../../../js/components/qvain/fields/temporalAndSpatial/temporal/handleSave'
      ).default
    )
    await handleSave(undefined, field)
  })

  test('should call schema with Field.inEdit', () => {
    expect(field.schema.validate).to.have.beenCalledWith(field.inEdit, { strict: true })
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

    test('should have children with props', () => {
      const children = [
        {
          label: 'DateLabel',
          findType: 'prop',
          findArgs: ['className', 'date-label'],
        },
      ]

      harness.shouldIncludeChildren(children)
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

    describe('DateLabel', () => {
      beforeEach(() => {
        harness.restoreWrapper('DateLabel')
        harness.wrapper = harness.dive().first().dive()
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have parsed "item.startDate - item.endDate" in text', () => {
        const expectedText = '1970-01-01 - 1970-01-01'
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

describe('given required props and with one partial item in temporals array', () => {
  const props = {
    temporals: [
      {
        startDate: undefined,
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

    test('should have children with props', () => {
      const children = [
        {
          label: 'DateLabel',
          findType: 'prop',
          findArgs: ['className', 'date-label'],
        },
      ]

      harness.shouldIncludeChildren(children)
    })

    describe('DateLabel', () => {
      beforeEach(() => {
        harness.restoreWrapper('DateLabel')
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have parsed "until <item.endDate>" in text', () => {
        const expectedText = 'until 1970-01-01'
        harness.wrapper = harness.wrapper.first().dive().dive()
        harness.wrapper.text().should.eql(expectedText)
      })
    })
  })
})
