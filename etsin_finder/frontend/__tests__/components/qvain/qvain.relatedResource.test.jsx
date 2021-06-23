import Harness from '../componentTestHarness'
import 'chai/register-expect'

import { useStores } from '../../../js/stores/stores'
import RelatedResource from '../../../js/components/qvain/fields/history/relatedResource'
import RelatedResourceContent from '../../../js/components/qvain/fields/history/relatedResource/relatedResourceContent'
import { Field } from '../../../js/components/qvain/general/section'
import FieldList from '../../../js/components/qvain/general/section/fieldList'
import FieldListAdd from '../../../js/components/qvain/general/section/fieldListAdd'
import Form from '../../../js/components/qvain/fields/history/relatedResource/form'
import handleSave from '../../../js/components/qvain/fields/history/relatedResource/handleSave'
import TranslationTab from '../../../js/components/qvain/general/input/translationTab'
import ModalInput from '../../../js/components/qvain/general/modal/modalInput'
import { RelationType } from '../../../js/stores/view/qvain/qvain.relatedResources'
import modalSeparator from '../../../js/components/qvain/general/modal/modalSeparator'

jest.mock('../../../js/stores/stores')

jest.mock('../../../js/stores/view/qvain/qvain.submit.schemas')

const flushPromises = () => new Promise(setImmediate)

describe('given mockStores', () => {
  const mockStores = {
    Qvain: {
      RelatedResources: {
        inEdit: { name: { en: 'name' }, description: { en: 'description' }, relationType: {} },
        save: jest.fn(),
        clearInEdit: jest.fn(),
        setValidationError: jest.fn(),
        typeSchema: {
          validate: jest.fn(),
        },
        nameSchema: {
          validate: jest.fn(),
        },
      },
    },
    Locale: {
      lang: 'en',
      getMatchingLang: jest.fn(() => 'en'),
    },
  }

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('RelatedResource', () => {
    const harness = new Harness(RelatedResource)

    beforeEach(async () => {
      harness.shallow()
      await flushPromises()
      harness.diveInto('RelatedResource')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'Field', findArgs: Field },
        { label: 'Content', findArgs: RelatedResourceContent },
      ]

      const props = {
        Field: {
          brief: {
            title: 'qvain.history.relatedResource.title',
            description: 'qvain.history.relatedResource.description',
          },
        },
      }

      harness.shouldIncludeChildren(children, props)
    })

    describe('RelatedResourceContent', () => {
      beforeEach(() => {
        harness.restoreWrapper('Content')
        harness.dive()
      })

      test('should have children with expected properties', () => {
        const children = [
          { label: 'FieldList', findArgs: FieldList },
          { label: 'FieldListAdd', findArgs: FieldListAdd },
        ]
        const translationsRoot = 'qvain.history.relatedResource'

        const props = {
          FieldList: {
            Field: mockStores.Qvain.RelatedResources,
            lang: 'en',
            translationsRoot,
          },
          FieldListAdd: {
            translationsRoot,
            Store: mockStores.Qvain,
            Field: mockStores.Qvain.RelatedResources,
            Form: Form,
            handleSave: handleSave,
          },
        }

        harness.shouldIncludeChildren(children, props)
      })
    })
  })

  describe('Form', () => {
    const props = {
      Field: mockStores.Qvain.RelatedResources,
      translationsRoot: 'root',
    }

    const harness = new Harness(Form, props)

    beforeEach(async () => {
      harness.shallow()
      await flushPromises()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'TranslationsTab', findArgs: TranslationTab },
        { label: 'NameTab', findType: 'prop', findArgs: ['datum', 'name'] },
        { label: 'DescriptionTab', findType: 'prop', findArgs: ['datum', 'description'] },
        { label: 'Identifier', findArgs: ModalInput },
        { label: 'Separator', findArgs: modalSeparator },
        { label: 'EntityType', findType: 'prop', findArgs: ['datum', 'entityType'] },
        { label: 'RelationType', findType: 'prop', findArgs: ['datum', 'relationType'] },
      ]

      const props = {
        TranslationsTab: {
          language: 'en',
        },
        NameTab: {
          ...props,
          language: 'en',
          isRequired: true,
        },
        DescriptionTab: {
          ...props,
          language: 'en',
        },
        Identifier: {
          ...props,
          datum: 'identifier',
        },
        EntityType: {
          ...props,
          datum: 'entityType',
          metaxIdentifier: 'resource_type',
          model: RelationType,
        },
        RelationType: {
          ...props,
          datum: 'relationType',
          metaxIdentifier: 'relation_type',
          model: RelationType,
          isRequired: true,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })

  describe('When calling relatedResources.handleSave with Field and empty options', () => {
    const Field = mockStores.Qvain.RelatedResources

    beforeEach(async () => {
      handleSave(Field, {})
      await flushPromises()
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should call tameSchema.validate with inEdit.relationType', () => {
      expect(Field.typeSchema.validate).to.have.beenCalledWith(Field.inEdit.relationType, {
        strict: true,
      })
    })

    test('should call nameSchema.validate with inEdit.name', () => {
      expect(Field.nameSchema.validate).to.have.beenCalledWith(Field.inEdit.name, {
        strict: true,
      })
    })

    test('should populate name.und with name.en', () => {
      Field.inEdit.name.should.eql({ en: 'name', und: 'name' })
    })

    test('should call save', () => {
      expect(Field.save).to.have.beenCalled()
    })

    test('should call clearInEdit', () => {
      expect(Field.clearInEdit).to.have.beenCalled()
    })
  })
})
