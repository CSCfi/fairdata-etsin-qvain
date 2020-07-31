/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action } from 'mobx'
import axios from 'axios'
import counterpart from 'counterpart'

import isUrnQuery, { transformQuery } from '../../utils/transformQuery'
import UrlParse from '../../utils/urlParse'
import Helpers from '../../utils/helpers'
import Tracking from '../../utils/tracking'
import Env from '../domain/env'

const fields = [
  'title.*^5',
  'description.*^3',
  'organization_name*^3',
  'keyword^2',
  'creator.name.*',
  'contributor.name.*',
  'publisher.name.*',
  'rights_holder.name.*',
  'curator.name.*',
  'access_rights.license.title.*',
  'access_rights.access_type.pref_label.*',
  'theme.pref_label.*',
  'field_of_science.pref_label.*',
  'infrastructure.pref_label.*',
  'is_output_of.name.*',
  'identifier',
  'preferred_identifier',
  'other_identifier.notation',
  'other_identifier.type.pref_label.*',
  'dataset_version_set'
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

  @observable includePasDatasets = false

  @observable aggregations = {
    access_type_fi: {
      terms: {
        field: 'access_rights.access_type.pref_label.fi.keyword',
      },
    },
    access_type_en: {
      terms: {
        field: 'access_rights.access_type.pref_label.en.keyword',
      },
    },
    organization_name_fi: {
      terms: {
        field: 'organization_name_fi.keyword',
        size: 40,
      },
    },
    organization_name_en: {
      terms: {
        field: 'organization_name_en.keyword',
        size: 40,
      },
    },
    creator: {
      terms: {
        field: 'creator_name.keyword',
        size: 40,
      },
    },
    field_of_science_en: {
      terms: {
        field: 'field_of_science.pref_label.en.keyword',
        size: 40,
      },
    },
    field_of_science_fi: {
      terms: {
        field: 'field_of_science.pref_label.fi.keyword',
        size: 40,
      },
    },
    all_keywords_en: {
      terms: {
        field: 'all_keywords_en',
        size: 40,
      },
    },
    all_keywords_fi: {
      terms: {
        field: 'all_keywords_fi',
        size: 40,
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
        size: 40,
      },
    },
    project_name_en: {
      terms: {
        field: 'project_name_en.keyword',
        size: 40,
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
    data_catalog_fi: {
      terms: {
        field: 'data_catalog.fi',
      },
    },
    data_catalog_en: {
      terms: {
        field: 'data_catalog.en',
      },
    },
  }

  @action
  setIncludePasDatasets = value => {
    this.includePasDatasets = value
    this.queryES(false)
  }

  @action
  toggleIncludePasDatasets = () => {
    this.includePasDatasets = !this.includePasDatasets
    this.queryES(false)
  }

  // update query search term and url
  @action
  updateSearch = (newSearch, updateUrl = true) => {
    this.search = newSearch
    this.filter = []
    this.pageNum = 1
    if (updateUrl) {
      this.updateUrl()
    }
  }

  // update search result sorting and url
  @action
  updateSorting = (newSorting, updateUrl = true) => {
    this.sorting = newSorting
    this.pageNum = 1
    if (updateUrl) {
      this.updateUrl()
    }
  }

  // update page number and url
  @action
  updatePageNum = (newPage, updateUrl = true) => {
    this.pageNum = parseInt(newPage, 10)
    if (updateUrl) {
      this.updateUrl()
    }
  }

  // update search filter and url
  @action
  updateFilter = (term, key, updateUrl = true) => {
    const index = this.filter.findIndex(i => i.term === term && i.key === key)
    this.pageNum = 1
    if (index !== -1) {
      this.filter.splice(index, 1)
      if (updateUrl) {
        this.updateUrl()
      }
    } else {
      this.filter.push({ term, key })
      if (updateUrl) {
        this.updateUrl()
      }
    }
  }

  // reset search filters
  @action
  clearFilters = (updateUrl = true) => {
    if (this.filter.length !== 0) {
      this.filter = []
      this.pageNum = 1
      if (updateUrl) {
        this.updateUrl()
      } else {
        // clear results if changing language on a different page
        // will then perform query on when user enter page again.
        this.results = { hits: [], total: 0, aggregations: [] }
      }
      return true
    }
    return false
  }

  @action
  clearAll = () => {
    this.filter = []
    this.pageNum = 1
    this.search = ''
    this.sorting = 'best'
    this.updateUrl()
  }

  // when url is populated with settings
  @action
  updateFromUrl = (query, initial = false) => {
    if (initial) {
      if (this.results.total !== 0) {
        return this.updateUrl()
      }
    }

    const urlParams = UrlParse.searchParams(Env.history.location.search)

    if (query) {
      this.updateSearch(decodeURIComponent(query), false)
    }

    if (typeof urlParams === 'object' && urlParams !== null) {
      if ('sort' in urlParams) {
        this.updateSorting(urlParams.sort, false)
      }
      if ('keys' in urlParams && 'terms' in urlParams && urlParams.keys && urlParams.terms) {
        if (this.filter.length === 0) {
          const keys = urlParams.keys.split(',')
          const terms = urlParams.terms.split(',')
          for (let i = 0; i < keys.length; i += 1) {
            this.updateFilter(decodeURIComponent(terms[i]), decodeURIComponent(keys[i]), false)
          }
        }
      }
      if ('p' in urlParams && urlParams.p) {
        this.updatePageNum(urlParams.p, false)
      }
      if ('pas' in urlParams && urlParams.pas) {
        if (urlParams.pas === 'true') {
          this.setIncludePasDatasets(true)
        } else if (urlParams.pas === 'false') {
          this.setIncludePasDatasets(false)
        }
      }
    }
    return true
  }

  @action
  updateUrl = () => {
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
    urlParams.pas = this.includePasDatasets
    Env.history.replace({ pathname: path, search: UrlParse.makeSearchParams(urlParams) })
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
      // If includePasDatasets is not checked then check if the PAS filter is set
      // and remove it if present.
      if (!this.includePasDatasets) {
        this.filter = this.filter.filter(obj => !obj.key.startsWith('Fairdata PAS'))
      }
      const filters = this.filter.map(obj => ({ term: { [obj.term]: obj.key } }))
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
      const tQuery = transformQuery(query)
      const isUrnQ = isUrnQuery(query)
      if (tQuery) {
        queryObject = {
          bool: {
            must: [
              {
                multi_match: {
                  query: tQuery,
                  type: 'best_fields',
                  minimum_should_match: isUrnQ ? '100%' : '25%',
                  operator: isUrnQ ? 'and' : 'or',
                  fields,
                },
              },
            ],
            must_not: [
              {
                  term: {
                      'data_catalog.en': this.includePasDatasets ? '' : 'Fairdata PAS datasets'
                  }
              }
          ]
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
            must_not: [
              {
                  term: {
                      'data_catalog.en': this.includePasDatasets ? '' : 'Fairdata PAS datasets'
                  }
              }
          ]
          },
        }
      }
      return queryObject
    }

    return new Promise((resolve, reject) => {
      const queryObject = createQuery(this.search)
      const sorting = createSorting()
      const aggregations = this.aggregations
      const currentLang = counterpart.getLocale()
      const filters = createFilters()

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
          _source: [
            'access_rights.*',
            'data_catalog.*',
            'description.*',
            'identifier',
            'preservation_state',
            'title.*',

            // Fields needed for ATT/IDA <--> PAS link detection
            'preservation_identifier',
            'preservation_dataset_version',
            'preservation_dataset_origin_version',
            'data_catalog_identifier'
          ],
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
            // track queries, categories, and hits
            // category tracking turned off because filter contains a lot of different fields
            const aggr = `data_catalog_${currentLang}`
            const bucketLengths = res.data.aggregations[aggr].buckets.map(bucket => bucket.doc_count)
            const totalHits = bucketLengths.reduce((partialSum, a) => (partialSum + a), 0)
            if (!initial) Tracking.newSearch(currentSearch, false, res.data.hits.hits.length)
            this.results = {
              hits: res.data.hits.hits,
              total: totalHits,
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
