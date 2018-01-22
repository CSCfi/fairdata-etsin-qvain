import { observable, action } from 'mobx'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

class History {
  @observable history = history

  @action
  urlParams() {
    const params = {}
    const search = decodeURI(this.history.location.search).slice(1)
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
      url = `${url}${keys[i]}=${params[keys[i]]}`
      if (i + 1 < keys.length) url = `${url}&`
    }
    this.history.push({
      pathname: this.history.location.pathname,
      search: encodeURI(url),
    })
    this.history.location.search = encodeURI(url) // not sure if this is best practice
  }
}

export default new History()
