export default function idnToLink(identifier) {
  if (identifier.startsWith('doi:')) {
    return identifier.replace('doi:', 'https://doi.org/')
  }
  if (identifier.startsWith('reportronic.fi/') || identifier.startsWith('url:reportronic.fi/')) {
    if (identifier.startsWith('url:reportronic.fi/')) {
      return `https://${identifier.slice(4)}`
    }
    return `https://${identifier}`
  }
  if (identifier.toLowerCase().startsWith('urn:nbn:fi:')) {
    return `https://urn.fi/urn:nbn:fi:${identifier.substring('urn:nbn:fi:'.length)}`
  }
  if (identifier.startsWith('http:') || identifier.startsWith('https:')) {
    return identifier
  }
  if (identifier.startsWith('url:')) {
    return identifier.replace('url:', '')
  }
  return ''
}
