import {
  assignDefined,
  ChildItemCounter,
  getAction,
  ignoreNotFound,
} from '@/stores/view/common.files.utils'

function fail(message) {
  throw new Error(message)
}

describe('common.files.utils', () => {
  describe('ChildItemCounter', () => {
    let childItemCounter
    let expectedRoot = { directories: {}, count: 0 }

    beforeEach(() => {
      childItemCounter = new ChildItemCounter()
    })

    test('root should default to empty directories and count 0', () => {
      childItemCounter.root.should.eql(expectedRoot)
    })

    describe('when calling inc with non-existent path', () => {
      beforeEach(() => {
        childItemCounter.inc('/path/to/nowhere/')
      })

      test('should add path to root', () => {
        const expectedRoot = {
          directories: {
            path: {
              directories: {
                to: {
                  directories: {
                    nowhere: {
                      directories: {},
                      count: 1,
                    },
                  },
                  count: 1,
                },
              },
              count: 1,
            },
          },
          count: 1,
        }
        childItemCounter.root.should.deep.eql(expectedRoot)
      })
    })

    describe('when calling count with non-existent path', () => {
      let result

      beforeEach(() => {
        result = childItemCounter.count('/path/to/nowhere/')
      })

      test('should return 0', () => {
        result.should.equal(0)
      })
    })

    describe('when calling count with existent path', () => {
      let result
      const addedPath = '/path/to/somewhere/'
      const addedPath2 = '/path/to/somewhere/else'
      const countPath = '/path/to/somewhere'

      beforeEach(() => {
        childItemCounter.inc(addedPath)
        childItemCounter.inc(addedPath2)
        result = childItemCounter.count(countPath)
      })

      test('should return count of children', () => {
        result.should.equal(2)
      })
    })
  })

  describe('when calling ignoreNotFound with resolving Promise', () => {
    let testPromise
    let resolve = 'resolved'
    let result

    beforeEach(async () => {
      testPromise = Promise.resolve(resolve)
      result = await ignoreNotFound(testPromise)
    })

    test('should return resolved promise', () => {
      result.should.be.string(resolve)
    })
  })

  describe('when calling ignoreNotFound with rejecting Promise (generic Error)', () => {
    const reject = new Error('test error')
    const getTestPromise = () => Promise.reject(reject)

    test('should re-throw error', async () => {
      let result
      try {
        result = await ignoreNotFound(getTestPromise())
        fail('should not get here!')
      } catch (err) {
        err.should.eql(reject)
        expect(result).toBe(undefined)
      }
    })
  })

  describe('when calling ignoreNotFound with rejecting Promise (response 404)', () => {
    const getTestPromise = () => Promise.reject({ response: { status: 404 } })
    const defaultResponse = 'default response'

    test('should return defaultResponse', async () => {
      try {
        const result = await ignoreNotFound(getTestPromise(), defaultResponse)
        result.should.be.string(defaultResponse)
      } catch {
        fail('should not throw error')
      }
    })
  })

  describe('when calling getAction with object of no adds or removes', () => {
    const directory = { parent: { parent: {} } }
    const expected = { added: false, removed: false }

    test('should return added and removed false', () => {
      const result = getAction(directory)
      result.should.eql(expected)
    })
  })

  describe('when calling getAction with object of adds but no removes', () => {
    const directory = { parent: { parent: { added: true } } }
    const expected = { added: true, removed: false }

    test('should return added true and removed false', () => {
      const result = getAction(directory)
      result.should.eql(expected)
    })
  })

  describe('when calling getAction with object of no adds but removes', () => {
    const directory = { parent: { parent: { removed: true } } }
    const expected = { added: false, removed: true }

    test('should return added false and removed true', () => {
      const result = getAction(directory)
      result.should.eql(expected)
    })
  })

  describe('when calling assignDefined with populated object and partly defined values', () => {
    const obj = { test: 'test', test2: 'test2' }
    const values = { test: null, test2: 'something different', test3: 'something new' }
    const expected = { test: 'test', test2: 'something different', test3: 'something new' }

    test('should assign defined properties from values to object', () => {
      assignDefined(obj, values)
      obj.should.eql(expected)
    })
  })
})
