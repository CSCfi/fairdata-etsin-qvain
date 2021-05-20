import translate from 'counterpart'
import 'chai/register-expect'
import Harness from '../componentTestHarness'
import EmbargoExpires from '../../../js/components/qvain/fields/licenses/embargoExpires'
import '../../../locale/translations'
import { Label } from '../../../js/components/qvain/general/modal/form'
import DatePicker, {
  getDateFormatLocale,
} from '../../../js/components/qvain/general/input/datepicker'
import { useStores } from '../../../js/stores/stores'
import ValidationError from '../../../js/components/qvain/general/errors/validationError'

jest.mock('../../../js/stores/stores')

const harness = new Harness(EmbargoExpires)

describe('given useStores', () => {
  const mockStores = {
    Qvain: {
      EmbargoExpDate: {
        value: 1,
        set: jest.fn(),
        readonly: false,
        Schema: jest.fn(),
      },
    },
    Locale: {
      lang: 'en',
    },
  }

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('EmbargoExpires', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'Label', findType: 'prop', findArgs: ['component', Label] },
        { label: 'DatePicker', findArgs: DatePicker },
      ]

      const props = {
        Label: {
          content: 'qvain.rightsAndLicenses.embargoDate.label',
        },
        DatePicker: {
          strictParsing: true,
          selected: new Date(1),
          locale: 'en',
          placeholderText: translate('qvain.rightsAndLicenses.embargoDate.placeholder'),
          dateFormat: getDateFormatLocale('en'),
          disabled: false,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })

    describe('when calling onChangeRaw with event', () => {
      const event = { target: { value: '1/2/3456' } }

      beforeEach(() => {
        harness.restoreWrapper('DatePicker')
        harness.props.onChangeRaw(event)
      })

      test('should call setEmbargoExpDate with date based on the event', () => {
        expect(mockStores.Qvain.EmbargoExpDate.set).to.have.beenCalledWith('3456-01-02')
      })
    })

    describe('when calling onChange with date', () => {
      const date = new Date('2.1.3456')

      beforeEach(() => {
        harness.restoreWrapper('DatePicker')
        harness.props.onChange(date)
      })

      test('should call setEmbargoDate with date', () => {
        expect(mockStores.Qvain.EmbargoExpDate.set).to.have.beenCalledWith('3456-01-02')
      })
    })

    describe('given additional validationError', () => {
      beforeEach(() => {
        mockStores.Qvain.EmbargoExpDate.validationError = 'validationError'
        useStores(mockStores)
        harness.shallow()
      })

      test('should have ValidationError with text', () => {
        const component = { label: 'ValidationError', findArgs: ValidationError }
        harness.shouldIncludeChild(component)
        harness.children.text().should.include('validationError')
      })
    })
  })
})
