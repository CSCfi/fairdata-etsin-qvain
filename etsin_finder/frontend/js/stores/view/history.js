import { observable, computed, action } from 'mobx'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

class History {
  @observable history = history

  @computed
  get urlParams() {
    const params = {}
    const search = this.history.location.search.slice(1)
    const definitions = search.split('&')
    definitions.forEach(val => {
      const parts = val.split('=', 2)
      params[parts[0]] = parts[1]
    })
    return search !== '' ? params : null
  }

  @action
  setUrlParams = params => {
    let url = '?'
    const keys = Object.keys(params)
    for (let i = 0; i < keys.length; i += 1) {
      console.log(params[keys[i]])
      url = `${url}${keys[i]}=${params[keys[i]]}`
      if (i + 1 < keys.length) url = `${url}&` // not on last
    }
    this.history.push({
      pathname: this.history.location.pathname,
      search: url,
    })
  }
}

export default new History()
