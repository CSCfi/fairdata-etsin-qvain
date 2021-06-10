import 'chai/register-expect'
import CrossRef from '../../../js/stores/view/qvain/qvain.crossRef'
import axios from 'axios'
import urls from '../../../js/utils/urls'

jest.mock('axios')

describe('CrossRef', () => {
  const crossRef = new CrossRef()
  const cancelMockFunc = jest.fn()
  let originalCancel

  beforeAll(() => {
    crossRef.prevRequest = {}
    originalCancel = Object.prototype.cancel

    Object.defineProperty(Object.prototype, 'cancel', {
      value: cancelMockFunc,
      writable: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    Object.defineProperty(Object.prototype, 'cancel', {
      value: originalCancel,
      writable: true,
    })
  })

  describe('when calling search with empty string', () => {
    let returnValue
    beforeEach(async () => {
      returnValue = await crossRef.search('')
    })

    test('should call cancel on prevRequest', () => {
      expect(cancelMockFunc).to.have.beenCalledWith()
    })

    test('should not call axios.get', () => {
      expect(axios.get).to.not.have.beenCalled()
    })

    test('should clear results', () => {
      returnValue.should.eql(crossRef.defaultOptions)
    })
  })

  describe('when calling setTerm with string longer than 3 char', () => {
    beforeEach(() => {
      crossRef.setTerm('test')
    })

    test('should set term', () => {
      crossRef.term.should.eql('test')
    })

    describe('when calling search', () => {
      let returnValue
      const mockRequest = { token: 'token' }

      beforeEach(async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve())

        axios.CancelToken = {}
        axios.CancelToken.source = jest.fn(() => mockRequest)
        returnValue = await crossRef.search()
      })

      test('should call axios.get with search term and cancelToken', () => {
        expect(axios.get).to.have.beenCalledWith(urls.crossRef.search('test'), {
          cancelToken: mockRequest.token,
        })
      })
    })

    describe('when request gets cancelled', () => {
      beforeEach(() => {
        axios.get.mockImplementationOnce(() => Promise.reject('error'))
        axios.isCancel = jest.fn(() => true)
      })

      describe('when calling search', () => {
        let returnValue

        beforeEach(async () => {
          returnValue = await crossRef.search()
        })

        test('should return defaultOptions', () => {
          returnValue.should.eql(crossRef.defaultOptions)
        })

        test('should call axios.isCancel', () => {
          expect(axios.isCancel).to.have.beenCalledWith('error')
        })
      })
    })
  })

  describe('when calling reset', () => {
    beforeEach(() => {
      crossRef.prevRequest = {}
      crossRef.responseError = 'error'
      crossRef.reset()
    })

    test('should reset observables to defaults', () => {
      expect(crossRef.prevRequest).to.be.undefined
      expect(crossRef.responseError).to.be.undefined
    })

    test('should call prev request cancel function', () => {
      expect(cancelMockFunc).to.have.beenCalledWith()
    })
  })

  describe('when calling translationPath with string', () => {
    let returnValue
    const testArg = 'test'

    beforeEach(() => {
      returnValue = crossRef.translationPath(testArg)
    })

    test('should return parsed translationPath', () => {
      returnValue.should.eql(`qvain.history.relatedResource.select.${testArg}`)
    })
  })

  describe('when calling parseResults with response', () => {
    let returnValue
    const response = {
      data: {
        message: {
          items: [
            {
              author: [
                {
                  family: 'Stallone',
                },
              ],
              title: ['Savage beasts roam in the dark corners of the science community'],
            },
            {
              title: ['Anonymous science is very important'],
            },
          ],
        },
      },
    }

    beforeEach(() => {
      returnValue = crossRef.parseResults(response)
    })

    test('should return default options and parsed response', () => {
      const expectedReturn = [
        ...crossRef.defaultOptions,
        {
          label: 'Stallone: Savage beasts roam in the dark corners of the science community',
          value: {
            label: 'Stallone: Savage beasts roam in the dark corners of the science community',
            author: [
              {
                family: 'Stallone',
              },
            ],
            title: ['Savage beasts roam in the dark corners of the science community'],
          },
        },
        {
          label: 'Anonymous science is very important',
          value: {
            label: 'Anonymous science is very important',
            title: ['Anonymous science is very important'],
          },
        },
      ]

      returnValue.should.eql(expectedReturn)
    })
  })
})
