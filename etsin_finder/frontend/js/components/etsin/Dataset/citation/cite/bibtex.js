import CitationBuilder from './citationBuilder'
import {
  getYear,
  getMonth,
  getTitle,
  getIdentifier,
  getPublisher,
  getAuthorsFullBibtex,
} from './utils'

const bibtexItem = label => val => {
  if (val === undefined) {
    return undefined
  }
  return `${label} = {${val}}`
}

const bibtexWrapper = citation => {
  if (citation === '') {
    return ''
  }
  return `@misc{${citation}\n}`
}

const urlWrapper = string => {
  if (string === undefined) {
    return undefined
  }
  return `\\url{${string}}`
}

const getCitation = (dataset, getTranslation) => {
  const short = true
  const citation = new CitationBuilder({
    sep: ',',
    space: '\n',
    parts: [
      getIdentifier(dataset, short, 'draft'),
      {
        wrapper: bibtexItem('author'),
        sep: ' and',
        parts: getAuthorsFullBibtex(dataset, getTranslation, 7, 10),
      },
      bibtexItem('title')(getTitle(dataset, getTranslation)),
      bibtexItem('howpublished')(urlWrapper(getIdentifier(dataset))),
      bibtexItem('month')(getMonth(dataset)),
      bibtexItem('year')(getYear(dataset)),
      bibtexItem('note')(getPublisher(dataset, getTranslation)),
    ],
  })
  return bibtexWrapper(citation.get({ capitalize: false }))
}

export default getCitation
