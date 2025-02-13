import Harness from '../componentTestHarness'

import LanguageField from '../../../js/components/qvain/sections/Description/Language'
import { useStores } from '../../../js/stores/stores'
import { Title, InfoText } from '@/components/qvain/general/V2'
import Select from '../../../js/components/qvain/general/V2/SearchSelect'

jest.mock('../../../js/stores/stores')

describe('given mockStores', () => {
  const mockStores = {
    Qvain: {
      DatasetLanguages: {
        storage: [],
        set: jest.fn(),
        Model: jest.fn(),
      },
    },
    Locale: { translate: v => v },
  }

  const harness = new Harness(LanguageField)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('LanguageField', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto('LanguageField')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'Label', findArgs: Title },
        {
          label: 'LabelContent',
          findArgs: { content: 'qvain.description.datasetLanguage.title' },
        },
        {
          label: 'InfoText',
          findArgs: { content: 'qvain.description.datasetLanguage.infoText' },
        },
        {
          label: 'Select',
          findArgs: Select,
        },
      ]

      const props = {
        Label: {
          htmlFor: 'dataset-language-select',
        },
        HelpText: {
          component: 'p',
        },
        Select: {
          name: 'dataset-language',
          id: 'datasetLanguage',
          getter: mockStores.Qvain.DatasetLanguages.storage,
          setter: mockStores.Qvain.DatasetLanguages.set,
          isMulti: true,
          isClearable: false,
          model: mockStores.Qvain.DatasetLanguages.Model,
          metaxIdentifier: 'language',
          search: true,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})
