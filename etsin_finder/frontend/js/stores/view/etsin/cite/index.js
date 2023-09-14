import { makeObservable, computed } from 'mobx'

import getApaCitation from './apa'
import getChicagoCitation from './chicago'
import getMlaCitation from './mla'
import getBibtexCitation from './bibtex'

class Cite {
  constructor({ Stores, Locale }) {
    makeObservable(this)
    this.getTranslation = Locale.getValueTranslation
    this.Stores = Stores
  }

  @computed get apa() {
    return getApaCitation(this.Stores, this.getTranslation)
  }

  @computed get chicago() {
    return getChicagoCitation(this.Stores, this.getTranslation)
  }

  @computed get mla() {
    return getMlaCitation(this.Stores, this.getTranslation)
  }

  @computed get bibtex() {
    return getBibtexCitation(this.Stores, this.getTranslation)
  }
}

export default Cite
