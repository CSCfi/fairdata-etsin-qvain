import { observable, action, makeObservable } from 'mobx'

// Sorting helper for natural sorting of file/directory names.
const sortOpts = { numeric: true, sensitivity: 'base' }
export const sortFunc = (a, b) => a.localeCompare(b, undefined, sortOpts)

export class ChildItemCounter {
  constructor() {
    makeObservable(this)
  }

  // Helper class for counting child items based on paths without
  // having to load the entire directory hierarchy.
  @observable root = { directories: {}, count: 0 }

  @action inc(path) {
    // add child
    const parts = path.split('/')
    let dir = this.root
    dir.count += 1
    for (let i = 1; i < parts.length - 1; i += 1) {
      const part = parts[i]
      if (!dir.directories[part]) {
        dir.directories[part] = { directories: {}, count: 0 }
      }
      dir = dir.directories[part]
      dir.count += 1
    }
  }

  count(path) {
    // count children
    const parts = path.split('/')
    let dir = this.root
    for (let i = 1; i < parts.length; i += 1) {
      const part = parts[i]
      dir = dir.directories[part]
      if (!dir) {
        return 0
      }
    }
    return dir.count
  }
}

export const ignoreNotFound = async (promise, defaultResponse) => {
  // Return defaultResponse instead of throwing a 404 error.
  try {
    return await promise.catch(err => {
      if (err.response && err.response.status === 404) {
        return defaultResponse
      }
      throw err
    })
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return defaultResponse
    }
    throw err
  }
}

export const emptyDirectoryResponse = {
  data: {
    count: 0,
    results: {
      directories: [],
      files: [],
    },
  },
}

export const getAction = parent => {
  let added = false
  let removed = false
  let dir = parent
  while (dir) {
    if (dir.added) {
      added = true
      break
    }
    if (dir.removed) {
      removed = true
      break
    }
    dir = dir.parent
  }
  return {
    added,
    removed,
  }
}

export const assignDefined = (obj, values) => {
  for (const key in values) {
    if (values[key] != null) {
      obj[key] = values[key]
    }
  }
}

export const itemIsSelected = (i, parentAction) =>
  i.added || ((i.existing || parentAction.added) && !i.removed && !parentAction.removed)
