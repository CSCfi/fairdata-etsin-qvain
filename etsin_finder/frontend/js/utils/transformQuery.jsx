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

const httpUrnFiAttUrnPrefix = 'http://urn.fi/urn:nbn:fi:att:'
const urnFiAttUrnPrefix = 'urn.fi/urn:nbn:fi:att:'
const attUrnPrefix = 'urn:nbn:fi:att:'

const transformQuery = query => {
  if (!query) {
    return query
  }

  // Remove possible whitespaces before and after the query
  const tQuery = query.trim()

  let identifier = false
  if (
    tQuery &&
    !/\s/.test(tQuery) &&
    (tQuery.startsWith(httpUrnFiAttUrnPrefix) ||
      tQuery.startsWith(urnFiAttUrnPrefix) ||
      tQuery.startsWith(attUrnPrefix))
  ) {
    identifier = tQuery.substring(tQuery.indexOf(attUrnPrefix))
  }
  if (identifier) {
    return identifier
  }
  return tQuery
}

export default transformQuery
