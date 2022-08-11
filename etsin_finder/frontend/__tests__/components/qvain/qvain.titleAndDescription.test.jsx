import Harness from '../componentTestHarness'
import 'chai/register-expect'
import translate from 'counterpart'

import TitleAndDescription from '../../../js/components/qvain/fields/description/titleAndDescription'
import { useStores } from '../../../js/stores/stores'
import TranslationTab from '../../../js/components/qvain/general/input/translationTab'
import DescriptionFieldInput from '../../../js/components/qvain/fields/description/titleAndDescription/descriptionFieldInput'
import DescriptionFieldTextField from '../../../js/components/qvain/fields/description/titleAndDescription/descriptionFieldTextField'
import Tooltip from '../../../js/components/general/tooltipHover'
import '../../../locale/translations'
import { Input, LabelLarge } from '../../../js/components/qvain/general/modal/form'
import ValidationError from '../../../js/components/qvain/general/errors/validationError'

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
          propName: 'description',
          fieldName: 'Description',
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
        { label: 'Label', findArgs: LabelLarge },
        { label: 'Tooltip', findArgs: Tooltip },
        {
          label: 'LabelTranslation',
          findType: 'prop',
          findArgs: ['content', 'qvain.description.description.title.label'],
        },
        { label: 'Input', findType: 'prop', findArgs: ['component', Input] },
      ]

      const expectedProps = {
        Label: {
          htmlFor: 'titleInput',
        },
        Tooltip: {
          title: translate('qvain.description.fieldHelpTexts.requiredForAll', {
            locale: props.activeLang,
          }),
          position: 'right',
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
