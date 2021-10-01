const removeEmpty = obj => {
  const entries = Object.entries(obj)
    .map(([key, value]) => {
      if (value && typeof value === 'object') {
        return [key, removeEmpty(value)]
      }
      return [key, value]
    })
    .filter(([, value]) => {
      if (value && typeof value === 'object') {
        return Object.entries(value).length > 0
      }
      if (value === '' || value == null) {
        return false
      }
      return true
    })
  if (Array.isArray(obj)) {
    return entries.map(([, value]) => value)
  }
  return Object.fromEntries(entries)
}

export default removeEmpty
