import { makeObservable, override } from 'mobx'
import Section from './section'

class History extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.history' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'provenance'

  @override expandIfPopulated(dataset) {
    if (dataset.provenance?.length > 0) {
      this.setExpanded(true)
    }
  }
}

export default History
