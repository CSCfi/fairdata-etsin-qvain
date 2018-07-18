/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, computed } from 'mobx'
import axios from 'axios'

import UrlParse from '../../utils/urlParse'
import Helpers from '../../utils/helpers'
import Locale from './language'

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
  'infrastructure.pref_label.*',
  'project.*',
  'identifier',
  'preferred_identifier',
  'other_identifier.notation',
  'other_identifier.type.pref_label.*',
  'dataset_version_set',
]

let lastQueryTime = 0

class ElasticQuery {
  @observable filter = []
  @observable sorting = 'best'
  @observable search = ''
  @observable pageNum = 1
  @observable results = { hits: [], total: 0, aggregations: [] }
  @observable loading = false
  @observable perPage = 20

  // update query search term and url
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

  // update search result sorting and url
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

  // update page number and url
  @action
  updatePageNum = (newPage, history, updateUrl = true) => {
    this.pageNum = parseInt(newPage, 10)
    if (updateUrl) {
      let urlParams = UrlParse.searchParams(history.location.search)
      if (urlParams) urlParams.p = newPage
      else {
        urlParams = { p: newPage }
      }
      // TODO: change to history push. Currently going back doesn't refresh results page.
      history.replace({ search: UrlParse.makeSearchParams(urlParams) })
    }
  }

  // update search filter and url
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

  // reset search filters
  @action
  clearFilters = (history, updateUrl = true) => {
    this.filter = []
    this.pageNum = 1
    if (updateUrl) {
      const urlParams = UrlParse.searchParams(history.location.search)
      urlParams.keys = ''
      urlParams.terms = ''
      urlParams.p = 1
      history.replace({ search: UrlParse.makeSearchParams(urlParams) })
    }
  }

  // when url is populated with settings
  @action
  updateFromUrl = (query, history, initial = false) => {
    if (initial) {
      if (this.results.total !== 0) {
        return this.updateUrl(history)
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

  @action
  updateUrl = history => {
    const urlParams = {}
    const path = `/datasets/${encodeURIComponent(this.search)}`
    urlParams.keys = []
    urlParams.terms = []
    this.filter.map(single => {
      urlParams.keys.push(single.key)
      urlParams.terms.push(single.term)
      return true
    })
    urlParams.p = this.pageNum
    urlParams.sort = this.sorting
    history.replace({ pathname: path, search: UrlParse.makeSearchParams(urlParams) })
    return { path, search: UrlParse.makeSearchParams(urlParams) }
  }

  // query elastic search with defined settings
  @action
  queryES = (initial = false) => {
    // don't perform initial query on every componentMount
    if (initial && this.results.total !== 0) {
      return new Promise(resolve => resolve())
    }

    if (Date.now() - lastQueryTime < 200) {
      return new Promise(resolve => resolve())
    }
    lastQueryTime = Date.now()

    // Filters
    const createFilters = () => {
      const filters = []
      for (let i = 0; i < this.filter.length; i += 1) {
        filters.push({ term: { [this.filter[i].term]: this.filter[i].key } })
      }
      return filters
    }

    // Sorting
    const createSorting = () => {
      const sorting = ['_score']
      if (this.sorting) {
        if (this.sorting === 'dateA') {
          sorting.unshift({ date_modified: { order: 'asc' } })
        }
        if (this.sorting === 'dateD') {
          sorting.unshift({ date_modified: { order: 'desc' } })
        }
      }
      return sorting
    }

    const createQuery = query => {
      let queryObject
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
                  // match only to specified fields
                  fields,
                },
              },
            ],
          },
        }
      } else {
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
      return queryObject
    }

    return new Promise((resolve, reject) => {
      const queryObject = createQuery(this.search)
      const filters = createFilters()
      const sorting = createSorting()
      const aggregations = {
        organization_name_fi: {
          terms: {
            field: 'organization_name_fi.keyword',
          },
        },
        organization_name_en: {
          terms: {
            field: 'organization_name_en.keyword',
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
        infrastructure_en: {
          terms: {
            field: 'infrastructure.pref_label.en.keyword',
          },
        },
        infrastructure_fi: {
          terms: {
            field: 'infrastructure.pref_label.fi.keyword',
          },
        },
        project_name_fi: {
          terms: {
            field: 'project_name_fi.keyword',
          },
        },
        project_name_en: {
          terms: {
            field: 'project_name_en.keyword',
          },
        },
        file_type_en: {
          terms: {
            field: 'file_type.pref_label.en.keyword',
          },
        },
        file_type_fi: {
          terms: {
            field: 'file_type.pref_label.fi.keyword',
          },
        },
      }

      // adding filters if they are set
      if (filters.length > 0) {
        queryObject.bool.filter = filters
      }

      // toggle loader
      this.loading = true

      // results for specific page
      let from = this.pageNum * this.perPage
      from -= this.perPage

      const currentSearch = this.search
      const currentFilters = this.filter.slice()
      const currentSorting = this.sorting

      // TODO: check cache for saved results

      axios
        .post('/es/metax/dataset/_search', {
          size: this.perPage,
          from,
          query: queryObject,
          sort: sorting,
          // Return only the following fields in source attribute to minimize traffic
          _source: ['identifier', 'title.*', 'description.*', 'access_rights.*'],
          highlight: {
            // pre_tags: ['<b>'], # default is <em>
            // post_tags: ['</b>'],
            fields: {
              'description.*': {},
              'title.*': {},
              // Add more fields if highlights from other fields are required
            },
          },
          aggregations,
        })
        .then(res => {
          // TODO: cache/save results
          // Fixes race condition
          if (
            currentSearch !== this.search ||
            !Helpers.isEqual(currentFilters, this.filter.slice()) ||
            currentSorting !== this.sorting
          ) {
            resolve()
          } else {
            this.results = {
              hits: res.data.hits.hits,
              total: res.data.hits.total,
              aggregations: res.data.aggregations,
            }
            this.loading = false
            resolve(res)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default new ElasticQuery()
