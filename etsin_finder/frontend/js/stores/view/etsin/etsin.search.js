import { makeObservable, action, observable, computed, runInAction } from 'mobx'
import AbortClient from '@/utils/AbortClient'

class EtsinSearch {
  constructor(Env) {
    this.Env = Env
    makeObservable(this)
    this.client = new AbortClient()
  }

  @observable term = ''

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

  @action.bound
  async submit(query) {
    if (query.has('page')) {
      const newPage = parseInt(query.get('page'), 10)

      if (!Number.isNaN(newPage) && newPage > 0) {
        this.setPage(newPage)
      }

      query.delete('page')
    }

    query.set('limit', this.itemsPerPage)
    query.set('offset', this.offset)

    query.forEach((value, key) => {
      if (value.includes(',') && !value.startsWith('"')) {
        query.set(key, `"${value}"`)
      }
    })

    const url = `${this.Env.metaxV3Url('datasets')}?${query.toString()}`

    await this.client.abort()
    this.setIsLoading(true)

    try {
      const res = await this.client.get(url)
      runInAction(() => {
        this.setAggregations(res.data.aggregations)
        this.setRes(res.data)
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

  @action.bound setPage(pageNum) {
    this.res = null
    this.currentPage = pageNum
  }

  @action setIsLoading(value) {
    this.isLoading = value
  }
}

export default EtsinSearch
