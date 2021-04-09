import 'chai/register-expect'
import Harness from '../componentTestHarness'

import OtherIdentifier from '../../../js/components/qvain/fields/description/otherIdentifier'
import { useStores } from '../../../js/utils/stores'
import { LabelLarge } from '../../../js/components/qvain/general/modal/form'
import StringArray from '../../../js/components/qvain/general/input/stringArray'
import {
  otherIdentifiersArraySchema,
  otherIdentifierSchema,
} from '../../../js/components/qvain/utils/formValidation'

jest.mock('../../../js/stores/stores')

describe('given mockStores', () => {
  const mockStores = {
    Qvain: {
      OtherIdentifiers: {
        storage: [],
        itemStr: '',
        addItemStr: jest.fn(),
        setItemStr: jest.fn(),
        set: jest.fn(),
        readonly: false,
        validationError: '',
        setValidationError: jest.fn(),
      },
    },
  }

  const harness = new Harness(OtherIdentifier)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('OtherIdentifier', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto('OtherIdentifierField')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'Label', findArgs: LabelLarge },
        {
          label: 'Title',
          findType: 'prop',
          findArgs: ['content', 'qvain.description.otherIdentifiers.title'],
        },
        {
          label: 'Instructions',
          findType: 'prop',
          findArgs: ['content', 'qvain.description.otherIdentifiers.instructions'],
        },
        { label: 'OtherIdentifiersList', findArgs: StringArray },
      ]

      const props = {
        Label: {
          htmlFor: 'other-identifiers-input',
        },
        Instructions: {
          component: 'p',
        },
        OtherIdentifiersList: {
          id: 'other-identifiers-input',
          itemStr: '',
          setItemStr: mockStores.Qvain.OtherIdentifiers.setItemStr,
          addItemStr: mockStores.Qvain.OtherIdentifiers.addItemStr,
          itemSchema: otherIdentifierSchema,
          value: mockStores.Qvain.OtherIdentifiers.storage,
          set: mockStores.Qvain.OtherIdentifiers.set,
          schema: otherIdentifiersArraySchema,
          addWithComma: true,
          readonly: false,
          translationsRoot: 'qvain.description.otherIdentifiers',
          validationError: '',
          setValidationError: mockStores.Qvain.OtherIdentifiers.setValidationError,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})
