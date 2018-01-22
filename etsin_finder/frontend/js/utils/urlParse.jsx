const UrlParse = {
  searchParams: (url) => {
    const params = {}
    const search = url.slice(1)
    const definitions = search.split('&')
    definitions.forEach(val => {
      const parts = val.split('=', 2)
      params[parts[0]] = parts[1]
    })
    return search !== '' ? params : null
  },

  makeSearchParams: (params) => {
    let url = '?'
    const keys = Object.keys(params)
    for (let i = 0; i < keys.length; i += 1) {
      url = `${url}${keys[i]}=${params[keys[i]]}`
      if (i + 1 < keys.length) url = `${url}&`
    }
    return url
  }
}

export default UrlParse
