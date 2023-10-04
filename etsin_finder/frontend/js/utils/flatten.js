// Utilities for comparing nested objects as flattened representation

// Convert nested values to dotted paths, e.g. {a:{b:'value'}} to {a.b:'value'}
export const flatten = root => {
  const flat = {}
  const recurse = (obj, path) => {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = path ? `${path}.${key}` : key
      if (value && typeof value === 'object') {
        recurse(value, newPath)
      } else {
        flat[newPath] = value
      }
    }
  }
  recurse(root, '')
  return flat
}

// Remove keys matching list of strings/regexps from flattened object
export const removeMatchingKeys = (data, keys) => {
  let entries = Object.entries(data)
  entries = entries.filter(([entryKey]) => {
    for (const key of keys) {
      if (key === entryKey) {
        return false
      }
      if (key.test?.(entryKey)) {
        return false
      }
    }
    return true
  })
  return Object.fromEntries(entries)
}

export default flatten
