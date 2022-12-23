import { expect } from 'chai'
import { makeObservable } from 'mobx'
import SubjectHeadings, {
  SubjectHeadingModel,
} from '../../../js/stores/view/qvain/qvain.subjectHeadings'

jest.mock('../../../js/stores/view/qvain/qvain.referenceField', () => {
  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = jest.fn()

    reset = jest.fn()
  }

  return mockReferenceField
})

jest.mock('mobx', () => {
  return {
    ...jest.requireActual('mobx'),
    makeObservable: jest.fn(),
  }
})

describe('SubjectHeadings with args', () => {
  let subjectHeadings
  const args = ['some args', 'some other args']

  describe('on creation', () => {
    beforeEach(() => {
      subjectHeadings = new SubjectHeadings(...args)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should call ReferenceField super with args', () => {
      expect(subjectHeadings.constructorFunc).to.have.beenCalledWith(...args)
    })

    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(subjectHeadings)
    })
  })

  describe('when calling fromBackend with dataset', () => {
    const dataset = {
      theme: [
        {
          pref_label: 'name',
          identifier: 'url',
        },
      ],
    }

    beforeEach(() => {
      subjectHeadings.fromBackend(dataset)
    })

    test('should call super.reset', () => {
      expect(subjectHeadings.reset).to.have.beenCalledTimes(1)
    })

    test('should populate storage with modeled data', () => {
      const expectedData = [SubjectHeadingModel(...Object.values(dataset.theme[0]))]

      subjectHeadings.storage.should.eql(expectedData)
    })
  })
})
