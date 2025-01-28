import { makeObservable, action, observable, computed, runInAction } from 'mobx'
import AbortClient from '@/utils/AbortClient'

class EtsinSearch {
  constructor(Env) {
    this.Env = Env
    makeObservable(this)
    this.client = new AbortClient()
  }

  @observable term = '' // current value of search input

  @observable usedTerm = '' // value that was used for current search

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
    const url = `${this.Env.metaxV3Url('datasets')}?limit=1`
    const res = await this.client.get(url)
    runInAction(() => {
      this.overallCount = res.data.count
    })
  }

  @action.bound
  async submit(query) {
    this.setUsedTerm(query.get("search"))
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

    query.forEach((value, key) => {
      if (value.includes(',') && !value.startsWith('"')) {
        query.set(key, `"${value}"`)
      }
    })

    const url = `${this.Env.metaxV3Url('datasets')}?${query.toString()}`
    const aggregatesUrl = `${this.Env.metaxV3Url('aggregates')}?${query.toString()}`

    await this.client.abort()
    this.setIsLoading(true)

    try {
      const results = await Promise.all([this.client.get(aggregatesUrl), this.client.get(url)])

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

  @action.bound setAggregation(key, aggregation) {
    this.aggregations[key] = { ...aggregation }
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
}

export default EtsinSearch
