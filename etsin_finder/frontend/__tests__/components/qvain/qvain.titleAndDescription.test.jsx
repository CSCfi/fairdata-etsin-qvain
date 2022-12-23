import Harness from '../componentTestHarness'
import { expect } from 'chai'
import translate from 'counterpart'

import TitleAndDescription from '@/components/qvain/sections/Description/TitleAndDescription'
import DescriptionFieldInput from '@/components/qvain/sections/Description/TitleAndDescription/DescriptionFieldInput'
import DescriptionFieldTextField from '@/components/qvain/sections/Description/TitleAndDescription/DescriptionFieldTextField'
import { useStores } from '@/stores/stores'
import TranslationTab from '@/components/qvain/general/V2/TranslationTab'
import { Title, FieldInput } from '@/components/qvain/general/V2'
import '@/../locale/translations'
import ValidationError from '@/components/qvain/general/errors/validationError'

describe('given Stores with required data', () => {
  const harness = new Harness(TitleAndDescription)

  const mockStores = {
    Locale: {
      getMatchingLang: jest.fn(() => 'en'),
    },
    Qvain: {
      Title: {
        value: 'titleValue',
      },
      Description: {
        value: 'descriptionValue',
      },
    },
  }

  beforeAll(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('Title and Description', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto('DescriptionField')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should call Locale.getMatchingLang with title.value, description.value', () => {
      expect(mockStores.Locale.getMatchingLang).to.have.beenCalledWith([
        mockStores.Qvain.Title.value,
        mockStores.Qvain.Description.value,
      ])
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'TranslationTab', findArgs: TranslationTab },
        { label: 'TitleInput', findArgs: DescriptionFieldInput },
        { label: 'DescriptionInput', findArgs: DescriptionFieldTextField },
        { label: 'Instructions', findType: 'prop', findArgs: ['component', 'div'] },
      ]

      const props = {
        TranslationTab: {
          language: 'en',
        },
        TitleInput: {
          propName: 'title',
          fieldName: 'Title',
          activeLang: 'en',
        },
        DescriptionInput: {
          activeLang: 'en',
        },
        Instructions: {
          content: 'qvain.description.description.instructions',
        },
      }

      harness.shouldIncludeChildren(children, props)
      harness.restoreWrapper('Instructions')
    })
  })
})

describe('given required props and Stores (noValidationError)', () => {
  const props = {
    propName: 'title',
    fieldName: 'Title',
    activeLang: 'en',
  }

  const Stores = {
    Qvain: {
      Title: {
        value: {
          en: 'value',
        },
        set: jest.fn(),
        validate: jest.fn(),
      },
      readonly: false,
    },
    Locale: {
      lang: 'en',
    },
  }

  beforeEach(() => {
    useStores.mockReturnValue(Stores)
  })

  const harness = new Harness(DescriptionFieldInput, props)

  describe('DescriptionFieldInput', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'Label', findArgs: Title },
        {
          label: 'LabelTranslation',
          findType: 'prop',
          findArgs: ['content', 'qvain.description.description.title.label'],
        },
        { label: 'input', findArgs: '#titleInput' },
      ]

      const expectedProps = {
        Label: {
          htmlFor: 'titleInput',
        },
        Input: {
          type: 'text',
          id: 'titleInput',
          disabled: false,
          value: 'value',
          onBlur: Stores.Qvain.Title.validate,
          attributes: { placeholder: 'qvain.description.description.title.placeholder.en' },
          required: true,
        },
      }

      harness.shouldIncludeChildren(children, expectedProps)
    })
  })

  describe('given additional validationError', () => {
    beforeEach(() => {
      Stores.Qvain.Title.validationError = 'validationError'
      useStores(Stores)
      harness.shallow(props)
    })

    test('should have ValidationError with text', () => {
      const component = { label: 'ValidationError', findArgs: ValidationError }
      harness.shouldIncludeChild(component)
      harness.children.text().should.include('validationError')
    })
  })
})
