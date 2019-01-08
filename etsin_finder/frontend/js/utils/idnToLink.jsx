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

export default function idnToLink(idn) {
  const sub3 = idn.substring(0, 3)
  const sub4 = idn.substring(0, 4)
  if (sub3 === 'urn' || sub3 === 'doi') {
    const page = sub3 === 'doi' ? 'https://doi.org' : 'http://urn.fi'
    return `${page}/${sub3 === 'doi' ? idn.substring(4) : idn}`
  } else if (sub4 === 'http') {
    return idn
  }
  return false
}
