import { makeObservable } from 'mobx'

import Keywords from '../../../js/stores/view/qvain/qvain.keyword'

vi.mock('../../../js/stores/view/qvain/qvain.referenceField', () => {
  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = vi.fn()

    reset = () => {}

    set = vi.fn()

    removeItemStr = vi.fn()

    itemStr = 'some, keywords'

    storage = []
  }

  return { default: mockReferenceField }
})

vi.mock('mobx', async () => {
  return {
    ...(await vi.importActual('mobx')),
    override: func => func,
    makeObservable: vi.fn(),
  }
})

describe('Keywords with args', () => {
  let keywords
  const Parent = {}
  const defaultStorageFactory = () => []
  const defaultItem = { some: 'initial data' }

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('on creation', () => {
    beforeEach(() => {
      keywords = new Keywords(Parent, defaultStorageFactory, defaultItem)
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    test('should call ReferenceField super with args', () => {
      expect(keywords.constructorFunc).toHaveBeenCalledWith(
        Parent,
        defaultStorageFactory,
        defaultItem
      )
    })

    test('should call makeObservable', () => {
      expect(makeObservable).toHaveBeenCalledWith(keywords)
    })
  })

  describe('when calling fromBackend with dataset', () => {
    const dataset = {
      keyword: ['data', 'other data'],
    }

    beforeEach(() => {
      keywords.fromBackend(dataset)
    })

    test('should call super.removeItemStr', () => {
      expect(keywords.removeItemStr).toHaveBeenCalledTimes(1)
    })

    test('should populate storage with keywords', () => {
      keywords.storage.should.eql(dataset.keyword)
    })
  })

  describe('given itemStr "some, keywords"', () => {
    describe('when calling addItemStr', () => {
      beforeEach(() => {
        keywords.storage = ['data']
        keywords.addItemStr()
      })

      test('should call set', () => {
        expect(keywords.set).toHaveBeenCalledWith(['data', 'some', 'keywords'])
      })

      test('should call removeItemStr', () => {
        expect(keywords.removeItemStr).toHaveBeenCalled()
      })
    })
  })
})
