import { expect } from 'chai'
import { action, makeObservable } from 'mobx'

import Keywords from '../../../js/stores/view/qvain/qvain.keyword'

jest.mock('../../../js/stores/view/qvain/qvain.referenceField', () => {
  class mockReferenceField {
    constructor(...args) {
      this.constructorFunc(...args)
    }

    constructorFunc = jest.fn()

    reset = () => {}

    set = jest.fn()

    removeItemStr = jest.fn()

    itemStr = 'some, keywords'

    storage = []
  }

  return mockReferenceField
})

jest.mock('mobx', () => {
  return {
    ...jest.requireActual('mobx'),
    override: func => func,
    makeObservable: jest.fn(),
  }
})

describe('Keywords with args', () => {
  let keywords
  const Parent = {}
  const defaultStorageFactory = () => []
  const defaultItem = { some: 'initial data' }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('on creation', () => {
    beforeEach(() => {
      keywords = new Keywords(Parent, defaultStorageFactory, defaultItem)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    test('should call ReferenceField super with args', () => {
      expect(keywords.constructorFunc).to.have.beenCalledWith(
        Parent,
        defaultStorageFactory,
        defaultItem
      )
    })

    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(keywords)
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
      expect(keywords.removeItemStr).to.have.beenCalledTimes(1)
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
        expect(keywords.set).to.have.beenCalledWith(['data', 'some', 'keywords'])
      })

      test('should call removeItemStr', () => {
        expect(keywords.removeItemStr).to.have.beenCalled()
      })
    })
  })
})
