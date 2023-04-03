import moment from 'moment'
import idnToLink from '@/utils/idnToLink'

const topOrg = org => {
  if (org.is_part_of) {
    return topOrg(org.is_part_of)
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
  const authors = (dataset.research_dataset.creator || []).map(author => {
    if (author['@type'] === 'Organization') {
      return getTranslation(topOrg(author)?.name)
    }
    return getNameInitials(getTranslation(author.name))
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
  const authors = (dataset.research_dataset.creator || []).map((author, index) => {
    if (author['@type'] === 'Organization') {
      return getTranslation(topOrg(author)?.name)
    }
    if (index === 0) {
      return getLastnameFirst(getTranslation(author.name))
    }
    return getTranslation(author.name)
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
  const authors = (dataset.research_dataset.creator || []).map(author => {
    if (author['@type'] === 'Organization') {
      return getTranslation(topOrg(author)?.name)
    }
    return getLastnameFirst(getTranslation(author.name))
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
  const issued = dataset.research_dataset.issued
  if (!issued) {
    return undefined
  }
  const year = moment(issued).format('YYYY')
  return year
}

export const getMonth = dataset => {
  const issued = dataset.research_dataset.issued
  if (!issued) {
    return undefined
  }
  return moment(issued).format('M')
}

export const getTitle = (dataset, getTranslation) => {
  if (!dataset.research_dataset.title) {
    return undefined
  }
  return getTranslation(dataset.research_dataset.title)
}

export const getVersion = (dataset, getTranslation) => {
  if (!dataset.dataset_version_set) {
    return undefined
  }
  const identifier = dataset.identifier
  const versionIndex = dataset.dataset_version_set.findIndex(v => v.identifier === identifier)
  if (versionIndex < 0) {
    return undefined
  }
  const version = dataset.dataset_version_set.length - versionIndex
  return getTranslation({ en: `Version ${version}`, fi: `versio ${version}` })
}

export const getIdentifier = (dataset, short = false, draftIdentifier = undefined) => {
  let identifier =
    dataset.draft_of?.preferred_identifier || dataset.research_dataset.preferred_identifier
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
  const pub = dataset.research_dataset.publisher
  if (pub) {
    const top = topOrg(pub)
    if (top !== pub) {
      return `${getTranslation(top.name)}, ${getTranslation(pub.name)}`
    }
    return getTranslation(pub.name)
  }
  return undefined
}
