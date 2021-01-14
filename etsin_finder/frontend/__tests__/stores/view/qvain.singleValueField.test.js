import SingleValueField from '../../../js/stores/view/qvain/qvain.singleValueField'
import 'chai/register-should'

const testValue = 'test value'
const defaultValue = 'default value'
const readonly = 'read only'
const error = 'error'

describe('SingleValueField', () => {
  let singleValueField
  let mockStores
  const schema = 'schema'

  beforeEach(() => {
    mockStores = { setChanged: jest.fn(), readonly }
    singleValueField = new SingleValueField(mockStores, schema, defaultValue)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('value should be defaultValue', () => {
    expect(singleValueField.value).toBe(defaultValue)
  })

  test('readonly should return Stores.readonly', () => {
    singleValueField.readonly.should.be.string(readonly)
  })

  describe('when calling set', () => {
    beforeEach(() => {
      singleValueField.set(testValue)
    })

    test('sets value', () => {
      singleValueField.value.should.be.string(testValue)
    })

    test('Stores.setChanged should have been called with true', () => {
      expect(mockStores.setChanged).toHaveBeenCalledWith(true)
    })

    test('toBackend should return value', () => {
      const toBackendValue = singleValueField.toBackend()
      toBackendValue.should.be.string(testValue)
    })
  })

  describe('when calling reset', () => {
    beforeEach(() => {
      singleValueField.reset()
    })

    test('value should be default value', () => {
      singleValueField.value.should.be.string(defaultValue)
    })
  })

  describe('when calling setValidationError', () => {
    beforeEach(() => {
      singleValueField.setValidationError(error)
    })

    test('should set validationError', () => {
      singleValueField.validationError.should.be.string(error)
    })
  })
})
