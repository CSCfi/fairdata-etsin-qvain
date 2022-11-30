import MockAdapter from 'axios-mock-adapter'
import createBrowserHistory from 'history/createBrowserHistory'
import { syncHistoryWithStore } from 'mobx-react-router'
import ElasticQueryClass from '../../../js/stores/view/elasticquery'
import EnvClass from '../../../js/stores/domain/env'
import queryData from '../../__testdata__/elasticQuery.data'
import searchResults from '../../__testdata__/searchResults.data'
import axios from 'axios'
import { configure } from 'mobx'

const Env = new EnvClass()
const ElasticQuery = new ElasticQueryClass(Env)
const browserHistory = createBrowserHistory()
const history = syncHistoryWithStore(browserHistory, Env.history)

describe('ElasticQuery', () => {
  // ------ UPDATE SEARCH ------
  describe('updateSearch function', () => {
    it('should be empty to start with', () => {
      expect(ElasticQuery.search).toEqual('')
    })
    it('should update the search value', () => {
      ElasticQuery.updateSearch('Helsinki', history)
      expect(ElasticQuery.search).toEqual('Helsinki')
    })
  })

  // ------ UPDATE SORTING ------
  describe('updateSorting function', () => {
    it('should be best to start with', () => {
      expect(ElasticQuery.sorting).toEqual('best')
    })
    it('should update the sorting value', () => {
      ElasticQuery.updateSorting('dateD', history, false)
      expect(ElasticQuery.sorting).toEqual('dateD')
    })
  })

  // ------ UPDATE PAGE ------
  describe('updatePageNum function', () => {
    it('should be 1 to start with', () => {
      expect(ElasticQuery.pageNum).toEqual(1)
    })
    it('should update the pagenum value', () => {
      ElasticQuery.updatePageNum(2, history)
      expect(ElasticQuery.pageNum).toEqual(2)
    })
  })

  // ------ UPDATE FILTER ------
  describe('updateFilter function', () => {
    it('should be empty to start with', () => {
      expect(ElasticQuery.filter.length).toEqual(0)
    })
    it('should add the filter values', () => {
      ElasticQuery.updateFilter('myterm', 'mykey', history)
      expect(ElasticQuery.filter[0].key).toEqual('mykey')
      expect(ElasticQuery.filter[0].term).toEqual('myterm')
    })
    it('should push new values to filter values', () => {
      ElasticQuery.updateFilter('myterm2', 'mykey2', history)
      expect(ElasticQuery.filter[1].key).toEqual('mykey2')
      expect(ElasticQuery.filter[1].term).toEqual('myterm2')
    })
    it('should remove value that is already present', () => {
      ElasticQuery.updateFilter('myterm', 'mykey', history)
      expect(ElasticQuery.filter.find(item => item.term === 'myterm')).toEqual(undefined)
      expect(ElasticQuery.filter.find(item => item.key === 'mykey')).toEqual(undefined)
      expect(ElasticQuery.filter.length).toEqual(1)
    })
    it('should not remove if only key or term match', () => {
      ElasticQuery.updateFilter('myterm2', 'mykey3', history)
      expect(ElasticQuery.filter.length).toEqual(2)
      ElasticQuery.updateFilter('myterm4', 'mykey2', history)
      expect(ElasticQuery.filter.length).toEqual(3)
    })
  })

  // ------ QUERY ES ------

  configure({ safeDescriptors: false })
  const ElasticQuery = new ElasticQueryClass(Env)
  configure({ safeDescriptors: true })

  ElasticQuery.queryES = jest.fn(ElasticQuery.queryES)
  const axios = require('axios')
  const MockAdapter = require('axios-mock-adapter')

  describe('QueryEs function', () => {
    it('should return results', async () => {
      const mock = new MockAdapter(axios)
      mock.onPost('/es/metax/dataset/_search').reply(200, searchResults)
      ElasticQuery.updateSearch('Helsinki')
      await ElasticQuery.queryES()
      expect(ElasticQuery.results.total).toBeGreaterThan(0)
      expect(mock.history.post.length).toBe(1)
      expect(JSON.parse(mock.history.post[0].data)).toEqual(queryData)
    })
  })
})
