import Harness from '../componentTestHarness'
import { expect } from 'chai'
import '../../../locale/translations'

import IssuedDate from '@/components/qvain/sections/Description/IssuedDate'
import { useStores } from '../../../js/stores/stores'
import DatePicker from '../../../js/components/qvain/general/V2/Datepicker'
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
    harness.mount()
  })

  afterEach(() => {
    jest.clearAllMocks()
    harness.unmount()
  })

  describe('IssuedDate', () => {
    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have title', () => {
      expect(harness.wrapper.leafHostNodes().first().text()).to.equal('Issued date')
    })
  })

  describe('DatePicker', () => {
    beforeEach(() => {
      harness.find(DatePicker)
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
      harness.mount()
      harness.find(DatePicker)
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
    harness.mount()
  })

  afterEach(() => {
    jest.clearAllMocks()
    harness.unmount()
  })

  describe('IssuedDate', () => {
    beforeEach(() => {
      harness.find(IssuedDate)
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
