import { makeObservable, action, observable, computed } from 'mobx'
import axios from 'axios'
import urls from '@/utils/urls'

class CrossRef {
  constructor(Env) {
    this.Env = Env
    makeObservable(this)
  }

  @observable prevRequest = undefined

  @observable responseError = undefined

  @observable term = ''

  @computed get defaultOptions() {
    return []
  }

  @action
  translationPath = item =>
    this.Env.Flags.flagEnabled('QVAIN.EDITOR_V2')
      ? `qvain.publications.search.${item}`
      : `qvain.history.relatedResource.select.${item}`

  @action
  setTerm = term => {
    this.term = term
  }

  @action
  setPrevRequest = request => {
    this.prevRequest = request
  }

  @action
  search = async () => {
    this.responseError = undefined
    this.prevRequest?.cancel()

    if (this.term.length < 3) {
      return this.defaultOptions
    }

    try {
      this.prevRequest = axios.CancelToken.source()
      const cancelToken = this.prevRequest.token
      const response = await axios.get(urls.crossRef.search(this.term), {
        cancelToken,
      })

      this.setPrevRequest(undefined)

      return this.parseResults(response)
    } catch (error) {
      if (axios.isCancel(error)) {
        return this.defaultOptions
      }
      this.responseError = error
    }
    return []
  }

  @action
  parseResults = response => {
    const parsedItems = response.data.message.items.map(item => {
      const authorsList = (item.author || []).map(author => author.family).filter(a => a)
      const authorsStr = authorsList.length ? `${authorsList.join(', ')}: ` : ''
      const label = authorsStr + item.title[0]

      return {
        label,
        value: { ...item, label },
      }
    })

    return [...this.defaultOptions, ...parsedItems.sort((a, b) => a.score > b.score)]
  }

  reset = () => {
    this.responseError = undefined
    this.prevRequest?.cancel()
    this.prevRequest = undefined
    this.term = ''
  }
}

export default CrossRef
