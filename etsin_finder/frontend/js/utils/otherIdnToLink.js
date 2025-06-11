export default function otherIdnToLink(otherIdn) {
  if (otherIdn.startsWith('doi:')) {
    return otherIdn.replace('doi:', 'https://doi.org/')
  }

  if (otherIdn.toLowerCase().startsWith('urn:nbn:fi:')) {
    return `https://urn.fi/urn:nbn:fi:${otherIdn.substring('urn:nbn:fi:'.length)}`
  }

  if (
    otherIdn.toLowerCase().startsWith('https://doi.org') ||
    otherIdn.toLowerCase().startsWith('https://urn.fi')
  ) {
    return otherIdn
  }

  if (
    otherIdn.toLowerCase().startsWith('http://doi.org') ||
    otherIdn.toLowerCase().startsWith('http://urn.fi')
  ) {
    return otherIdn
  }

  return ''
}
