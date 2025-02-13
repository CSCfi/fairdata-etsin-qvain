import Harness from '../componentTestHarness'
import { expect } from 'chai'

import Keywords from '@/components/qvain/sections/Description/Keywords'
import { keywordsSchema } from '@/stores/view/qvain/qvain.keyword'
import { useStores } from '@/stores/stores'
import StringArray from '@/components/qvain/general/V2/StringArray'
import { Title } from '@/components/qvain/general/V2'

jest.mock('@/stores/stores')

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
      translate: v => v,
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
        { label: 'Label', findArgs: Title },
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
