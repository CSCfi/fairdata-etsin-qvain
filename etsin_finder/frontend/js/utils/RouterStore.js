// Simple replacement for mobx-react-router with mobx v6 support.
// Provides an observable location that updates automatically
// on navigation.
//
// Usage:
// * Create an instance of RouterStore
// * Call the .syncWithRouter(router) to sync with a router object
// * To navigate and add item to history, call .navigate(to)
// * To navigate and replace current item in history, call .navigate(to, { replace: true })
// * To navigate to previous item, call .navigate(-1)
// * For backwards compatibility, methods push, replace, and goBack are also provided
import { observable, action, makeObservable } from 'mobx'

export class RouterStore {
  constructor() {
    makeObservable(this)
    this.push = this.push.bind(this)
    this.replace = this.replace.bind(this)
  }

  @observable location

  router = null

  unsubscribe = null

  @action.bound
  syncWithRouter(router) {
    this.unsubscribe?.()
    this.router = router
    this.setLocation(router.state.location)
    this.unsubscribe = router.subscribe(({ location }) => {
      this.setLocation(location)
    })
    return this.unsubscribe
  }

  @action.bound
  setLocation(location) {
    this.location = location
  }

  navigate(to, { replace, state, relative, ...options } = {}) {
    return this.router.navigate(to, { ...options, replace, state, relative })
  }

  push(to, options = {}) {
    return this.navigate(to, { ...options, replace: false })
  }

  replace(to, options = {}) {
    return this.navigate(to, { ...options, replace: true })
  }

  goBack(options = {}) {
    return this.navigate(-1, { ...options })
  }
}

export default RouterStore
