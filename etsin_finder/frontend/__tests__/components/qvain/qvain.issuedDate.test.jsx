import Harness from '../componentTestHarness'
import 'chai/register-expect'
import '../../../locale/translations'
import translate from 'counterpart'

import IssuedDate from '../../../js/components/qvain/fields/description/issuedDate'
import { useStores } from '../../../js/stores/stores'
import { LabelLarge } from '../../../js/components/qvain/general/modal/form'
import Tooltip from '../../../js/components/general/tooltipHover'
import DatePicker, {
  getDateFormatLocale,
  handleDatePickerChange,
} from '../../../js/components/qvain/general/input/datepicker'
import ValidationError from '../../../js/components/qvain/general/errors/validationError'

jest.mock('../../../js/stores/stores')

describe('given mockStores (not published with doi)', () => {
  const mockStores = {
    Qvain: {
      useDoi: false,
      original: undefined,
      IssuedDate: {
        value: new Date(1).toISOString(),
        set: jest.fn(),
        validationError: undefined,
        validate: jest.fn(),
      },
      hasBeenPublishedWithDoi: false,
      readonly: false,
    },
    Locale: {
      lang: 'en',
    },
  }

  const harness = new Harness(IssuedDate)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('IssuedDate', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto('IssuedDateField')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'Label', findArgs: LabelLarge },
        { label: 'Tooltip', findType: 'prop', findArgs: ['component', Tooltip] },
        {
          label: 'Title',
          findType: 'prop',
          findArgs: ['content', 'qvain.description.issuedDate.title'],
        },
        {
          label: 'InfoText',
          findType: 'prop',
          findArgs: ['content', 'qvain.description.issuedDate.infoText'],
        },
        { label: 'DatePicker', findArgs: DatePicker },
      ]

      const props = {
        Label: {
          htmlFor: 'issuedDateInput',
        },
        Tooltip: {
          position: 'right',
          attributes: {
            title: 'qvain.description.fieldHelpTexts.requiredToPublish',
          },
        },
        InfoText: {
          component: 'p',
        },
        DatePicker: {
          id: 'issuedDateInput',
          strictParsing: true,
          selected: new Date(1),
          locale: 'en',
          placeholderText: translate('qvain.description.issuedDate.placeholder'),
          dateFormat: getDateFormatLocale('en'),
          disabled: false,
          required: true,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })

  describe('DatePicker', () => {
    beforeEach(() => {
      harness.restoreWrapper('DatePicker')
    })

    describe('when onChangeRaw is called', () => {
      beforeEach(() => {
        harness.props.onChangeRaw({ target: { value: '12.5.2020' } })
      })

      test('should call IssuedDate.set', () => {
        expect(mockStores.Qvain.IssuedDate.set).to.have.beenCalledWith('2020-05-12')
      })

      test('should call IssuedDate.validate', () => {
        expect(mockStores.Qvain.IssuedDate.validate).to.have.beenCalled()
      })
    })
  })

  describe('DatePicker', () => {
    beforeEach(() => {
      harness.restoreWrapper('DatePicker')
    })

    describe('when onChange is called', () => {
      beforeEach(() => {
        harness.props.onChange(new Date('6/12/2020'))
      })

      test('should call IssuedDate.set', () => {
        expect(mockStores.Qvain.IssuedDate.set).to.have.beenCalledWith('2020-06-12')
      })

      test('should call IssuedDate.validate', () => {
        expect(mockStores.Qvain.IssuedDate.validate).to.have.beenCalled()
      })
    })
  })
})

describe('given mockStores (published with doi and has validation error)', () => {
  const mockStores = {
    Qvain: {
      useDoi: true,
      original: {},
      IssuedDate: {
        value: new Date(1).toISOString(),
        set: jest.fn(),
        validationError: 'validationError',
        validate: jest.fn(),
      },
      hasBeenPublishedWithDoi: true,
      readonly: false,
    },
    Locale: {
      lang: 'en',
    },
  }

  const harness = new Harness(IssuedDate)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('IssuedDate', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto('IssuedDateField')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'DatePicker', findArgs: DatePicker },
        { label: 'ValidationError', findArgs: ValidationError },
      ]

      const props = {
        DatePicker: {
          disabled: true,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })

    describe('ValidationError', () => {
      beforeEach(() => {
        harness.restoreWrapper('ValidationError')
      })

      test('should have child with validationError text', () => {
        harness.children.text().should.include('validationError')
      })
    })
  })
})
