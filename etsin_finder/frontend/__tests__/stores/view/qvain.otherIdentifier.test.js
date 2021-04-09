import 'chai/register-expect'
import { makeObservable } from 'mobx'

import OtherIdentifiers from '../../../js/stores/view/qvain/qvain.otherIdentifier'
import { otherIdentifierSchema } from '../../../js/components/qvain/utils/formValidation'

jest.mock('../../../js/stores/view/qvain/qvain.referenceField', () => {
  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = jest.fn()

    reset = jest.fn()

    addItemStr = jest.fn()

    setValidationError = jest.fn()
  }

  return mockReferenceField
})

jest.mock('mobx', () => {
  return {
    ...jest.requireActual('mobx'),
    makeObservable: jest.fn(),
  }
})

jest.mock('../../../js/components/qvain/utils/formValidation')

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
        otherIdentifierSchema.validateSync.mockReturnValue(undefined)
      })

      describe('when calling validateStr', () => {
        let returnValue
        beforeEach(() => {
          returnValue = otherIdentifiers.validateStr(itemStr)
        })

        test('should call otherIdentifierSchema.validateSync with itemStr', () => {
          expect(otherIdentifierSchema.validateSync).to.have.beenCalledWith(itemStr)
        })

        test('should return true', () => {
          returnValue.should.be.true
        })
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
      const error = new Error('error')

      beforeEach(() => {
        otherIdentifierSchema.validateSync.mockImplementation(() => {
          throw error
        })
      })

      describe('when calling validateStr', () => {
        let returnValue
        beforeEach(() => {
          returnValue = otherIdentifiers.validateStr()
        })

        test('should call setValidationError', () => {
          expect(otherIdentifiers.setValidationError).to.have.beenCalledWith(error.errors)
        })

        test('should return false', () => {
          returnValue.should.be.false
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

  describe('given itemStr that is in storage', () => {
    const storage = ['first']
    const itemStr = 'first'

    beforeEach(() => {
      otherIdentifiers.storage = storage
      otherIdentifiers.itemStr = itemStr
    })

    describe('when calling validateStr', () => {
      let returnValue
      beforeEach(() => {
        otherIdentifierSchema.validateSync.mockImplementation(() => undefined)
        returnValue = otherIdentifiers.validateStr()
      })

      test('should call setValidationError with alreadyAdded', () => {
        expect(otherIdentifiers.setValidationError).to.have.beenCalledWith(
          'qvain.description.otherIdentifiers.alreadyAdded'
        )
      })
      test('should return false', () => {
        returnValue.should.be.false
      })
    })
  })
})
