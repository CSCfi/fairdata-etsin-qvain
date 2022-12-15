// Simple replacement for mobx-react-router with mobx v6 support.
// Provides an observable location that updates automatically
// on navigation.
//
// Usage:
// * Create an instance of RouterStore
// * Call the .syncWithHistory(history) to sync with a history object
// * The push() and replace() methods are shorthand for history.push() and history.replace()
import { observable, action, makeObservable } from 'mobx'

export class RouterStore {
  constructor() {
    makeObservable(this)
    this.push = this.push.bind(this)
    this.replace = this.replace.bind(this)
  }

  @observable location

  history = null

  @action.bound
  syncWithHistory(history) {
    this.history = history
    this.setLocation(history.location)
    history.listen(location => {
      this.setLocation(location)
    })
    return history
  }

  @action.bound
  setLocation(location) {
    this.location = location
  }

  push(...args) {
    return this.history.push(...args)
  }

  replace(...args) {
    return this.history.replace(...args)
  }
}

export default RouterStore
