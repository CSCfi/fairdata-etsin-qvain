import { action } from 'mobx'
import Section from './section'

class History extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.history' })
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'provenance'

  @action.bound expandIfPopulated(dataset) {
    if (dataset.provenance?.length > 0) {
      this.setExpanded(true)
    }
  }
}

export default History
