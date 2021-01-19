import MultiLanguageField from '../../../js/stores/view/qvain/qvain.multiLanguageField'
import 'chai/register-should'

const defaultValue = { fi: '', en: '' }
const expectedTestValue = { fi: 'test value', en: '' }
const testValue = 'test value'
const testLang = 'fi'
const testError = 'test error'

describe('MultiLanguageField', () => {
  let multiLanguageField
  let mockStores

  beforeEach(() => {
    mockStores = {
      setChanged: jest.fn(),
    }
    multiLanguageField = new MultiLanguageField(mockStores)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('value should be set to default', () => {
    multiLanguageField.value.should.include(defaultValue)
  })

  describe('when calling set', () => {
    beforeEach(() => {
      multiLanguageField.setValidationError(testError)
      multiLanguageField.set(testValue, testLang)
    })

    test('should set value', () => {
      multiLanguageField.value.should.include(expectedTestValue)
    })

    test('should call Stores.setChanged with true', () => {
      expect(mockStores.setChanged).toHaveBeenCalledWith(true)
    })

    test('should set validationError to null', () => {
      expect(multiLanguageField.validationError).toBe(null)
    })
  })
})
