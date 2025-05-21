{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

const UrlParse = {
  searchParams: url => {
    const params = {}
    const search = url.slice(1)
    const definitions = search.split('&')
    definitions.forEach(val => {
      const parts = val.split('=', 2)
      params[parts[0]] = parts[1]
    })
    return search !== '' ? params : null
  },

  makeSearchParams: params => {
    let url = '?'
    const keys = Object.keys(params)
    for (let i = 0; i < keys.length; i += 1) {
      url = `${url}${keys[i]}=${params[keys[i]]}`
      if (i + 1 < keys.length) url = `${url}&`
    }
    return url
  },
}

export default UrlParse
