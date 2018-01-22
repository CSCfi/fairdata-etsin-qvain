import { observable, action } from 'mobx'
import axios from 'axios'
import Locale from './language'
import History from './history'

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
  @observable sorting = ''
  @observable search = ''
  @observable pageNum = 1
  @observable results = { hits: [], total: 0, aggregations: [] }
  @observable loading = 0

  @action
  updateSearch = (newSearch, updateUrl = true) => {
    this.search = newSearch
    if (updateUrl) {
      let path = `/datasets/${newSearch}` // reset parameters on new search, expect sort
      const urlParams = History.urlParams
      if (urlParams && urlParams.sort) {
        path = `${path}?sort=${urlParams.sort}`
      }
      History.history.push(path)
    }
  }

  @action
  updateSorting = (newSorting, updateUrl = true) => {
    this.sorting = newSorting
    if (updateUrl) {
      const urlParams = History.urlParams
      urlParams.sort = newSorting
      History.setUrlParams(urlParams)
    }
  }

  @action
  updatePageNum = (newPage, updateUrl = true) => {
    this.pageNum = newPage
    console.log(updateUrl)
  }

  @action
  updateFilter = (term, key, updateUrl = true) => {
    const index = this.filter.findIndex(i => i.term === term && i.key === key)
    if (index !== -1) {
      this.filter.splice(index, 1)
      if (updateUrl) {
        console.log('removing from url')
        const urlParams = History.urlParams
        const removeParam = (param, value) => {
          const single = urlParams[param].split(',')
          const removed = single.filter(e => e !== value)
          urlParams[param] = removed.join()
        }
        removeParam('keys', key)
        removeParam('terms', term)
        History.setUrlParams(urlParams)
      }
    } else {
      this.filter.push({ term, key })
      if (updateUrl) {
        console.log('adding to url')
        let urlParams = History.urlParams
        const addParam = (param, value) => {
          if (urlParams) {
            let selected = urlParams[param]
            selected = selected !== undefined ? `${selected},${value}` : value
            urlParams[param] = selected
          } else {
            urlParams = { param: value }
          }
        }
        addParam('keys', key)
        addParam('terms', term)
        History.setUrlParams(urlParams)
      }
    }
  }

  @action
  updateFromUrl = query => {
    window.myHistory = History
    const urlParams = History.urlParams
    if (query) {
      this.updateSearch(query, false)
    }
    if (urlParams) {
      if (urlParams.p) {
        this.updatePageNum(urlParams.p)
      }
      if (urlParams.sort) {
        this.updateSorting(urlParams.sort)
      }
      // if (urlParams.key && urlParams.term) {
      //   this.updateFilter()
      // }
    }
  }

  @action
  queryES = () => {
    let queryObject
    const query = this.search
    const filters = []
    for (let i = 0; i < this.filter.length; i += 1) {
      filters.push({ term: { [this.filter[i].term]: this.filter[i].key } })
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

    axios
      .post('/es/metax/dataset/_search', {
        size: 20,
        query: queryObject,
        sort: ['_score'], // Sort by hit score
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
      })
  }
}

export default new ElasticQuery()
