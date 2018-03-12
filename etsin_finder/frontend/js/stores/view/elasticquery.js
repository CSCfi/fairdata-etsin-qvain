import { observable, action } from 'mobx'
import axios from 'axios'
import Locale from './language'
import UrlParse from '../../utils/urlParse'

const fields = [
  'title.*',
  'description.*',
  'creator.name.*',
  'contributor.name.*',
  'publisher.name.*',
  'rights_holder.name.*',
  'curator.name.*',
  'keyword',
  'access_rights.license.title.*',
  'access_rights.type.identifier.*',
  'access_rights.type.pref_label.*',
  'theme.pref_label.*',
  'field_of_science.pref_label.*',
  'project.pref_label.*',
  'urn_identifier',
  'preferred_identifier',
  'other_identifier.notation',
  'other_identifier.type.pref_label.*',
]

class ElasticQuery {
  @observable filter = []
  @observable sorting = 'best'
  @observable search = ''
  @observable pageNum = 1
  @observable results = { hits: [], total: 0, aggregations: [] }
  @observable loading = 0
  @observable perPage = 20

  // update query search term
  @action
  updateSearch = (newSearch, history, updateUrl = true) => {
    this.search = newSearch
    if (updateUrl) {
      const path = `/datasets/${encodeURIComponent(newSearch)}`
      // reset parameters on new search, expect sort
      let search = ''
      const urlParams = UrlParse.searchParams(history.location.search)
      if (urlParams && urlParams.sort) {
        search = `?sort=${urlParams.sort}`
        this.filter = []
        this.pageNum = 1
      } else {
        this.filter = []
        this.pageNum = 1
      }
      history.replace({ pathname: path, search })
    }
  }

  // update search result sorting
  @action
  updateSorting = (newSorting, history, updateUrl = true) => {
    this.sorting = newSorting
    if (updateUrl) {
      let urlParams = UrlParse.searchParams(history.location.search)
      if (urlParams) {
        urlParams.sort = newSorting
      } else {
        urlParams = { sort: newSorting }
      }
      // reset page number
      this.pageNum = 1
      urlParams.p = this.pageNum
      history.replace({ search: UrlParse.makeSearchParams(urlParams) })
    }
  }

  @action
  updatePageNum = (newPage, history, updateUrl = true) => {
    this.pageNum = parseInt(newPage, 10)
    if (updateUrl) {
      let urlParams = UrlParse.searchParams(history.location.search)
      if (urlParams) urlParams.p = newPage
      else {
        urlParams = { p: newPage }
      }
      history.replace({ search: UrlParse.makeSearchParams(urlParams) })
    }
  }

  // update search filter
  @action
  updateFilter = (term, key, history, updateUrl = true) => {
    const index = this.filter.findIndex(i => i.term === term && i.key === key)
    if (index !== -1) {
      this.filter.splice(index, 1)
      if (updateUrl) {
        const urlParams = UrlParse.searchParams(history.location.search)
        const removeParam = (param, value) => {
          const single = urlParams[param].split(',')
          const removed = single.filter(e => decodeURIComponent(e) !== value)
          urlParams[param] = removed.join()
        }
        removeParam('keys', key)
        removeParam('terms', term)
        // reset page number
        this.pageNum = 1
        urlParams.p = 1
        history.replace({ search: UrlParse.makeSearchParams(urlParams) })
      }
    } else {
      this.filter.push({ term, key })
      if (updateUrl) {
        let urlParams = UrlParse.searchParams(history.location.search)
        const addParam = (param, value) => {
          if (urlParams) {
            let selected = urlParams[param]
            selected =
              selected !== undefined && selected.length > 0
                ? `${selected},${encodeURIComponent(value)}`
                : encodeURIComponent(value)
            urlParams[param] = selected
          } else {
            urlParams = { [param]: encodeURIComponent(value) }
          }
        }
        addParam('keys', key)
        addParam('terms', term)
        // reset page number
        this.pageNum = 1
        urlParams.p = 1
        history.replace({ search: UrlParse.makeSearchParams(urlParams) })
      }
    }
  }

