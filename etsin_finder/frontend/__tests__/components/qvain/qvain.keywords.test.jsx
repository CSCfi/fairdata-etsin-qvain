import Harness from '../componentTestHarness'
import 'chai/register-expect'

import Keywords from '../../../js/components/qvain/fields/description/keywords'
import { useStores } from '../../../js/stores/stores'
import { LabelLarge } from '../../../js/components/qvain/general/modal/form'
import Tooltip from '../../../js/components/general/tooltipHover'
import StringArray from '../../../js/components/qvain/general/input/stringArray'
import { keywordsSchema } from '../../../js/components/qvain/utils/formValidation'

jest.mock('../../../js/stores/stores')

describe('given mockStores', () => {
  const mockStores = {
    Qvain: {
      readonly: false,
      Keywords: {
        itemStr: '',
        setItemStr: jest.fn(),
        set: jest.fn(),
        addKeyword: jest.fn(),
        storage: [],
        validationError: '',
        setValidationError: jest.fn(),
      },
    },
    Locale: {
      lang: 'en',
    },
  }

  const harness = new Harness(Keywords)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Keywords', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto('KeywordsField')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'Label', findArgs: LabelLarge },
        { label: 'Tooltip', findType: 'prop', findArgs: ['component', Tooltip] },
        {
          label: 'Title',
          findType: 'prop',
          findArgs: ['content', 'qvain.description.keywords.title'],
        },
        {
          label: 'KeywordList',
          findArgs: StringArray,
        },
      ]

      const props = {
        Label: {
          htmlFor: 'keywords-input',
        },
        Tooltip: {
          position: 'right',
          attributes: {
            title: 'qvain.description.fieldHelpTexts.requiredToPublish',
          },
        },
        KeywordsList: {
          id: 'keywords-input',
          itemStr: mockStores.Qvain.Keywords.itemStr,
          setItemStr: mockStores.Qvain.Keywords.setItemStr,
          addItemStr: mockStores.Qvain.Keywords.addKeyword,
          value: mockStores.Qvain.Keywords.storage,
          set: mockStores.Qvain.Keywords.set,
          schema: keywordsSchema,
          addWithComma: true,
          readonly: false,
          translationsRoot: 'qvain.description.keywords',
          validationError: '',
          setValidationError: mockStores.Qvain.Keywords.setValidationError,
          required: true,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})
