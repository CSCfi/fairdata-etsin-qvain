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

    describe('when calling reset', () => {
      beforeEach(() => {
        testPromise = promiseManager.add(new Promise(() => {}))
        testPromise.cancel = jest.fn()
        promiseManager.reset()
      })

      test('should clear promises', () => {
        promiseManager.promises.should.eql([])
      })

      test('should call cancel on promises', () => {
        expect(testPromise.cancel).toHaveBeenCalledTimes(1)
      })
    })

    describe('given tagged promises', () => {
      beforeEach(() => {
        promiseManager.add(Promise.resolve(), 'fetchDatasets')
        promiseManager.add(Promise.resolve(), 'deleteDataset')
        promiseManager.add(Promise.resolve(), 'fetchDatasets')
      })

      test('should count all promises ', () => {
        promiseManager.count().should.eql(3)
      })

      test('should count promises matching tag', () => {
        promiseManager.count('fetchDatasets').should.eql(2)
      })
    })
  })
})
