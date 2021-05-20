import 'chai/register-expect'
import Harness from '../componentTestHarness'

import OtherIdentifier from '../../../js/components/qvain/fields/description/otherIdentifier'
import { useStores } from '../../../js/utils/stores'
import { LabelLarge } from '../../../js/components/qvain/general/modal/form'
import StringArray from '../../../js/components/qvain/general/input/stringArray'

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
        validate: jest.fn(),
        validateStr: jest.fn(),
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
          fieldName: 'OtherIdentifiers',
          addWithComma: true,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})
