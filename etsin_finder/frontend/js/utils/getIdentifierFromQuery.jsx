// Check if a query string start with any of the listed prefixes. If it does, extract the identifier and return it.

const httpUrnFiAttUrnPrefix = 'http://urn.fi/urn:nbn:fi:att:'
const urnFiAttUrnPrefix = 'urn.fi/urn:nbn:fi:att:'
const attUrnPrefix = 'urn:nbn:fi:att:'

const getIdentifierFromQuery = (query) => {
  if (!query) {
    return ''
  }

  // Remove possible whitespaces before and after the query
  const trimmedQuery = query.trim()

  let identifier = ''
  if (trimmedQuery && !/\s/.test(trimmedQuery) &&
        (trimmedQuery.startsWith(httpUrnFiAttUrnPrefix) ||
        trimmedQuery.startsWith(urnFiAttUrnPrefix) ||
        trimmedQuery.startsWith(attUrnPrefix))) {
    identifier = trimmedQuery.substring(trimmedQuery.indexOf(attUrnPrefix))
  }
  return identifier
}

export default getIdentifierFromQuery
