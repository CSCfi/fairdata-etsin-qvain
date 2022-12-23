import axios from 'axios'

import { observable, action, when, makeObservable } from 'mobx'

export const isAbort = error => axios.isCancel(error)

// Call async function, ignore abortion exceptions
export const ignoreAbort = async fn => {
  try {
    return await fn()
  } catch (error) {
    if (!isAbort(error)) {
      throw error
    }
  }
  return undefined
}

const ensurePromise = promise => {
  if (typeof promise.then !== 'function') {
    return Promise.resolve(promise)
  }
  return promise
}

// Map method to axios function. Instead of having a method to function mapping,
// it would be simpler to use axios(config) that allows method and data as options,
// but since some tests still depend on mocking axios.get (and others) we need to
// use those functions here.
// NOTE: Aborting does not work for mocked axios functions
const methodToFunc = {
  get: { func: axios.get, useData: false },
  patch: { func: axios.patch, useData: true },
  put: { func: axios.put, useData: true },
  post: { func: axios.post, useData: true },
  delete: { func: axios.delete, useData: false },
}

class AbortClient {
  // Client for axios with helper utilities for aborting requests.
  //
  // Request methods work similarly to axios with some additions:
  // * Each request gets an AbortController
  // * AbortControllers are associated with tags from tag option (string or array of strings)
  // * AbortClient.abort allows aborting requests by tag

  constructor() {
    makeObservable(this)
  }

  @observable controllers = []

  create(config = {}) {
    // Basic replacement for axios.create(), creates a proxy client with default config.
    return new AbortClientApi(this, config)
  }

  @action.bound
  createController(tag) {
    let tags = tag || []
    if (!Array.isArray(tags)) {
      tags = [tags]
    }
    const abortController = new AbortController()
    const controller = observable({
      abortController,
      tags,
      done: false,
    })
    this.controllers.push(controller)
    return controller
  }

  @action.bound
  clearController(controller) {
    controller.done = true
    this.controllers.replace(this.controllers.filter(({ done }) => !done))
  }

  request({ method, url, data, tag, ...axiosConfig }) {
    const controller = this.createController(tag)
    const { signal } = controller.abortController
    const { func, useData } = methodToFunc[method]
    let promise
    if (useData) {
      promise = func(url, data, { ...axiosConfig, signal })
    } else {
      promise = func(url, { ...axiosConfig, signal })
    }
    return ensurePromise(promise)
      .catch(error => {
        if (isAbort(error)) {
          // axios cancel errors are very uninformative by default, this adds more context to them
          error.message = `${error.message || 'aborted'} ${method} ${url}, tag=${tag}`
        }
        throw error
      })
      .finally(() => this.clearController(controller))
  }

  get(url, options = {}) {
    return this.request({ url, method: 'get', ...options })
  }

  patch(url, data, options = {}) {
    return this.request({ url, data, method: 'patch', ...options })
  }

  put(url, data, options = {}) {
    return this.request({ url, data, method: 'put', ...options })
  }

  post(url, data, options = {}) {
    return this.request({ url, data, method: 'post', ...options })
  }

  delete(url, options = {}) {
    return this.request({ url, method: 'delete', ...options })
  }

  async waitForDone(tag = undefined, { abort = false } = {}) {
    // Wait until requests matching tag are done.
    let controllers = this.controllers
    if (tag) {
      controllers = controllers.filter(({ tags }) => tags.includes(tag))
    }

    if (abort) {
      controllers.forEach(({ abortController }) => abortController.abort())
    }
    if (controllers.length > 0) {
      await when(() => controllers.every(({ done }) => done))
    }
  }

  async abort(tag = undefined) {
    // Abort all requests matching tag, if any. If tag is undefined, abort all requests.
    return this.waitForDone(tag, { abort: true })
  }
}

class AbortClientApi {
  // Simple proxy client that allows making requests with an existing AbortClient but allows a default config.
  constructor(abortClient, config = {}) {
    this.abortClient = abortClient
    this.config = config
  }

  request(options) {
    return this.abortClient.request({ ...this.config, ...options })
  }

  get(url, options = {}) {
    return this.abortClient.get(url, { ...this.config, ...options })
  }

  patch(url, data, options = {}) {
    return this.abortClient.patch(url, data, { ...this.config, ...options })
  }

  put(url, data, options = {}) {
    return this.abortClient.put(url, data, { ...this.config, ...options })
  }

  post(url, data, options = {}) {
    return this.abortClient.post(url, data, { ...this.config, ...options })
  }

  delete(url, options = {}) {
    return this.abortClient.delete(url, { ...this.config, ...options })
  }
}

export default AbortClient
