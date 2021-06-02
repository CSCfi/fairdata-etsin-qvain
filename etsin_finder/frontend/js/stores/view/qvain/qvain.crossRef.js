import { makeObservable, action, observable, computed, runInAction } from 'mobx'
import axios from 'axios'
import translate from 'counterpart'
import urls from '../../../components/qvain/utils/urls'

class CrossRef {
  constructor() {
    makeObservable(this)
  }

  @observable prevRequest = undefined

  @observable responseError = undefined

  @observable term = ''

  @computed get defaultOptions() {
    return [
      {
        label: translate(this.translationPath('newRelation')),
        value: 'create',
      },
    ]
  }

  @action
  translationPath = item => `qvain.history.relatedResource.select.${item}`

  @action
  setTerm = term => {
    this.term = term
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

      runInAction(() => {
        this.prevRequest = undefined
      })

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
