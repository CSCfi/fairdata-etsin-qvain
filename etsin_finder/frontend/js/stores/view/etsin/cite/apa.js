import CitationBuilder from './citationBuilder'
import {
  getYear,
  getTitle,
  getVersion,
  getIdentifier,
  addParens,
  getAuthorsInitial,
  getPublisher,
} from './utils'

const getCitation = (dataset, getTranslation) => {
  const citation = new CitationBuilder({
    sep: '.',
    parts: [
      {
        parts: [
          {
            sep: ',',
            parts: getAuthorsInitial(dataset, getTranslation, 20),
          },
        ],
      },
      addParens(getYear(dataset)),
      {
        parts: [
          {
            sep: '',
            parts: [
              getTitle(dataset, getTranslation),
              addParens(getVersion(dataset, getTranslation)),
            ],
          },
        ],
      },
      getPublisher(dataset, getTranslation),
      getIdentifier(dataset),
    ],
  })
  return citation.get()
}

export default getCitation