  // when url is populated with settings
  @action
  updateFromUrl = (query, history, initial = false) => {
    if (initial) {
      if (this.results.total !== 0) {
        return
      }
    }
    const urlParams = UrlParse.searchParams(history.location.search)
    if (query) {
      this.updateSearch(decodeURIComponent(query), history, false)
    }
    if (urlParams) {
      if (urlParams.sort) {
        this.updateSorting(urlParams.sort, history, false)
      }
      if (urlParams.keys && urlParams.terms) {
        if (this.filter.length === 0) {
          const keys = urlParams.keys.split(',')
          const terms = urlParams.terms.split(',')
          for (let i = 0; i < keys.length; i += 1) {
            this.updateFilter(
              decodeURIComponent(terms[i]),
              decodeURIComponent(keys[i]),
              history,
              false
            )
          }
        }
      }
      if (urlParams.p) {
        this.updatePageNum(urlParams.p, history, false)
      }
    }
  }

  // query elastic search with defined settings
  @action
  queryES = (initial = false) => {
    if (initial) {
      console.log(this.results.total)
      if (this.results.total !== 0) {
        return new Promise(resolve => resolve())
      }
    }
    return new Promise((resolve, reject) => {
      console.log('-- query --')
      let queryObject
      const query = this.search
      const filters = []
      for (let i = 0; i < this.filter.length; i += 1) {
        filters.push({ term: { [this.filter[i].term]: this.filter[i].key } })
      }
      const sorting = ['_score']
      if (this.sorting) {
        if (this.sorting === 'dateA') {
          sorting.unshift({ date_modified: { order: 'asc' } })
        }
        if (this.sorting === 'dateD') {
          sorting.unshift({ date_modified: { order: 'desc' } })
        }
      }

      if (query) {
        queryObject = {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  type: 'cross_fields',
                  minimum_should_match: '75%',
                  operator: 'and',
                  analyzer: Locale.currentLang === 'fi' ? 'finnish' : 'english',
                  fields,
                },
              },
            ],
          },
        }
      } else {
        // No user search query, fetch all docs, change this to use aggregations and sorting and pagenum
        queryObject = {
          bool: {
            must: [
              {
                match_all: {},
              },
            ],
          },
        }
      }

      // adding filters if they are set
      if (filters.length > 0) {
        queryObject.bool.filter = filters
      }

      // toggle loader
      this.loading = 1
      let from = this.pageNum * this.perPage
      from -= this.perPage

      axios
        .post('/es/metax/dataset/_search', {
          size: this.perPage,
          from,
          query: queryObject,
          sort: sorting,
          // Return only the following fields in source attribute to minimize traffic
          _source: [
            'urn_identifier',
            'title.*',
            'description.*',
            'access_rights.type.identifier',
            'access_rights.license.identifier',
          ],
          highlight: {
            // pre_tags: ['<b>'], # default is <em>
            // post_tags: ['</b>'],
            fields: {
              'description.*': {},
              'title.*': {},
              // Add here more fields if highlights from other fields are required
            },
          },
          aggregations: {
            organization: {
              terms: {
                field: 'organization_name.keyword',
              },
            },
            creator: {
              terms: {
                field: 'creator_name.keyword',
              },
            },
            field_of_science_en: {
              terms: {
                field: 'field_of_science.pref_label.en.keyword',
              },
            },
            field_of_science_fi: {
              terms: {
                field: 'field_of_science.pref_label.fi.keyword',
              },
            },
            keyword_en: {
              terms: {
                field: 'theme.label.en.keyword',
              },
            },
            keyword_fi: {
              terms: {
                field: 'theme.label.fi.keyword',
              },
            },
          },
        })
        .then(res => {
          console.log('-- QUERY DONE ---')
          this.results = {
            hits: res.data.hits.hits,
            total: res.data.hits.total,
            aggregations: res.data.aggregations,
          }
          this.loading = 0
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default new ElasticQuery()
