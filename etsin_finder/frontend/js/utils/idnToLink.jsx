export default function idnToLink(idn) {
  const sub3 = idn.substring(0, 3)
  const sub4 = idn.substring(0, 4)
  if (sub3 === 'urn' || sub3 === 'doi') {
    const page = sub3 === 'doi' ? 'https://doi.org' : 'http://urn.fi'
    return `${page}/${idn}`
  } else if (sub4 === 'http') {
    return idn
  }
  return false
}
