export const getCookieValue = key => {
  const entry = document.cookie.split('; ').find(row => row.startsWith(key))
  if (entry) {
    return entry.split('=')[1]
  }
  return undefined
}

export const setCookieValue = (key, value) => {
  document.cookie = `${key}=${value}`
}
