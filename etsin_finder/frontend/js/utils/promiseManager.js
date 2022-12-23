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
}
