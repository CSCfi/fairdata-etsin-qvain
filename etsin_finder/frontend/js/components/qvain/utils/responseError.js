const stringify = value => {
  // Make the output cleaner by unpacking single-item arrays.
  let val = value
  if (Array.isArray(val) && val.length === 1) {
    val = val[0]
  }
  // Convert value to string if needed
  if (typeof val !== 'string') {
    val = JSON.stringify(val)
  }
  return val
}

export const getResponseError = err => {
  // Return an array of error strings based on an Axios error response.
  const data = err.response && err.response.data
  if (data) {
    if (typeof data === 'object') {
      // JSON error message
      return Object.entries(data).map(([key, value]) => `${key}: ${stringify(value)}`)
    }
    // string error message
    return [data]
  }
  // no response
  return [`Error: ${err.message}`]
}

export default getResponseError
