export class Tracker {
  // Keeps track of which (nested) properties of object have been read.
  // Can then list properties and values that are unused.

  constructor(object) {
    this.track(object)
  }

  track(object) {
    if (object) {
      this.originalObject = object
      this.object = new Proxy(object, this.getHandler())
    } else {
      this.originalObject = undefined
      this.object = undefined
    }
    this.used = {}
  }

  getHandler(path) {
    const self = this
    const handler = {
      get(target, property) {
        if (!Object.prototype.hasOwnProperty.call(target, property)) {
          return target[property] // avoid conflicts with Mobx by considering only own properties
        }
        const val = target[property]
        const newPath = path ? `${path}.${property}` : property
        self.used[newPath] = true
        if (val && typeof val === 'object') {
          return new Proxy(val, self.getHandler(newPath)) // create new proxy for nested object
        }
        return val
      },
    }
    return handler
  }

  getUnused({ deep } = { deep: false }) {
    // Return unused properties and their values.
    // If deep is true, will return all nested properties within
    // unused objects, and have '' as the value for the object.
    const unusedPaths = []
    const recurse = (object, path) => {
      const isObject = object && typeof object === 'object'
      if (path && !this.used[path]) {
        if (deep) {
          if (isObject) {
            unusedPaths.push([path, ''])
          } else {
            unusedPaths.push([path, object])
          }
        } else {
          unusedPaths.push([path, object])
          if (isObject) {
            return
          }
        }
      }
      if (isObject) {
        Object.keys(object).forEach(key => {
          const newPath = path ? `${path}.${key}` : key
          recurse(object[key], newPath)
        })
      }
    }
    const object = this.originalObject
    recurse(object)
    unusedPaths.sort((a, b) => a[0].localeCompare(b[0]))
    return unusedPaths
  }
}

export const touch = (...targets) => {
  // Access target object and nested properties recursively, which triggers
  // the proxy getter function for tracked objects. Prevents target from being listed as unused.
  // Useful for properties that Metax defines automatically. E.g. reference data objects need
  // an identifier and Metax provides the rest.

  const recurse = object => {
    if (object && typeof object === 'object') {
      Object.values(object).forEach(value => {
        recurse(value)
      })
    }
  }
  targets.forEach(target => recurse(target))
}

const track = object => {
  const tracker = new Tracker(object)
  return [tracker.object, tracker]
}

export default track
