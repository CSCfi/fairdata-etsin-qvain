import React from 'react'
import { mount } from 'enzyme'
import { expect as expectChai } from 'chai'
import Translate from '@/utils/Translate'

import DurationPicker from '@/components/qvain/general/V2/Durationpicker'
import { useStores } from '@/stores/stores'

import { DatePicker, getDateFormatLocale } from '@/components/qvain/general/V2/Datepicker'

jest.mock('@/stores/stores')

let Field = {
  inEdit: {
    startDate: '1.1.2000',
    endDate: '2.2.2020',
  },
  translationsRoot: 'translationsRoot',
  changeAttribute: jest.fn(),
}

let datum = 'datum'
let id = 'id'

const expectedLabelContent = 'translationsRoot.datum.label'

describe('DurationPicker', () => {
  let wrapper
  let props = { Field, datum, id }
  const Stores = {
    Qvain: {
      readonly: false,
    },
    Locale: {
      lang: 'en',
      translate: v => v,
    },
  }

  beforeEach(() => {
    useStores.mockReturnValue(Stores)
    wrapper = mount(<DurationPicker {...props} />)
  })

  afterEach(() => {
    wrapper.unmount()
    jest.clearAllMocks()
  })

  test('it renders', () => {
    expectChai(wrapper.exists()).to.be.true
  })

  test('label should be parsed from given props', () => {
    const label = wrapper.find('label').find(Translate)
    expectChai(label.exists()).to.be.true
    label.prop('content').should.eql(expectedLabelContent)
  })

  describe('starting date DatePicker', () => {
    let datePicker
    const expectedPropName = 'startDate'

    const expectedAttributes = {
      ariaLabel: 'translationsRoot.datum.startInfoText',
    }

    beforeEach(() => {
      datePicker = wrapper.find(Translate).filter({ component: DatePicker, id: `${id}-start` })
    })

    test('it should exist', () => {
      expectChai(datePicker.exists()).to.be.true
    })

    test('should have correct attributes', () => {
      datePicker.prop('attributes').should.eql(expectedAttributes)
    })

    test('should place getDateFormatLocale return value to dateFormat prop', () => {
      datePicker.prop('dateFormat').should.eql(getDateFormatLocale(Stores.Locale.lang))
    })

    test('disabled should be same as readonly', () => {
      datePicker.prop('disabled').should.eql(Stores.Qvain.readonly)
    })

    describe('when triggering onChangeRaw', () => {
      const event = { target: { value: '2022-12-24' } }

      beforeEach(() => {
        datePicker.invoke('onChangeRaw')(event)
      })

      test('should call eventually changeAttribute via handleDateChangeRaw with propName and event.target.value', () => {
        expect(Field.changeAttribute).toHaveBeenCalledWith(expectedPropName, event.target.value)
      })
    })

    describe('when triggering onChange', () => {
      const date = { toISOString: jest.fn(() => '2022-12-23') }

      beforeEach(() => {
        datePicker.invoke('onChange')(date)
      })

      test('should call eventually changeAttribute with propName and date', () => {
        expect(Field.changeAttribute).toHaveBeenCalledWith(expectedPropName, '2022-12-23')
      })
    })
  })

  describe('ending date DatePicker', () => {
    let datePicker
    let mockDate
    const expectedPropName = 'endDate'

    const expectedAttributes = {
      ariaLabel: 'translationsRoot.datum.endInfoText',
    }

    beforeEach(() => {
      datePicker = wrapper.find(Translate).filter({ component: DatePicker, id: `${id}-end` })
    })

    test('it should exist', () => {
      expectChai(datePicker.exists()).to.be.true
    })

    test('should have correct attributes', () => {
      datePicker.prop('attributes').should.eql(expectedAttributes)
    })

    test('should place getDateFormatLocale return value to dateFormat prop', () => {
      datePicker.prop('dateFormat').should.eql(getDateFormatLocale(Stores.Locale.lang))
    })

    test('disabled should be same as readonly', () => {
      datePicker.prop('disabled').should.eql(Stores.Qvain.readonly)
    })

    describe('when triggering onChangeRaw', () => {
      const event = { target: { value: '2022-12-26' } }

      beforeEach(() => {
        datePicker.invoke('onChangeRaw')(event)
      })

      test('should call eventually changeAttribute via handleDateChangeRaw with propName and event.target.value', () => {
        expect(Field.changeAttribute).toHaveBeenCalledWith(expectedPropName, event.target.value)
      })
    })

    describe('when triggering onChange', () => {
      const date = { toISOString: jest.fn(() => '2022-12-25') }

      beforeEach(() => {
        datePicker.invoke('onChange')(date)
      })

      test('should call eventually changeAttribute with propName and date', () => {
        expect(Field.changeAttribute).toHaveBeenCalledWith(expectedPropName, '2022-12-25')
      })
    })
  })
})
