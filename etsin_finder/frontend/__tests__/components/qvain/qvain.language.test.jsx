import Harness from '../componentTestHarness'

import LanguageField from '../../../js/components/qvain/fields/description/language'
import { useStores } from '../../../js/stores/stores'
import { LabelLarge } from '../../../js/components/qvain/general/modal/form'
import Select from '../../../js/components/qvain/general/input/searchSelect'

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
        { label: 'Label', findArgs: LabelLarge },
        {
          label: 'LabelContent',
          findType: 'prop',
          findArgs: ['content', 'qvain.description.datasetLanguage.title'],
        },
        {
          label: 'HelpText',
          findType: 'prop',
          findArgs: ['content', 'qvain.description.datasetLanguage.help'],
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
          placeholder: 'qvain.description.datasetLanguage.placeholder',
          search: true,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})
