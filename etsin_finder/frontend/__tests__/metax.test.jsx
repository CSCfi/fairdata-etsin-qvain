import ReactDOM from 'react-dom' // eslint-disable-line no-unused-vars
import axios from 'axios'

let res = ''

describe('Axios metax request', () => {
  it('gets data', done => {
    axios.get('https://metax-test.csc.fi/rest/datasets/12.json').then(response => {
      res = response
      done()
    })
  })
  describe('Axios metax request', () => {
    it('returns data', () => {
      expect(typeof res.data).toEqual('object')
    })
    it('should contain data_catalog', () => {
      expect(typeof res.data.data_catalog).toEqual('object')
    })
    it('should contain research_dataset', () => {
      expect(typeof res.data.research_dataset).toEqual('object')
    })
    it('should contain a title', () => {
      expect(Object.keys(res.data.research_dataset.title).map(() => true)).toBeTruthy()
    })
  })
})
