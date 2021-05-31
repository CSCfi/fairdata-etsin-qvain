import 'chai/register-expect'
import CrossRef from '../../../js/stores/view/qvain/qvain.crossRef'
import axios from 'axios'
import urls from '../../../js/components/qvain/utils/urls'

jest.mock('axios')

describe('CrossRef', () => {
  const crossRef = new CrossRef()

  describe('when calling search with empty string', () => {
    beforeEach(() => {
      crossRef.results = ['some', 'data']
      crossRef.search('')
    })

    test('should not call axios.get', () => {
      expect(axios.get).to.not.have.beenCalled()
    })

    test('should clear results', () => {
      crossRef.results.should.eql([])
    })
  })

  describe('when calling search with any string', () => {
    const mockRequest = { token: 'token' }

    beforeEach(async () => {
      axios.CancelToken = {}
      axios.CancelToken.source = jest.fn(() => mockRequest)
      await crossRef.search('test')
    })

    test('should call axios.get with search term and cancelToken', () => {
      expect(axios.get).to.have.beenCalledWith(urls.crossRef.search('test'), {
        cancelToken: mockRequest.token,
      })
    })

    test('should add mockRequest to prevRequest', () => {
      crossRef.prevRequest.should.eql(mockRequest)
    })
  })
})
