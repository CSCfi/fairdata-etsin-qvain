import { makeObservable, action, observable } from 'mobx'
import axios from 'axios'
import urls from '../../../components/qvain/utils/urls'

class CrossRef {
  constructor() {
    makeObservable(this)
  }

  @observable results = []

  @observable prevRequest = undefined

  @observable responseError = undefined

  @action
  search = async (term = '') => {
    if (!term) {
      this.results = []
      this.prevRequest?.cancel()
      return
    }

    this.prevRequest = axios.CancelToken.source()
    const cancelToken = this.prevRequest.token

    try {
      this.results = await axios.get(urls.crossRef.search(term), {
        cancelToken,
      })
    } catch (error) {
      if (axios.isCancel(error)) {
        return
      }
      this.responseError = error
    }
  }
}

export default CrossRef
