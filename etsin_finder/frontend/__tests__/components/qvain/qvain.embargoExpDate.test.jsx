import { expect } from 'chai'
import Harness from '../componentTestHarness'
import EmbargoExpires from '@/components/qvain/sections/DataOrigin/general/AccessRights/AccessType/EmbargoExpires'
import DatePicker, { getDateFormatLocale } from '@/components/qvain/general/V2/Datepicker'
import { useStores } from '@/stores/stores'
import ValidationError from '@/components/qvain/general/errors/validationError'

jest.mock('@/stores/stores')

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
      translate: v => v,
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
        { label: 'Label', findArgs: { content: 'qvain.rightsAndLicenses.embargoDate.label' } },
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
          placeholderText: 'qvain.rightsAndLicenses.embargoDate.placeholder',
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
