import { expect } from 'chai'
import { makeObservable } from 'mobx'

import OtherIdentifiers from '../../../js/stores/view/qvain/qvain.otherIdentifier'

jest.mock('../../../js/stores/view/qvain/qvain.referenceField', () => {
  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = jest.fn()

    reset = jest.fn()

    addItemStr = jest.fn()

    setValidationError = jest.fn()

    validate = jest.fn()

    validateStr = jest.fn()
  }

  return mockReferenceField
})

jest.mock('mobx', () => {
  return {
    ...jest.requireActual('mobx'),
    makeObservable: jest.fn(),
  }
})

jest.mock('../../../js/stores/view/qvain/qvain.submit.schemas')

describe('OtherIdentifiers', () => {
  let otherIdentifiers
  const args = ['some', 'data']

  beforeEach(() => {
    otherIdentifiers = new OtherIdentifiers(...args)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when calling costructor with any args', () => {
    test('should call super.constructor with args', () => {
      expect(otherIdentifiers.constructorFunc).to.have.beenCalledWith(...args)
    })

    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(otherIdentifiers)
    })
  })

  describe('when calling fromBackend with dataset', () => {
    const dataset = {
      other_identifier: [{ notation: 'first' }, { notation: 'second' }],
    }

    beforeEach(() => {
      otherIdentifiers.fromBackend(dataset)
    })

    test('should populate storage with mapped otherIdentifier.notation', () => {
      otherIdentifiers.storage.should.eql(['first', 'second'])
    })

    test('should call super.reset', () => {
      expect(otherIdentifiers.reset).to.have.beenCalled()
    })
  })

  describe('given itemStr that is not in storage', () => {
    const storage = ['first']
    const itemStr = 'second'

    beforeEach(() => {
      otherIdentifiers.storage = storage
      otherIdentifiers.itemStr = itemStr
    })

    describe('when validation passes', () => {
      beforeEach(() => {
        otherIdentifiers.validateStr.mockReturnValue(true)
      })

      describe('when calling cleanupBeforeBackend', () => {
        let returnValue

        beforeEach(() => {
          returnValue = otherIdentifiers.cleanupBeforeBackend()
        })

        test('should call super.addItemStr', () => {
          expect(otherIdentifiers.addItemStr).to.have.beenCalled()
        })

        test('should return true', () => {
          returnValue.should.be.true
        })
      })
    })

    describe('when validation fails', () => {
      beforeEach(() => {
        otherIdentifiers.validateStr.mockReturnValue(false)
      })

      describe('when calling cleanupBeforeBackend', () => {
        let returnValue

        beforeEach(() => {
          returnValue = otherIdentifiers.cleanupBeforeBackend()
        })

        test('should return false', () => {
          returnValue.should.be.false
        })
      })
    })
  })
})
