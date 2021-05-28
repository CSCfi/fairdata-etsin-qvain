import 'chai/register-expect'
import Harness from '../componentTestHarness'

import SubjectHeadings from '../../../js/components/qvain/fields/description/subjectHeadings'
import { useStores } from '../../../js/stores/stores'
import { LabelLarge } from '../../../js/components/qvain/general/modal/form'
import SearchSelect from '../../../js/components/qvain/general/input/searchSelect'

jest.mock('../../../js/stores/stores')

describe('given required mocked Stores', () => {
  const mockStores = {
    Qvain: {
      SubjectHeadings: {
        storage: ['storage'],
        set: () => 'set',
        Model: () => 'model',
      },
    },
  }

  const harness = new Harness(SubjectHeadings, {})

  describe('SubjectHeadings', () => {
    beforeEach(() => {
      useStores.mockReturnValue(mockStores)
      harness.shallow()
      harness.diveInto('SubjectHeadingsField')
      harness.storeWrapper('subjectHeadings')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    describe('LabelLarge', () => {
      beforeEach(() => {
        harness.find(LabelLarge)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have htmlFor:${SearchSelect.name}-select', () => {
        const select = harness.getWrapper('subjectHeadings').find('SearchSelect')
        const selectName = select.props().name
        harness.props.htmlFor.should.eql(`${selectName}-select`)
      })

      describe('<Translate content="qvain.description.subjectHeadings.title" />', () => {
        beforeEach(() => {
          harness.findWithProp('content', 'qvain.description.subjectHeadings.title')
        })

        test('should exist', () => {
          harness.shouldExist()
        })
      })
    })

    describe('<Translate component="p" content="qvain.description.subjectHeadings.help" />', () => {
      beforeEach(() => {
        harness.findWithProp('content', 'qvain.description.subjectHeadings.help')
      })
      test('should exist', () => {
        harness.shouldExist()
      })
    })

    describe('SearchSelect', () => {
      beforeEach(() => {
        harness.find(SearchSelect)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should include expected props', () => {
        const expectedProps = {
          metaxIdentifier: 'keyword',
          placeholder: 'qvain.description.subjectHeadings.placeholder',
          isMulti: true,
          isClearable: false,
          model: mockStores.Qvain.SubjectHeadings.Model,
          getter: mockStores.Qvain.SubjectHeadings.storage,
          setter: mockStores.Qvain.SubjectHeadings.set,
        }

        harness.shouldIncludeProps(expectedProps)
      })
    })
  })
})
