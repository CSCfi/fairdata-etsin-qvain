// Utilities for comparing nested objects as flattened representation

// Convert nested values to dotted paths, e.g. {a:{b:'value'}} to {a.b:'value'}

import { isValid, formatDate, parseISO } from 'date-fns'

export const flatten = (root, { normalizeDates = false } = {}) => {
  const flat = {}
  const recurse = (obj, path) => {
    for (const entry of Object.entries(obj)) {
      const key = entry[0]
      let value = entry[1]
      const newPath = path ? `${path}.${key}` : key
      if (value && typeof value === 'object') {
        recurse(value, newPath)
      } else {
        if (normalizeDates && value) {
          // Round dates to milliseconds to avoid small rounding errors from breaking comparisons
          const date = parseISO(value.toString())
          if (isValid(date)) {
            value = formatDate(date, "yyyy-MM-dd'T'HH:mm:ssSSSXXX")
          }
        }
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
