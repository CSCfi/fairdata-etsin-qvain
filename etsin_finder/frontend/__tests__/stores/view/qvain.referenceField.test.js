import ReferenceField from '../../../js/stores/view/qvain/qvain.referenceField'
import 'chai/register-should'

const testStr = 'testStr'
const testStr2 = 'testStr2'
const testError = 'test error'
const readonlyValue = 'readonly'

const toBackendStorage = [{ url: testStr }, { url: testStr2 }]
const expectedToBackendList = [testStr, testStr2]

describe('ReferenceField', () => {
  let referenceField
  let mockStores
  describe('default setup & reset', () => {
    beforeEach(() => {
      mockStores = { setChanged: jest.fn(), readonly: readonlyValue }
      referenceField = new ReferenceField(mockStores)
      referenceField.reset()
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    test('storage should be empty array', () => {
      referenceField.storage.should.be.an('array')
      referenceField.storage.should.be.empty
    })

    test('item should be undefined', () => {
      expect(referenceField.item).toEqual(undefined)
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
        expect(mockStores.setChanged).toHaveBeenCalledWith(true)
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
        expect(mockStores.setChanged).toHaveBeenCalledWith(true)
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
        expect(mockStores.setChanged).toHaveBeenCalledWith(true)
      })
    })

    describe('when calling setItemStr', () => {
      beforeEach(() => {
        referenceField.setItemStr(testStr)
      })

      test('itemStr should set to testStr', () => {
        referenceField.itemStr.should.be.string(testStr)
      })

      test('setChanged should not be called', () => {
        expect(mockStores.setChanged).not.toHaveBeenCalled()
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

      test('setChanged should not be called', () => {
        expect(mockStores.setChanged).not.toHaveBeenCalled()
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
        expect(mockStores.setChanged).toHaveBeenCalledTimes(2)
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
        expectedList.should.have.members(expectedToBackendList)
      })
    })
  })
})
