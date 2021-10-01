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
      return this.promisesWithTags.filter(({ tags }) => tags.includes(tag)).length
    }
    return this.promisesWithTags.length
  }

  // Keep track of promises and cancel all of them when reset() is called.
  // The canceled promises fail silently; resolve/reject callbacks of a canceled promise won't be called.
  @action.bound add(promise, ...tags) {
    const promiseWithFinally = promise.finally(
      action(() => {
        this.promisesWithTags.replace(
          this.promisesWithTags.filter(({ promise: p }) => p !== promiseWithFinally)
        )
      })
    )
    this.promisesWithTags.push({ promise: promiseWithFinally, tags })
    return promiseWithFinally
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
