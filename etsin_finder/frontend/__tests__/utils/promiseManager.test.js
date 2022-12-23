import 'chai/register-should'
import PromiseManager from '../../js/utils/promiseManager'

describe('common.files.utils', () => {
  describe('PromiseManager', () => {
    let promiseManager
    let testPromise

    beforeEach(() => {
      promiseManager = new PromiseManager()
    })

    test('promises should be empty array', () => {
      promiseManager.promises.should.eql([])
    })

    describe('when calling add', () => {
      beforeEach(() => {
        testPromise = promiseManager.add(new Promise(jest.fn()))
      })

      test('should add promise to promises', () => {
        promiseManager.promises.should.eql([testPromise])
      })
    })

    describe('when added promise resolves', () => {
      beforeEach(async () => {
        testPromise = Promise.resolve()
        promiseManager.add(testPromise)
        await testPromise
      })

      test('should remove promise from promises array', () => {
        promiseManager.promises.should.eql([])
      })
    })

    describe('given tagged promises', () => {
      const resolvers = []

      const resolveAll = () => resolvers.forEach(f => f())

      const newPromise = () => {
        const p = new Promise(resolve => {
          resolvers.push(resolve)
        })
        return p
      }

      beforeEach(() => {
        resolvers.length = 0
        promiseManager.add(newPromise(), 'fetchDatasets')
        promiseManager.add(newPromise(), 'deleteDataset')
        promiseManager.add(newPromise(), 'fetchDatasets')
      })

      afterEach(() => {
        resolveAll()
        resolvers.length = 0
      })

      test('should count all promises', () => {
        promiseManager.count().should.eql(3)
      })

      test('should remove resolved promises', async () => {
        resolveAll()
        await Promise.resolve()
        promiseManager.count().should.eql(0)
      })

      test('should count promises matching tag', () => {
        promiseManager.count('fetchDatasets').should.eql(2)
      })
    })
  })
})
