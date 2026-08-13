import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

import { observable, action, when } from 'mobx'

export const isAbort = (error: any) => axios.isCancel(error)

// Call async function, ignore abortion exceptions
export const ignoreAbort = async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
  try {
    return await fn()
  } catch (error) {
    if (!isAbort(error)) {
      throw error
    }
  }
  return undefined
}

const ensurePromise = (promise: any) => {
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

type ControllerEntry = {
  abortController: AbortController
  tags: string[]
  done: boolean
}

interface RequestConfig extends AxiosRequestConfig {
  method: keyof typeof methodToFunc
  url: string
  data?: any
  tag?: string | string[]
}

class AbortClient {
  // Client for axios with helper utilities for aborting requests.
  //
  // Request methods work similarly to axios with some additions:
  // * Each request gets an AbortController
  // * AbortControllers are associated with tags from tag option (string or array of strings)
  // * AbortClient.abort allows aborting requests by tag

  // Use observable.array explicitly since we're using the .replace method
  @observable accessor controllers = observable.array<ControllerEntry>()

  create(config = {}) {
    // Basic replacement for axios.create(), creates a proxy client with default config.
    return new AbortClientApi(this, config)
  }

  @action.bound
  createController(tag: undefined | string | string[]) {
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
  clearController(controller: ControllerEntry) {
    controller.done = true
    this.controllers.replace(this.controllers.filter(({ done }) => !done))
  }

  async delay(milliseconds: number, { tag }: { tag?: string | string[] } = {}) {
    // Abortable delay.
    //
    // When aborted, rejects with an axios.Cancel instance
    // which can be identified with isAbort(error).
    if (milliseconds == null) {
      return
    }
    const controller = this.createController(tag)
    const { signal } = controller.abortController
    await Promise.delay(milliseconds)
    this.clearController(controller)

    if (signal.aborted) {
      throw new axios.Cancel('Delay aborted')
    }
  }

  request({ method, url, data, tag, ...axiosConfig }: RequestConfig): Promise<AxiosResponse<any>> {
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
      .catch((error: any) => {
        if (isAbort(error)) {
          // axios cancel errors are very uninformative by default, this adds more context to them
          error.message = `${error.message || 'aborted'} ${method} ${url}, tag=${tag}`
        }
        throw error
      })
      .finally(() => this.clearController(controller))
  }

  get(url: string, options = {}) {
    return this.request({ url, method: 'get', ...options })
  }

  patch(url: string, data?: any, options = {}) {
    return this.request({ url, data, method: 'patch', ...options })
  }

  put(url: string, data?: any, options = {}) {
    return this.request({ url, data, method: 'put', ...options })
  }

  post(url: string, data?: any, options = {}) {
    return this.request({ url, data, method: 'post', ...options })
  }

  delete(url: string, options = {}) {
    return this.request({ url, method: 'delete', ...options })
  }

  async waitForDone(tag: undefined | string = undefined, { abort = false } = {}) {
    // Wait until requests matching tag are done.
    let controllers = this.controllers
    if (tag) {
      controllers = observable(controllers.filter(({ tags }) => tags.includes(tag)))
    }

    if (abort) {
      controllers.forEach(({ abortController }) => abortController.abort())
    }
    if (controllers.length > 0) {
      await when(() => controllers.every(({ done }) => done))
    }
  }

  async abort(tag: undefined | string = undefined) {
    // Abort all requests matching tag, if any. If tag is undefined, abort all requests.
    return this.waitForDone(tag, { abort: true })
  }
}

class AbortClientApi {
  abortClient: AbortClient
  config: Partial<RequestConfig>

  // Simple proxy client that allows making requests with an existing AbortClient but allows a default config.
  constructor(abortClient: AbortClient, config = {}) {
    this.abortClient = abortClient
    this.config = config
  }

  request(options: Partial<RequestConfig>) {
    const config = { ...this.config, ...options }
    if (!config.method) {
      throw new Error('Missing request method')
    }
    if (!config.url) {
      throw new Error('Missing request url')
    }
    return this.abortClient.request(config as RequestConfig)
  }

  get(url: string, options = {}) {
    return this.abortClient.get(url, { ...this.config, ...options })
  }

  patch(url: string, data?: any, options = {}) {
    return this.abortClient.patch(url, data, { ...this.config, ...options })
  }

  put(url: string, data?: any, options = {}) {
    return this.abortClient.put(url, data, { ...this.config, ...options })
  }

  post(url: string, data?: any, options = {}) {
    return this.abortClient.post(url, data, { ...this.config, ...options })
  }

  delete(url: string, options = {}) {
    return this.abortClient.delete(url, { ...this.config, ...options })
  }
}

export default AbortClient
