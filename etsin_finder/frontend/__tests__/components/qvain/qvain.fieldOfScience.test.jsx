import Harness from '../componentTestHarness'
import { expect } from 'chai'

import FieldOfScienceField from '../../../js/components/qvain/sections/Description/FieldOfScience'
import { useStores } from '../../../js/stores/stores'
import { Title } from '../../../js/components/qvain/general/V2'

jest.mock('../../../js/stores/stores', () => ({
  withStores: Component => props => <Component Stores={mockStores} {...props} />,
  useStores: jest.fn(),
}))

describe('given mockStores', () => {
  const mockStores = {
    Qvain: {
      FieldOfSciences: {
        storage: [{ some: 'data' }],
        set: jest.fn(),
        Model: jest.fn(),
      },
    },
    Locale: { translate: v => v },
  }

  const harness = new Harness(FieldOfScienceField)

  describe('FieldOfScience', () => {
    beforeEach(() => {
      useStores.mockReturnValue(mockStores)
      harness.shallow()
      harness.diveInto('FieldOfScienceField')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'Label', findArgs: Title },
        {
          label: 'Title',
          findArgs: { content: 'qvain.description.fieldOfScience.title' },
        },
        {
          label: 'InfoText',
          findArgs: { content: 'qvain.description.fieldOfScience.infoText' },
        },
        { label: 'Select', findArgs: { name: 'fieldOfScience' } },
      ]

      const props = {
        Label: {
          htmlFor: 'fieldOfScience-select',
        },
        Select: {
          name: 'fieldOfScience',
          metaxIdentifier: 'field_of_science',
          isMulti: true,
          model: mockStores.Qvain.FieldOfSciences.Model,
          getter: mockStores.Qvain.FieldOfSciences.storage,
          setter: mockStores.Qvain.FieldOfSciences.set,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })

    describe('when calling getRefGroups with list of items', () => {
      let returnValue

      const list = [
        {
          id: 'parent id',
          parents: [],
          label: 'parent',
          value: 'parent url',
        },
        {
          parents: ['parent id'],
          label: 'child',
          value: 'child url',
        },
        {
          label: 'not in group',
          value: 'not in group url',
          parents: ['some other id'],
        },
      ]

      beforeEach(() => {
        mockStores.Qvain.FieldOfSciences.Model.mockImplementation((name, url) => ({ name, url }))
        harness.restoreWrapper('Select')
        returnValue = harness.props.getRefGroups(list)
      })

      test('should return groups', () => {
        const expectedReturn = [
          {
            name: 'parent',
            url: 'parent url',
            options: [
              {
                name: 'child',
                url: 'child url',
              },
            ],
          },
        ]

        returnValue.should.deep.eql(expectedReturn)
      })
    })

    describe('when calling modifyOptionLabel (addCode) with cohesive data', () => {
      test('should return matching code', () => {
        harness.restoreWrapper('Select')

        const translation = 'Hätäkeskus'
        const item = {
          url: 'some_url_that_has_number_in_the_end112',
        }

        const returnValue = harness.props.modifyOptionLabel(translation, item)
        returnValue.should.eql('112 Hätäkeskus')
      })
    })

    describe('when calling modifyOptionLabel (addCode) with data wihtout code', () => {
      test('should return matching code', () => {
        harness.restoreWrapper('Select')

        const translation = 'Hätäkeskus'
        const item = {
          url: 'some_url_that_has_no_number_in_the_end',
        }

        const returnValue = harness.props.modifyOptionLabel(translation, item)
        returnValue.should.eql('Hätäkeskus')
      })
    })
  })
})
