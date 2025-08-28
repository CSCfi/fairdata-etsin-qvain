import moment from 'moment'
import { makeObservable } from 'mobx'

import IssuedDate, { issuedDateSchema } from '../../../js/stores/view/qvain/qvain.issuedDate'

vi.mock('../../../js/stores/view/qvain/qvain.singleValueField', () => {
  class mockSingleValueField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = vi.fn()
  }

  return { default: mockSingleValueField }
})

vi.mock('mobx', async () => {
  return {
    ...(await vi.importActual('mobx')),
    makeObservable: vi.fn(),
  }
})

describe('given Parent object', () => {
  const Parent = {
    some: 'data',
  }

  describe('IssuedDate', () => {
    let issuedDate
    beforeEach(() => {
      issuedDate = new IssuedDate(Parent)
    })

    describe('when constructor is called', () => {
      test('should call super.constructor with Parent and schema', () => {
        expect(issuedDate.constructorFunc).toHaveBeenCalledWith(
          Parent,
          issuedDateSchema,
          moment().format('YYYY-MM-DD')
        )
      })

      test('should call makeObservable', () => {
        expect(makeObservable).toHaveBeenCalledWith(issuedDate)
      })
    })

    describe('when fromBackend is called with dataset.issued', () => {
      const dataset = {
        issued: 'value',
      }

      beforeEach(() => {
        issuedDate.fromBackend(dataset)
      })

      test('should set value to value', () => {
        issuedDate.value.should.eql('value')
      })
    })

    describe('when fromBackend is called with issued: ""', () => {
      const dataset = {
        issued: '',
      }

      beforeEach(() => {
        issuedDate.fromBackend(dataset)
      })

      test('should set value to undefined', () => {
        expect(issuedDate.value).toBeUndefined()
      })
    })
  })
})
