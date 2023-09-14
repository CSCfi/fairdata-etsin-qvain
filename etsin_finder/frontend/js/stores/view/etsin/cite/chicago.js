import CitationBuilder from './citationBuilder'
import { getYear, getTitle, getVersion, getIdentifier, getPublisher, addQuotes, getAuthorsFull, capitalizeFirst } from './utils'


const getCitation = (dataset, getTranslation) => {
  const citation = new CitationBuilder({
    sep: '.',
    parts: [
      { sep: ',', parts: getAuthorsFull(dataset, getTranslation, 10, 7) },
      getYear(dataset),
      addQuotes(getTitle(dataset, getTranslation)),
      capitalizeFirst(getVersion(dataset, getTranslation)),
      getPublisher(dataset, getTranslation),
      getIdentifier(dataset),
    ]
  })
  return citation.get()
}

export default getCitation
