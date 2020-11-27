import moment from 'moment'

export const getCookieValue = key => {
  const entry = document.cookie.split('; ').find(row => row.startsWith(key))
  if (entry) {
    return entry.split('=')[1]
  }
  return undefined
}

export const setCookieValue = (domain, key, value) => {
  const parts = [`${key}=${value}`, 'path=/']
  parts.push(`expires=${moment().add(7, 'days').toISOString()}`)

  if (domain) {
    parts.push(`domain=${domain}`)
  }

  document.cookie = parts.join('; ')
}
