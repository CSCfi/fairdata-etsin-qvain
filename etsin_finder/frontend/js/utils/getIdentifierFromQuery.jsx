// -----------------------------
// This is currently not in use.
// -----------------------------

// Check if a query string start with any of the listed prefixes. If it does, extract the identifier and return it.
// New search functionality won't work with these
const httpUrnFiAttUrnPrefix = 'http://urn.fi/urn:nbn:fi:att:'
const urnFiAttUrnPrefix = 'urn.fi/urn:nbn:fi:att:'

const attUrnPrefix = 'urn:nbn:fi:att:'

const getIdentifierFromQuery = query => {
  if (!query) {
    return false
  }

  // Remove possible whitespaces before and after the query
  const trimmedQuery = query.trim()

  let identifier = false
  if (
    trimmedQuery &&
    !/\s/.test(trimmedQuery) &&
    (trimmedQuery.startsWith(httpUrnFiAttUrnPrefix) ||
      trimmedQuery.startsWith(urnFiAttUrnPrefix) ||
      trimmedQuery.startsWith(attUrnPrefix))
  ) {
    identifier = trimmedQuery.substring(trimmedQuery.indexOf(attUrnPrefix))
  }
  return identifier
}

export default getIdentifierFromQuery
