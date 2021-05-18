import React from 'react'
import { shallow } from 'enzyme'
import 'chai/register-should'
import { expect as expectChai } from 'chai'

import DurationPicker from '../../../js/components/qvain/general/input/durationpicker'
import { useStores } from '../../../js/stores/stores'
import {
  handleDatePickerChange,
  getDateFormatLocale,
} from '../../../js/components/qvain/general/input/datepicker'

jest.mock('../../../js/stores/stores')
jest.mock('../../../js/components/qvain/general/input/datepicker')

let Field = {
  inEdit: {
    startDate: '1.1.2000',
    endDate: '2.2.2020',
  },
  changeAttribute: jest.fn(),
}

let translationsRoot = 'translationsRoot'
let datum = 'datum'
let id = 'id'

const expectedLabelContent = 'translationsRoot.modal.datumInput.label'

describe('DurationPicker', () => {
  let wrapper
  let props = { Field, translationsRoot, datum, id }
  const Stores = {
    Qvain: {
      readonly: false,
    },
    Locale: {
      lang: 'en',
    },
  }

  beforeEach(() => {
    useStores.mockReturnValue(Stores)
    getDateFormatLocale.mockImplementation(lang => lang)
    wrapper = shallow(<DurationPicker {...props} />)
  })

  test('it renders', () => {
    expectChai(wrapper.exists()).to.be.true
  })

  test('label should be parsed from given props', () => {
    const label = wrapper.find('form__Label').children() // Translate component
    expectChai(label.exists()).to.be.true
    label.prop('content').should.be.string(expectedLabelContent)
  })

  describe('starting date DatePicker', () => {
    let datePicker
    let mockDate
    const placeholderText = 'translationsRoot.modal.datumInput.startPlaceholder'
    const ariaLabel = placeholderText
    const expectedPropName = 'startDate'

    const expectedAttributes = {
      placeholderText,
      ariaLabel,
    }

    beforeEach(() => {
      mockDate = jest.spyOn(global, 'Date')
      Date.now = jest.fn()
      datePicker = wrapper.find(`#${id}-start`)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('it should exist', () => {
      expectChai(datePicker.exists()).to.be.true
    })

    test('maxDate should call new Date() eight times', () => {
      expectChai(mockDate.mock.instances.length).to.eql(8)
    })

    test('should have correct attributes', () => {
      datePicker.prop('attributes').should.eql(expectedAttributes)
    })

    test('should place getDateFormatLocale return value to dateFormat prop', () => {
      datePicker.prop('dateFormat').should.be.string(Stores.Locale.lang)
    })

    test('disabled should be same as readonly', () => {
      datePicker.prop('disabled').should.eql(Stores.Qvain.readonly)
    })

    describe('when triggering onChangeRaw', () => {
      const event = { target: { value: 'value' } }

      beforeEach(() => {
        handleDatePickerChange.mockImplementationOnce((value, cb) => cb(value))
        datePicker.simulate('changeRaw', event)
      })

      test('should call eventually changeAttribute via handleDateChangeRaw with propName and event.target.value', () => {
        expect(Field.changeAttribute).toHaveBeenCalledWith(expectedPropName, event.target.value)
      })
    })

    describe('when triggering onChange', () => {
      const date = { toISOString: jest.fn(() => 'date') }

      beforeEach(() => {
        handleDatePickerChange.mockImplementationOnce((value, cb) => cb(value))
        datePicker.simulate('change', date)
      })

      test('should call eventually changeAttribute with propName and date', () => {
        expect(Field.changeAttribute).toHaveBeenCalledWith(expectedPropName, 'date')
      })
    })
  })

  describe('ending date DatePicker', () => {
    let datePicker
    let mockDate
    const placeholderText = 'translationsRoot.modal.datumInput.endPlaceholder'
    const ariaLabel = placeholderText
    const expectedPropName = 'endDate'

    const expectedAttributes = {
      placeholderText,
      ariaLabel,
    }

    beforeEach(() => {
      mockDate = jest.spyOn(global, 'Date')
      Date.now = jest.fn()
      datePicker = wrapper.find(`#${id}-end`)
    })

    afterEach(() => {
      mockDate.mockClear()
    })

    test('it should exist', () => {
      expectChai(datePicker.exists()).to.be.true
    })

    test('maxDate should call new Date() eight times', () => {
      expectChai(mockDate.mock.instances.length).to.eql(8)
    })

    test('should have correct attributes', () => {
      datePicker.prop('attributes').should.eql(expectedAttributes)
    })

    test('should place getDateFormatLocale return value to dateFormat prop', () => {
      datePicker.prop('dateFormat').should.be.string(Stores.Locale.lang)
    })

    test('disabled should be same as readonly', () => {
      datePicker.prop('disabled').should.eql(Stores.Qvain.readonly)
    })

    describe('when triggering onChangeRaw', () => {
      const event = { target: { value: 'value' } }

      beforeEach(() => {
        handleDatePickerChange.mockImplementationOnce((value, cb) => cb(value))
        datePicker.simulate('changeRaw', event)
      })

      test('should call eventually changeAttribute via handleDateChangeRaw with propName and event.target.value', () => {
        expect(Field.changeAttribute).toHaveBeenCalledWith(expectedPropName, event.target.value)
      })
    })

    describe('when triggering onChange', () => {
      const date = { toISOString: jest.fn(() => 'date') }

      beforeEach(() => {
        handleDatePickerChange.mockImplementationOnce((value, cb) => cb(value))
        datePicker.simulate('change', date)
      })

      test('should call eventually changeAttribute with propName and date', () => {
        expect(Field.changeAttribute).toHaveBeenCalledWith(expectedPropName, 'date')
      })
    })
  })
})
