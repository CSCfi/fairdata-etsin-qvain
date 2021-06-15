import { computed, observable, action, makeObservable } from 'mobx'

export default class PromiseManager {
  constructor() {
    this.count = this.count.bind(this)
    makeObservable(this)
  }

  @observable promisesWithTags = []

  @computed get promises() {
    return this.promisesWithTags.map(({ promise }) => promise)
  }

  count(tag = undefined) {
    if (tag !== undefined) {
      return this.promisesWithTags.filter(({ tag: t }) => t === tag).length
    }
    return this.promisesWithTags.length
  }

  // Keep track of promises and cancel all of them when reset() is called.
  // The canceled promises fail silently; resolve/reject callbacks of a canceled promise won't be called.
  @action.bound add(promise, tag = undefined) {
    this.promisesWithTags.push({ promise, tag })
    promise.finally(
      action(() => {
        this.promisesWithTags.replace(
          this.promisesWithTags.filter(({ promise: p }) => p !== promise)
        )
      })
    )
    return promise
  }

  @action.bound reset() {
    this.promisesWithTags.forEach(({ promise }) => {
      // mobx.when adds a cancel function to promises it returns
      // to call the original bluebird cancel, we need to access it using the prototype
      const prototypeCancel = Object.getPrototypeOf(promise).cancel
      if (prototypeCancel !== promise.cancel) {
        prototypeCancel.call(promise)
      }
      promise.cancel()
    })
    this.promisesWithTags.length = 0
  }
}
