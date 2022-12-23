import { configure } from 'mobx'
import Field from '../../../js/stores/view/qvain/qvain.field'

const readonly = 'read only'
const testUiid = 'uiid'
const testModel = data => ({ uiid: testUiid, test: data.test })
const templateObj = { uiid: testUiid, test: 'test' }
const Template = () => templateObj
const testError = 'test error'
const testAttributeName = 'test'
const newAttributeValue = 'changed value'

const multiLangFiValue = 'some value'
const multiLanguageValue = { fi: multiLangFiValue }
const multiLanguageAttributeName = 'multiLangTest'

const testData = [{ test: 'test' }]

describe('Field', () => {
  let field
  let mockStores

  beforeEach(() => {
    mockStores = { readonly, setChanged: jest.fn() }
    configure({ safeDescriptors: false })
    field = new Field(mockStores, Template, testModel)
    configure({ safeDescriptors: true })
  })

  test('storage should be empty array', () => {
    field.storage.should.eql([])
  })

  test('readonly should return Stores.readonly', () => {
    field.readonly.should.be.string(readonly)
  })

  describe('when calling reset', () => {
    beforeEach(() => {
      field.storage = ['some stuff']
      field.hasChanged = true
      field.editMode = true
      field.inEdit = 'in edit'
      field.validationError = testError
      field.reset()
    })

    test('should set storage to an empty array', () => {
      field.storage.should.eql([])
    })

    test('should set hasChanged to false', () => {
      field.hasChanged.should.be.false
    })

    test('should set editMode to false', () => {
      field.editMode.should.be.false
    })

    test('should set inEdit to undefined', () => {
      expect(field.inEdit).toBe(undefined)
    })

    test('should set validationError to undefined', () => {
      expect(field.validationError).toBe(undefined)
    })
  })

  describe('when calling setChanged', () => {
    beforeEach(() => {
      field.setChanged(true)
    })

    test('should set hasChanged to true', () => {
      field.hasChanged.should.be.true
    })
  })

  describe('when calling create', () => {
    beforeEach(() => {
      field.hasChanged = true
      field.editMode = true
      field.validationError = testError
      field.create()
    })

    test('should set hasChanged to false', () => {
      field.hasChanged.should.be.false
    })

    test('should set editMode to false', () => {
      field.editMode.should.be.false
    })

    test('should set inEdit as template object', () => {
      field.inEdit.should.include(templateObj)
    })

    test('should set validationError to undefined', () => {
      expect(field.validationError).toBe(undefined)
    })
  })

  describe('when calling changeeAttribute', () => {
    beforeEach(() => {
      field.create()
      field.changeAttribute(testAttributeName, newAttributeValue)
    })

    test('should set hasChanged to true', () => {
      field.hasChanged.should.be.true
    })

    test("should populate inEdit's attribute with new value", () => {
      field.inEdit[testAttributeName].should.be.string(newAttributeValue)
    })
  })

  describe('when calling save to a new item', () => {
    let inEditElement
    beforeEach(() => {
      field.create()
      field.changeAttribute(multiLanguageAttributeName, multiLanguageValue)
      field.validationError = testError
      inEditElement = field.inEdit
      field.save()
    })

    test('should set hasChanged to false', () => {
      field.hasChanged.should.be.false
    })

    test('should set editMode to false', () => {
      field.editMode.should.be.false
    })

    test('should set validationError to empty string', () => {
      field.validationError.should.be.string('')
    })

    test('should populate storage with clone of inEdit element', () => {
      field.storage.should.deep.include(inEditElement)
    })
  })

  describe('save existing inEdit element', () => {
    let inEditElement
    beforeEach(() => {
      field.create()
      field.save()
      field.changeAttribute(multiLanguageAttributeName, multiLanguageValue)
      field.validationError = testError
      inEditElement = field.inEdit
      field.save()
    })
    test('should set validationError to empty string', () => {
      field.validationError.should.be.string('')
    })

    test('should set new version of the inEdit element to storage', () => {
      field.storage.should.have.lengthOf(1)
      field.storage.should.deep.include(inEditElement)
    })
  })

  describe('when calling clearInEdit', () => {
    beforeEach(() => {
      field.create()
      field.validationError = testError
      field.hasChanged = true
      field.clearInEdit()
    })

    test('should set validationError to empty string', () => {
      field.validationError.should.be.string('')
    })

    test('should set hasChanged to false', () => {
      field.hasChanged.should.be.false
    })

    test('should set editMode to false', () => {
      field.editMode.should.be.false
    })

    test('should set inEdit to undefined', () => {
      expect(field.inEdit).toBe(undefined)
    })
  })

  describe('when calling remove with existing uiid', () => {
    beforeEach(() => {
      field.create()
      field.save()
      field.remove(testUiid)
    })

    test('storage should be empty', () => {
      field.storage.should.eql([])
    })
  })

  describe('when calling edit with existing uiid', () => {
    let expectedElement
    beforeEach(() => {
      field.create()
      field.save()
      expectedElement = field.storage[0]
      field.validationError = testError
      field.hasChanged = true
      field.editMode = false
      field.edit(testUiid)
    })

    test('should set validationError to empty string', () => {
      field.validationError.should.be.string('')
    })

    test('should call parent.setCganged with true', () => {
      expect(mockStores.setChanged).toHaveBeenCalledWith(true)
    })

    test('should set hasChanged to false', () => {
      field.hasChanged.should.be.false
    })

    test('should call Parent setChanged with true', () => {
      expect(mockStores.setChanged).toHaveBeenCalledWith(true)
    })

    test('should set editMode to true', () => {
      field.editMode.should.be.true
    })

    test('should set inEdit element searching element from the storage by using uiid', () => {
      field.inEdit.should.eql(expectedElement)
    })
  })

  describe('when calling setValidationError', () => {
    beforeEach(() => {
      field.setValidationError(testError)
    })

    test('should set validationError', () => {
      field.validationError.should.be.string(testError)
    })
  })

  describe('when calling fromBackendBase', () => {
    beforeEach(() => {
      field.fromBackendBase(testData, mockStores)
    })

    test('should add net item to storage', () => {
      field.storage.should.eql([templateObj])
    })
  })

  describe('when calling detachRefs', () => {
    let originalObj
    let detachedRefs
    const refs = ['testRef']

    beforeEach(() => {
      originalObj = { ...templateObj, testRef: { test: 'test' } }
      field.references = refs
      detachedRefs = field.detachRefs(originalObj)
    })

    test('should return refs based on the list of ref names', () => {
      const expectedRefs = { testRef: { test: 'test' } }
      detachedRefs.should.eql(expectedRefs)
    })

    test('original object should not include refs', () => {
      expect(originalObj.testRef).toBe(undefined)
    })
  })

  describe('when calling attachRefs', () => {
    let originalObj
    const refs = { testRef: { test: 'test' } }
    const refsList = ['testRef']
    beforeEach(() => {
      originalObj = { test: 'test' }
      field.references = refsList
      field.attachRefs(refs, originalObj)
    })

    test('should attach refs to object', () => {
      originalObj.testRef.should.equal(refs.testRef)
    })
  })

  describe('when calling cloneRefs', () => {
    const item = { testRef: { clone: jest.fn() } }
    beforeEach(() => {
      field.references = ['testRef']
      field.cloneRefs(item)
    })

    test('should call clone of the refs listed on field.references', () => {
      expect(item.testRef.clone).toHaveBeenCalledTimes(1)
    })
  })

  describe('when calling validateAndSave, on successful validation', () => {
    let inEdit

    beforeEach(async () => {
      field.create()
      inEdit = { ...field.inEdit }
      jest.spyOn(field.schema, 'validate')
      jest.spyOn(field, 'save')
      jest.spyOn(field, 'clearInEdit')
      await field.validateAndSave()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('should call schema with Field.inEdit', () => {
      expect(field.schema.validate).toHaveBeenCalledWith(
        inEdit,
        expect.objectContaining({ strict: true })
      )
    })

    test('should call field.save', () => {
      expect(field.save).toHaveBeenCalledWith()
    })

    test('should call field.clearInEdit', () => {
      expect(field.clearInEdit).toHaveBeenCalledWith()
    })
  })

  describe('when calling validateAndSave, on failing validation', () => {
    const error = {
      message: 'hello',
    }

    beforeEach(async () => {
      jest.spyOn(field.schema, 'validate')
      jest.spyOn(field, 'setValidationError')
      field.schema.validate.mockReturnValue(Promise.reject(error))
      await field.validateAndSave()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('should call setValidationError', () => {
      expect(field.setValidationError).toHaveBeenCalledWith(error.message)
    })
  })
})
