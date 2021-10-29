import { computed, observable, action, makeObservable } from 'mobx'

export default class PromiseManager {
  constructor() {
    this.count = this.count.bind(this)
    this.promisesByTag = this.promisesByTag.bind(this)
    makeObservable(this)
  }

  @observable promisesWithTags = []

  @computed get promises() {
    return this.promisesWithTags.map(({ promise }) => promise)
  }

  count(tag = undefined) {
    if (tag !== undefined) {
      return this.promisesByTag(tag).length
    }
    return this.promisesWithTags.length
  }

  promisesByTag(tag) {
    return this.promisesWithTags
      .filter(({ tags }) => tags.includes(tag))
      .map(({ promise }) => promise)
  }

  // Keep track of promises and cancel all of them when reset() is called.
  // The canceled promises fail silently; resolve/reject callbacks of a canceled promise won't be called.
  @action.bound add(promise, tags, options = {}) {
    let tagsArray
    if (Array.isArray(tags)) {
      tagsArray = tags
    } else {
      tagsArray = [tags]
    }

    const onCancel = options.onCancel

    const promiseWithFinally = promise.finally(
      action(() => {
        this.promisesWithTags.replace(
          this.promisesWithTags.filter(({ promise: p }) => p !== promiseWithFinally)
        )
      })
    )
    this.promisesWithTags.push({ promise: promiseWithFinally, tags: tagsArray, onCancel })
    return promiseWithFinally
  }

  @action.bound reset(tag = undefined) {
    const promisesWithTags = tag
      ? this.promisesWithTags.filter(({ tags }) => tags.includes(tag))
      : this.promisesWithTags

    promisesWithTags.forEach(({ promise, onCancel }) => {
      // mobx.when adds a cancel function to promises it returns
      // to call the original bluebird cancel, we need to access it using the prototype
      onCancel?.()
      const prototypeCancel = Object.getPrototypeOf(promise).cancel
      if (prototypeCancel !== promise.cancel) {
        prototypeCancel.call(promise)
      }
      promise.cancel()
    })
    this.promisesWithTags.length = 0
  }
}
