// Check if a query string start with any of the listed prefixes. If it does, extract the identifier and return it.

const httpUrnFiAttUrnPrefix = 'http://urn.fi/urn:nbn:fi:att:'
const urnFiAttUrnPrefix = 'urn.fi/urn:nbn:fi:att:'
const attUrnPrefix = 'urn:nbn:fi:att:'

const getIdentifierFromQuery = (query) => {
  if (!query) {
    return ''
  }

  // Remove possible whitespaces before and after the query
  query = query.trim()

  let identifier = ''
  if (query && !/\s/.test(query) &&
        (query.startsWith(httpUrnFiAttUrnPrefix) ||
        query.startsWith(urnFiAttUrnPrefix) ||
        query.startsWith(attUrnPrefix))) {
    identifier = query.substring(query.indexOf(attUrnPrefix))
  }
  return identifier
}

export default getIdentifierFromQuery
