import Harness from '../componentTestHarness'
import 'chai/register-expect'
import Select from 'react-select/async'
import Translate from 'react-translate-component'

import { useStores } from '../../../js/stores/stores'
import RelatedResource from '../../../js/components/qvain/fields/history/relatedResource'
import RelatedResourceContent from '../../../js/components/qvain/fields/history/relatedResource/relatedResourceContent'
import { Field } from '../../../js/components/qvain/general/section'
import FieldList from '../../../js/components/qvain/general/section/fieldList'
import Form from '../../../js/components/qvain/fields/history/relatedResource/form'
import handleSave from '../../../js/components/qvain/fields/history/relatedResource/handleSave'
import TranslationTab from '../../../js/components/qvain/general/input/translationTab'
import ModalInput from '../../../js/components/qvain/general/modal/modalInput'
import { RelationType } from '../../../js/stores/view/qvain/qvain.relatedResources'
import modalSeparator from '../../../js/components/qvain/general/modal/modalSeparator'
import {
  relatedResourceNameSchema,
  relatedResourceTypeSchema,
} from '../../../js/components/qvain/utils/formValidation'
import ResourcesSearchField from '../../../js/components/qvain/fields/history/relatedResource/resourceSearchField'
import FieldListAdd from '../../../js/components/qvain/general/section/fieldListAdd'
import FlaggedComponent from '../../../js/components/general/flaggedComponent'

jest.mock('../../../js/stores/stores')

jest.mock('../../../js/components/qvain/utils/formValidation')

describe('given mockStores', () => {
  const mockStores = {
    Qvain: {
      RelatedResources: {
        inEdit: { name: { en: 'name' }, description: { en: 'description' }, relationType: {} },
        save: jest.fn(),
        clearInEdit: jest.fn(),
        setValidationError: jest.fn(),
        prefillInEdit: jest.fn(),
        create: jest.fn(),
        translationsRoot: 'translationsRoot',
      },
    },
    CrossRef: {
      search: jest.fn(),
      setTerm: jest.fn(),
      term: 'term',
      defaultOptions: [],
      translationPath: jest.fn(path => path),
    },
    Locale: {
      lang: 'en',
      getMatchingLang: jest.fn(() => 'en'),
    },
    Env: {
      Flags: {
        flagEnabled: jest.fn(() => true),
      },
    },
  }

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('RelatedResource', () => {
    const harness = new Harness(RelatedResource)

    beforeEach(() => {
      harness.shallow()
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
          { label: 'FlaggedComponent', findArgs: FlaggedComponent },
          { label: 'FieldListAdd', findArgs: FieldListAdd },
        ]

        const props = {
          FieldList: {
            Field: mockStores.Qvain.RelatedResources,
            lang: 'en',
            translationsRoot: mockStores.Qvain.RelatedResources.translationsRoot,
          },
          FieldListAdd: {
            translationsRoot: mockStores.Qvain.RelatedResources.translationsRoot,
            Store: mockStores.Qvain,
            Field: mockStores.Qvain.RelatedResources,
            Form,
            handleSave,
            hideButton: true,
          },
        }

        harness.shouldIncludeChildren(children, props)
      })
    })

    describe('FlaggedComponent', () => {
      beforeEach(() => {
        harness.restoreWrapper('FlaggedComponent')
      })

      test('should include children', () => {
        const children = [{ label: 'ResourceSearchField', findArgs: ResourcesSearchField }]

        harness.shouldIncludeChildren(children)
      })
    })

    describe('ResourceSearchField', () => {
      beforeEach(() => {
        harness.restoreWrapper('ResourceSearchField')
        harness.dive()
      })

      test('should include children with properties', () => {
        const children = [{ label: 'TranslatedSelect', findArgs: Translate }]

        const props = {
          TranslatedSelect: {
            component: Select,
            loadOptions: mockStores.CrossRef.search,
            onInputChange: mockStores.CrossRef.setTerm,
            defaultOptions: mockStores.CrossRef.defaultOptions,
            attributes: { placeholder: 'placeholder' },
            value: mockStores.CrossRef.term,
            isClearable: true,
          },
        }

        harness.shouldIncludeChildren(children, props)
      })

      describe("when triggering onChange with selection.value of 'create'", () => {
        beforeEach(() => {
          harness.trigger('change', { value: 'create' })
        })

        test('should call RelatedResource.create', () => {
          expect(mockStores.Qvain.RelatedResources.create).to.have.beenCalledWith()
        })
      })

      describe('when triggering onChange with selection.value of {}', () => {
        beforeEach(() => {
          harness.trigger('change', { value: {} })
        })

        test('should call RelatedResource.prefillInEdit', () => {
          expect(mockStores.Qvain.RelatedResources.prefillInEdit).to.have.beenCalledWith({})
        })
      })

      describe('when triggering onChange without selection', () => {
        beforeEach(() => {
          harness.trigger('change')
        })

        test('should not call RelatedResource.prefillInEdit or RelatedResource.create', () => {
          expect(mockStores.Qvain.RelatedResources.create).to.not.have.beenCalled()
          expect(mockStores.Qvain.RelatedResources.prefillInEdit).to.not.have.beenCalled()
        })
      })
    })
  })

  describe('Form', () => {
    const props = {
      Field: mockStores.Qvain.RelatedResources,
      translationsRoot: 'root',
    }

    const harness = new Harness(Form, props)

    beforeEach(() => {
      harness.shallow()
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

    beforeEach(() => {
      handleSave(Field, {})
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should call relatedResourceNameSchema.validate with inEdit.name', () => {
      expect(relatedResourceNameSchema.validate).to.have.beenCalledWith(Field.inEdit.name, {
        strict: true,
      })
    })

    test('should call relatedResourceTypeSchema', () => {
      expect(relatedResourceTypeSchema.validate).to.have.beenCalledWith(Field.inEdit.relationType, {
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
