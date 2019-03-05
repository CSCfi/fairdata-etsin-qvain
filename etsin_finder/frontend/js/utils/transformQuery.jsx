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

const httpUrnFiRegex = /^http:\/\/urn.fi\/urn:nbn:fi:(att|csc|ida)/i
const urnFiRegex = /^urn.fi\/urn:nbn:fi:(att|csc|ida)/i
const urnRegex = /^urn:nbn:fi:(att|csc|ida)/i

const isUrnQuery = query => query
  && !/\s/.test(query)
  && (httpUrnFiRegex.test(query) || urnFiRegex.test(query) || urnRegex.test(query))

const transformQuery = query => {
  if (!query) {
    return query
  }

  // Remove possible whitespaces before and after the query
  const tQuery = query.trim()

  let identifier = false
  if (isUrnQuery(tQuery)) {
    identifier = tQuery.substring(tQuery.indexOf('urn:nbn:fi:'))
  }
  if (identifier) {
    return identifier
  }
  return tQuery
}

module.exports = {
  transformQuery,
  isUrnQuery,
}
