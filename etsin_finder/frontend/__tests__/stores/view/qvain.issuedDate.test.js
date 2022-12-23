import { expect } from 'chai'
import moment from 'moment'
import { makeObservable } from 'mobx'

import IssuedDate, { issuedDateSchema } from '../../../js/stores/view/qvain/qvain.issuedDate'

jest.mock('../../../js/stores/view/qvain/qvain.singleValueField', () => {
  class mockSingleValueField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = jest.fn()
  }

  return mockSingleValueField
})

jest.mock('mobx', () => {
  return {
    ...jest.requireActual('mobx'),
    makeObservable: jest.fn(),
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
        expect(issuedDate.constructorFunc).to.have.beenCalledWith(
          Parent,
          issuedDateSchema,
          moment().format('YYYY-MM-DD')
        )
      })

      test('should call makeObservable', () => {
        expect(makeObservable).to.have.beenCalledWith(issuedDate)
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
        expect(issuedDate.value).to.be.undefined
      })
    })
  })
})
