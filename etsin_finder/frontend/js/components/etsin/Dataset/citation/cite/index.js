import getApaCitation from './apa'
import getChicagoCitation from './chicago'
import getMlaCitation from './mla'
import getBibtexCitation from './bibtex'

class Cite {
  constructor(getTranslation) {
    this.getTranslation = getTranslation
    this.apa = this.apa.bind(this)
    this.chicago = this.chicago.bind(this)
    this.mla = this.mla.bind(this)
    this.bibtex = this.bibtex.bind(this)
  }

  apa(dataset) {
    return getApaCitation(dataset, this.getTranslation)
  }

  chicago(dataset) {
    return getChicagoCitation(dataset, this.getTranslation)
  }

  mla(dataset) {
    return getMlaCitation(dataset, this.getTranslation)
  }

  bibtex(dataset) {
    return getBibtexCitation(dataset, this.getTranslation)
  }
}

export default Cite
