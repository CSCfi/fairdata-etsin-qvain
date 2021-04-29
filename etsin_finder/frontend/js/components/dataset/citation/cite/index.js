import getApaCitation from './apa'
import getChicagoCitation from './chicago'
import getMlaCitation from './mla'

class Cite {
  constructor(getTranslation) {
    this.getTranslation = getTranslation
    this.apa = this.apa.bind(this)
    this.chicago = this.chicago.bind(this)
    this.mla = this.mla.bind(this)
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
}

export default Cite
