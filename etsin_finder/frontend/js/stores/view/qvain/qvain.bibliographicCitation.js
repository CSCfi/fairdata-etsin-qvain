import { action, makeObservable } from 'mobx'
import SingleValueField from './qvain.singleValueField'

class BibliographicCitation extends SingleValueField {
  constructor(Parent) {
    super(Parent)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.reset()
    this.value = dataset.bibliographic_citation
  }
}

export default BibliographicCitation
