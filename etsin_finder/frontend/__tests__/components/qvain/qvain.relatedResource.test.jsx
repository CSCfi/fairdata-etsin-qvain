import Harness from '../componentTestHarness'
import { expect } from 'chai'
import Select from 'react-select/async'
import { setImmediate } from 'timers'

import { useStores } from '@/stores/stores'

import RelatedResource from '@/components/qvain/sections/Publications'
import RelatedResourceContent from '@/components/qvain/sections/Publications/RelatedResourceContent'
import ResourcesSearchField from '@/components/qvain/sections/Publications/PublicationForm/ResourceSearchField'
import PublicationForm from '@/components/qvain/sections/Publications/PublicationForm'
import PublicationDetails from '@/components/qvain/sections/Publications/PublicationForm/PublicationDetails'
import OtherResourceForm from '@/components/qvain/sections/Publications/OtherResourceForm'

import TranslationTab from '@/components/qvain/general/V2/TranslationTab'
import { RelationType } from '@/stores/view/qvain/qvain.relatedResources'
import { Title } from '@/components/qvain/general/V2'

jest.mock('@/stores/stores')

jest.mock('@/stores/view/qvain/qvain.submit.schemas')

const flushPromises = () => new Promise(setImmediate)

describe('given mockStores', () => {
  const mockStores = {
    Qvain: {
      RelatedResources: {
        inEdit: { name: { en: 'name' }, description: { en: 'description' }, relationType: {} },
        edit: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        clearInEdit: jest.fn(),
        setValidationError: jest.fn(),
        typeSchema: {
          validate: jest.fn(),
        },
        nameSchema: {
          validate: jest.fn(),
        },
        prefillInEdit: jest.fn(),
        create: jest.fn(),
        translationsRoot: 'translationsRoot',
        publications: [],
        otherResources: [],
        readonly: false,
        createPublication: jest.fn(),
        createOtherResource: jest.fn(),
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

    beforeEach(async () => {
      harness.shallow()
      await flushPromises()
      harness.diveInto('RelatedResource')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [{ label: 'Content', findArgs: RelatedResourceContent }]

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
      beforeEach(async () => {
        harness.shallow()
        await flushPromises()
        harness.diveInto('RelatedResource')
        harness.diveInto(RelatedResourceContent)
      })

      test('should have children with expected properties', () => {
        const { RelatedResources } = mockStores.Qvain
        const children = [
          {
            label: 'FieldListPublications',
            findArgs: { storage: RelatedResources.publications },
          },
          {
            label: 'FieldListAddPublication',
            findArgs: { onClick: RelatedResources.createPublication },
          },
          {
            label: 'FieldListOther',
            findArgs: { storage: RelatedResources.otherResources },
          },
          {
            label: 'FieldListAddOther',
            findArgs: { onClick: RelatedResources.createOtherResource },
          },
        ]

        harness.shouldIncludeChildren(children)
      })
    })

    describe('PublicationForm', () => {
      const props = {
        Field: mockStores.Qvain.RelatedResources,
      }

      const harness = new Harness(PublicationForm, props)

      beforeEach(async () => {
        harness.shallow()
        await flushPromises()
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have children with expected properties', () => {
        harness.diveInto(PublicationDetails)
        const children = [
          { label: 'TranslationsTab', findArgs: TranslationTab },
          { label: 'NameTab', findArgs: { datum: 'name' } },
          { label: 'DescriptionTab', findArgs: { datum: 'description' } },
          { label: 'RelationType', findArgs: { datum: 'relationType' } },
        ]

        const expectedProps = {
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

        harness.shouldIncludeChildren(children, expectedProps)
      })

      describe('ResourceSearchField', () => {
        beforeEach(() => {
          harness.diveInto(ResourcesSearchField)
        })

        test('should include children with properties', () => {
          const children = [
            { label: 'Title', findArgs: { component: Title } },
            { label: 'TranslatedSelect', findArgs: { component: Select } },
          ]

          const props = {
            TranslatedSelect: {
              component: Select,
              loadOptions: mockStores.CrossRef.search,
              onInputChange: mockStores.CrossRef.setTerm,
              defaultOptions: mockStores.CrossRef.defaultOptions,
              value: mockStores.CrossRef.term,
              isClearable: true,
            },
          }

          harness.shouldIncludeChildren(children, props)
        })

        describe('when triggering onChange with a selection', () => {
          beforeEach(() => {
            harness.diveInto({ component: Select })
            harness.wrapper.invoke('onChange')({ value: 'something' })
          })

          test('should call RelatedResource.prefillInEdit', () => {
            expect(mockStores.Qvain.RelatedResources.prefillInEdit).to.have.beenCalledWith(
              'something'
            )
          })
        })

        describe('when triggering onChange without selection', () => {
          beforeEach(() => {
            harness.diveInto({ component: Select })
            harness.wrapper.invoke('onChange')()
          })

          test('should not call RelatedResource.prefillInEdit or RelatedResource.create', () => {
            expect(mockStores.Qvain.RelatedResources.create).to.not.have.beenCalled()
            expect(mockStores.Qvain.RelatedResources.prefillInEdit).to.not.have.beenCalled()
          })
        })
      })
    })

    describe('OtherResourceForm', () => {
      const props = {
        Field: mockStores.Qvain.RelatedResources,
      }

      const harness = new Harness(OtherResourceForm, props)

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
          { label: 'NameTab', findArgs: { datum: 'name' } },
          { label: 'DescriptionTab', findArgs: { datum: 'description' } },
          { label: 'Identifier', findArgs: { datum: 'identifier' } },
          { label: 'EntityType', findArgs: { datum: 'entityType' } },
          { label: 'RelationType', findArgs: { datum: 'relationType' } },
        ]

        const expectedProps = {
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

        harness.shouldIncludeChildren(children, expectedProps)
      })
    })
  })
})
