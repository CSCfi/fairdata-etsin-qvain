import ReferenceField from '../../../js/stores/view/qvain/qvain.referenceField'
import { expect } from 'chai'

const testStr = 'testStr'
const testStr2 = 'testStr2'
const testError = 'test error'
const readonlyValue = 'readonly'

const toBackendStorage = [{ url: testStr }, { url: testStr2 }]
const expectedToBackendList = [{ identifier: testStr }, { identifier: testStr2 }]

describe('ReferenceField', () => {
  let referenceField
  let mockStores

  describe('default setup & reset', () => {
    beforeEach(() => {
      mockStores = { setChanged: jest.fn(), readonly: readonlyValue }
      referenceField = new ReferenceField(mockStores)
      referenceField.reset()
      referenceField.Schema = {
        validate: () => Promise.resolve(),
      }
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    test('storage should be empty array', () => {
      referenceField.storage.should.be.an('array')
      referenceField.storage.should.be.empty
    })

    test('item should be undefined', () => {
      expect(referenceField.item).to.be.undefined
    })

    test('itemStr should be empty string', () => {
      referenceField.itemStr.should.be.a('string')
    })

    test('readonly should return stores readonly value', () => {
      referenceField.readonly.should.be.string(readonlyValue)
    })

    describe('when calling add', () => {
      beforeEach(() => {
        referenceField.add(testStr)
      })

      test('should add item to a storage', () => {
        referenceField.storage.should.have.lengthOf(1)
        referenceField.storage.should.have.members([testStr])
      })

      test('should set changed to true', () => {
        expect(mockStores.setChanged).to.have.beenCalledWith(true)
      })
    })

    describe('when calling set', () => {
      beforeEach(() => {
        referenceField.set([testStr, testStr2])
      })

      test('should set storage with values', () => {
        referenceField.storage.should.have.lengthOf(2)
        referenceField.storage.should.have.members([testStr, testStr2])
      })

      test('should set changed to true', () => {
        expect(mockStores.setChanged).to.have.beenCalledWith(true)
      })
    })

    describe('when calling setItem', () => {
      beforeEach(() => {
        referenceField.setItem(testStr)
      })

      test('item should set to testStr', () => {
        referenceField.item.should.be.string(testStr)
      })

      test('setChanged should be called with true', () => {
        expect(mockStores.setChanged).to.have.beenCalledWith(true)
      })
    })

    describe('when calling setItemStr', () => {
      beforeEach(() => {
        referenceField.setItemStr(testStr)
      })

      test('itemStr should set to testStr', () => {
        referenceField.itemStr.should.be.string(testStr)
      })

      test('setChanged should be called with true', () => {
        expect(mockStores.setChanged).to.have.beenCalledWith(true)
      })
    })

    describe('when calling removeItemStr', () => {
      beforeEach(() => {
        referenceField.setItemStr(testStr)
        referenceField.removeItemStr()
      })

      test('itemStr should set to empty string', () => {
        referenceField.itemStr.should.be.string('')
      })
    })

    describe('given non-empty string, when calling addItemStr', () => {
      const testStr = 'test'
      beforeEach(() => {
        referenceField.setItemStr(testStr)
        referenceField.addItemStr()
      })

      test('should add string to storage', () => {
        referenceField.storage.should.include(testStr)
      })
    })

    describe('given empty string, when calling addItemStr', () => {
      beforeEach(() => {
        referenceField.setItemStr('')
        referenceField.addItemStr()
      })

      test('should add string to storage', () => {
        referenceField.storage.should.eql([])
      })
    })

    describe('when calling remove', () => {
      beforeEach(() => {
        referenceField.set([testStr, testStr2])
        referenceField.remove(testStr)
      })

      test('storage should only include testStr2', () => {
        referenceField.storage.should.have.members([testStr2])
        referenceField.storage.should.not.have.members([testStr])
      })

      test('setChanged should be called twice', () => {
        expect(mockStores.setChanged).to.have.beenCalledTimes(2)
      })
    })

    describe('when calling setValidationError', () => {
      beforeEach(() => {
        referenceField.setValidationError(testError)
      })

      test('validationError should set to testError', () => {
        referenceField.validationError.should.be.string(testError)
      })
    })

    describe('when calling toBackend', () => {
      beforeEach(() => {
        referenceField.set(toBackendStorage)
      })

      test('should return mapped storage', () => {
        const expectedList = referenceField.toBackend()
        expectedList.should.have.deep.members(expectedToBackendList)
      })
    })
  })

  describe('given itemStr that is not in storage', () => {
    const storage = ['first']
    const itemStr = 'second'

    beforeEach(() => {
      referenceField.storage = storage
      referenceField.itemStr = itemStr
    })

    describe('when validation passes', () => {
      describe('when calling validateStr', () => {
        let returnValue
        beforeEach(() => {
          returnValue = referenceField.validateStr(itemStr)
        })

        test('should return true', () => {
          returnValue.should.be.true
        })
      })

      describe('when validation fails', () => {
        const error = new Error('error')

        beforeEach(() => {
          referenceField.itemSchema = {
            validate: () => {
              throw error
            },
          }
        })

        describe('when calling validateStr', () => {
          let returnValue

          beforeEach(async () => {
            returnValue = await referenceField.validateStr()
          })

          test('should return false', () => {
            returnValue.should.be.false
          })
        })
      })
    })

    describe('given itemStr that is in storage', () => {
      const storage = ['first']
      const itemStr = 'first'

      beforeEach(() => {
        referenceField.translationsRoot = 'field'
        referenceField.itemSchema = {
          validateSync: () => {},
        }

        referenceField.storage = storage
        referenceField.itemStr = itemStr
      })

      describe('when calling validateStr', () => {
        let returnValue
        beforeEach(() => {
          returnValue = referenceField.validateStr()
        })

        test('should set validationError with field.alreadyAdded', () => {
          referenceField.validationError.should.eql('field.alreadyAdded')
        })

        test('should return false', () => {
          returnValue.should.be.false
        })
      })
    })
  })
})
