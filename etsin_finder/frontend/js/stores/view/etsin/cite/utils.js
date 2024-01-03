import moment from 'moment'
import idnToLink from '@/utils/idnToLink'

const topOrg = org => {
  if (org.parent) {
    return topOrg(org.parent)
  }
  return org
}

// For surname formatting examples, see
// https://blog.apastyle.org/apastyle/2017/05/whats-in-a-name-two-part-surnames-in-apa-style.html

const startsWithLowerCase = str => !!str && str[0] === str[0].toLowerCase()

const suffixParts = ['Jr', 'Jr.', 'Sr', 'Sr.']

const lastnameParts = ['St', 'St.', 'Af', 'Av', 'De', 'Van', 'Von']

const romanNumeralMatch = /^(((IX|IV|V)I{0,3})|I{1,3})$/

const toInitial = name => `${name[0]}.`

export const getNameParts = name => {
  const parts = name
    .trim()
    .split(' ')
    .filter(part => part.length > 0)
  if (parts.length === 1) {
    return { first: [], last: [parts[0]], suffixes: [] }
  }

  const first = []
  const last = []
  const suffixes = []

  const lastPart = parts[parts.length - 1]
  if (suffixParts.includes(lastPart) || romanNumeralMatch.test(lastPart)) {
    suffixes.push(lastPart)
    parts.splice(parts.length - 1)
  }

  let isFirst = true
  parts.forEach((part, idx) => {
    if (idx === parts.length - 1 || startsWithLowerCase(part) || lastnameParts.includes(part)) {
      isFirst = false
    }
    if (isFirst) {
      first.push(part)
    } else {
      last.push(part)
    }
  })

  return {
    first,
    last,
    suffixes,
  }
}

export const getNameInitials = name => {
  const { first, last, suffixes } = getNameParts(name)

  const components = [last.join(' '), first.map(toInitial).join(' '), suffixes.join(' ')].filter(
    v => v
  )
  return components.join(', ')
}

export const getLastnameFirst = name => {
  const { first, last, suffixes } = getNameParts(name)

  const components = [last.join(' '), first.join(' '), suffixes.join(' ')].filter(v => v)
  return components.join(', ')
}

export const getAuthorsInitial = (dataset, getTranslation, etAlThreshold) => {
  const authors = dataset.creators.map(author => {
    if (!author.person) {
      return getTranslation(topOrg(author.organization)?.pref_label)
    }
    return getNameInitials(getTranslation(author.person.name))
  })

  if (authors.length > etAlThreshold) {
    authors.splice(etAlThreshold - 1, authors.length - etAlThreshold)
    authors[authors.length - 1] = `. . . ${authors[authors.length - 1]}`
  } else if (authors.length > 1) {
    authors[authors.length - 1] = `& ${authors[authors.length - 1]}`
  }
  return authors
}

export const getAuthorsFull = (dataset, getTranslation, etAlThreshold, etAlCount) => {
  const authors = dataset.creators.map((author, index) => {
    if (!author.person) {
      return getTranslation(topOrg(author.organization)?.pref_label)
    }
    if (index === 0) {
      return getLastnameFirst(getTranslation(author.person.name))
    }
    return getTranslation(author.person.name)
  })
  if (authors.length > etAlThreshold) {
    authors.splice(etAlCount)
    authors[authors.length - 1] = `${authors[authors.length - 1]}, et al.`
  } else if (authors.length > 1) {
    authors[authors.length - 1] = `and ${authors[authors.length - 1]}`
  }
  return authors
}

export const getAuthorsFullBibtex = (dataset, getTranslation, etAlThreshold, etAlCount) => {
  const authors = dataset.creators.map(author => {
    if (!author.person) {
      return getTranslation(topOrg(author.organization)?.pref_label)
    }
    return getLastnameFirst(getTranslation(author.person.name))
  })
  if (authors.length > etAlThreshold) {
    authors.splice(etAlCount)
    authors[authors.length - 1] = `${authors[authors.length - 1]} and others`
  }
  return authors
}

export const addParens = string => {
  if (string === undefined) {
    return undefined
  }
  return `(${string})`
}

export const addQuotes = string => {
  if (string === undefined) {
    return undefined
  }
  return `”${string}”`
}

export const capitalizeFirst = string => {
  if (string === undefined) {
    return undefined
  }
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
}

export const getYear = dataset => {
  const issued = dataset.datasetMetadata.issued
  if (!issued) {
    return undefined
  }
  const year = moment(issued).format('YYYY')
  return year
}

export const getMonth = dataset => {
  const issued = dataset.datasetMetadata.issued
  if (!issued) {
    return undefined
  }
  return moment(issued).format('M')
}

export const getTitle = (dataset, getTranslation) => {
  if (!dataset.datasetMetadata.title) {
    return undefined
  }
  return getTranslation(dataset.datasetMetadata.title)
}

export const getVersion = (dataset, getTranslation) => {
  if (!dataset.datasetVersions) {
    return undefined
  }
  const identifier = dataset.identifier
  const versionIndex = dataset.datasetVersions.findIndex(v => v.identifier === identifier)

  if (versionIndex < 0) {
    return undefined
  }

  const version = dataset.datasetVersions.length - versionIndex
  return getTranslation({ en: `Version ${version}`, fi: `versio ${version}` })
}

export const getIdentifier = (dataset, short = false, draftIdentifier = undefined) => {
  let identifier = dataset.draft_of?.preferred_identifier || dataset.persistentIdentifier
  if (!identifier) {
    return undefined
  }
  const url = idnToLink(identifier)
  if (url && !short) {
    return url
  }
  if (short && identifier.startsWith('doi:')) {
    identifier = identifier.slice(4)
  }
  identifier = identifier.toLowerCase()
  if (dataset.state === 'draft') {
    return draftIdentifier
  }
  return identifier
}

export const getPublisher = (dataset, getTranslation) => {
  const pub = dataset.publisher?.organization
  if (pub) {
    const top = topOrg(pub)
    if (top !== pub) {
      return `${getTranslation(top.pref_label)}, ${getTranslation(pub.pref_label)}`
    }
    return getTranslation(pub.pref_label)
  }
  return undefined
}
