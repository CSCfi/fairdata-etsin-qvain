import { makeObservable } from 'mobx'
import SubjectHeadings, {
  SubjectHeadingModel,
} from '../../../js/stores/view/qvain/qvain.subjectHeadings'

vi.mock('../../../js/stores/view/qvain/qvain.referenceField', () => {
  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = vi.fn()

    reset = vi.fn()
  }

  return { default: mockReferenceField }
})

vi.mock('mobx', async () => {
  return {
    ...(await vi.importActual('mobx')),
    makeObservable: vi.fn(),
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
      vi.clearAllMocks()
    })

    test('should call ReferenceField super with args', () => {
      expect(subjectHeadings.constructorFunc).toHaveBeenCalledWith(...args)
    })

    test('should call makeObservable', () => {
      expect(makeObservable).toHaveBeenCalledWith(subjectHeadings)
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
      expect(subjectHeadings.reset).toHaveBeenCalledTimes(1)
    })

    test('should populate storage with modeled data', () => {
      const expectedData = [SubjectHeadingModel(...Object.values(dataset.theme[0]))]

      subjectHeadings.storage.should.eql(expectedData)
    })
  })
})
