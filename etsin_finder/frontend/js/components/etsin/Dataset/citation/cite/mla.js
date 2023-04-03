import CitationBuilder from './citationBuilder'
import {
  getYear, getTitle, getVersion, getIdentifier,
  getPublisher, addQuotes, getAuthorsFull, capitalizeFirst
} from './utils'

const getCitation = (dataset, getTranslation) => {
  const citation = new CitationBuilder({
    sep: '.',
    parts: [
      {
        sep: ',',
        parts: getAuthorsFull(dataset, getTranslation, 3, 1)
      },
      addQuotes(getTitle(dataset, getTranslation)),
      capitalizeFirst(getVersion(dataset, getTranslation)),
      {
        sep: ',',
        parts: [getPublisher(dataset, getTranslation), getYear(dataset)]
      },
      getIdentifier(dataset),
    ]
  })
  return citation.get()
}

export default getCitation
