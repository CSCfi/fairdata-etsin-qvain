import { makeObservable, action, observable, computed, runInAction } from 'mobx'
import AbortClient, { isAbort } from '@/utils/AbortClient'
import { debounce } from 'lodash-es'

class EtsinSearch {
  constructor(Env, Locale, Etsin) {
    this.Env = Env
    this.Locale = Locale
    this.Etsin = Etsin
    this.client = new AbortClient()
    makeObservable(this)
  }

  @observable term = '' // current value of search input

  @observable usedTerm = '' // value that was used for current search

  @observable aggregatesUrl = ''

  @observable res = null

  @observable isLoading = false

  @observable itemsPerPage = 20

  @observable currentPage = 1

  @observable activeFilters = {
    data_catalog: [],
    access_type: [],
    organization: [],
  }

  @observable aggregations = {}

  @observable overallCount = null

  @observable temporalStart = ''

  @observable temporalEnd = ''

  @observable temporalOpen = false

  @observable temporalValidationError = null

  @observable facetSearchesCleared = {
    organization: false,
    creator: false,
    field_of_science: false,
    keyword: false,
    project: false,
  }

  @computed get count() {
    return this.res?.count || 0
  }

  @computed get pageCount() {
    return Math.ceil(this.count / this.itemsPerPage)
  }

  @computed get results() {
    return this.res?.results
  }

  @action.bound
  getAggregation(name) {
    return this.aggregations[name]?.hits || []
  }

  @action.bound
  getAggregationQueryName(name) {
    return this.aggregations[name]?.query_parameter
  }

  @computed get offset() {
    return this.currentPage * this.itemsPerPage - this.itemsPerPage
  }

  @action.bound async fetchOverallCount() {
    const url = `${this.Env.metaxV3Url('datasets')}?limit=1&latest_versions=true&state=published`
    const res = await this.client.get(url)
    runInAction(() => {
      this.overallCount = res.data.count
    })
  }

  @action.bound
  async submit(query) {
    this.setUsedTerm(query.get('search'))
    if (query.has('page')) {
      const newPage = parseInt(query.get('page'), 10)

      if (!Number.isNaN(newPage) && newPage > 0) {
        this.setPage(newPage)
      }

      query.delete('page')
    }

    query.set('limit', this.itemsPerPage)
    query.set('offset', this.offset)
    query.set('publishing_channels', 'etsin')
    query.set('latest_versions', true)
    query.set('state', 'published')

    const url = `${this.Env.metaxV3Url('datasets')}?${query.toString()}`
    this.aggregatesUrl = `${this.Env.metaxV3Url('aggregates')}?language=${
      this.Locale.lang
    }&${query.toString()}`

    await this.client.abort()
    this.setIsLoading(true)

    try {
      const results = await Promise.all([this.client.get(this.aggregatesUrl), this.client.get(url)])

      runInAction(() => {
        this.setAggregations(results[0].data)
        this.setRes(results[1].data)
        if (this.count > 0 && this.offset >= this.count) {
          query.set('page', this.pageCount)
          this.submit(query)
        }
      })
    } catch (e) {
      console.error(e)
    } finally {
      this.setIsLoading(false)
    }

    return null
  }

  @action.bound setRes(res) {
    this.res = res
    delete this.res.aggregations
  }

  @action.bound setAggregations(aggregations) {
    for (const [key, aggregation] of Object.entries(aggregations)) {
      this.setAggregation(key, aggregation)
    }
  }

  /* The aggregation parameter is not set directly as the value of 
  aggregations[key], but a new corresponding object is created from it so 
  that subobject changes are registered: */
  @action.bound setAggregation(key, aggregation) {
    this.aggregations[key] = {
      query_parameter: aggregation.query_parameter,
      hits: [...aggregation.hits],
    }
  }

  /* Update the value of the aggregation determined by the facetName 
  parameter to results that correspond partly or fully to the value of the 
  term parameter. 
  */
  @action.bound
  async fetchAggregation(facetName, term = '') {
    try {
      const url =
        term.trim() === ''
          ? this.aggregatesUrl
          : `${this.aggregatesUrl}&${facetName}_facet_search=${term}`

      const response = await this.client.get(url, { tag: facetName })
      this.setAggregation(facetName, response.data[facetName])
    } catch (error) {
      this.Etsin.errors.search.push(error)

      if (isAbort(error)) {
        return
      }

      throw error
    }
  }

  fetchDebouncedAggregation = debounce(async (facetName, term) => {
    await this.fetchAggregation(facetName, term)
  }, 200)

  @action.bound
  fetchAggregationWithDebounce(facetName, term) {
    this.client.abort(facetName)
    this.fetchDebouncedAggregation(facetName, term)
  }

  @action.bound setClearFacetSearch(facetName, value) {
    this.facetSearchesCleared[facetName] = value
  }

  @action.bound async resetFacetSearches() {
    try {
      this.client.abort('all')
      const result = await this.client.get(this.aggregatesUrl, { tag: 'all' })
      Object.keys(this.facetSearchesCleared).forEach(facetName => {
        this.setClearFacetSearch(facetName, true)
      })
      this.setAggregations(result.data)
    } catch (error) {
      this.Etsin.errors.search.push(error)

      if (isAbort(error)) {
        return
      }

      throw error
    }
  }

  @action.bound setTerm(term) {
    this.term = term
  }

  @action.bound setUsedTerm(term) {
    this.usedTerm = term
  }

  @action.bound setPage(pageNum) {
    this.res = null
    this.currentPage = pageNum
  }

  @action setIsLoading(value) {
    this.isLoading = value
  }

  @action setTemporalStart = value => {
    this.temporalStart = value
  }

  @action setTemporalEnd = value => {
    this.temporalEnd = value
  }

  @action setTemporalOpen = value => {
    this.temporalOpen = value
  }

  @action setTemporalValidationError = value => {
    this.temporalValidationError = value
  }

  @action resetTemporal = () => {
    this.temporalStart = ''
    this.temporalEnd = ''
    this.temporalValidationError = null
  }
}

export default EtsinSearch
