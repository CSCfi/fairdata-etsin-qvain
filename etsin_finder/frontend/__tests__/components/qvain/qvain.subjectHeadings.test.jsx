import { expect } from 'chai'
import Harness from '../componentTestHarness'

import SubjectHeadings from '../../../js/components/qvain/sections/Description/SubjectHeadings'
import { useStores } from '../../../js/stores/stores'
import SearchSelect from '../../../js/components/qvain/general/V2/SearchSelect'
import { Title } from '../../../js/components/qvain/general/V2'

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

    describe('Title', () => {
      beforeEach(() => {
        harness.find(Title)
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

    describe('Infotext', () => {
      beforeEach(() => {
        harness.findWithProp('content', 'qvain.description.subjectHeadings.infoText')
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
