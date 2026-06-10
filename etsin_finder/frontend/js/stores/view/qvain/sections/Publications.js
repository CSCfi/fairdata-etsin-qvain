import { action } from 'mobx'
import Section from './section'

class Publications extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.publications' })
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'relation'

  @action.bound expandIfPopulated(dataset) {
    if (dataset.relation?.length > 0) {
      this.setExpanded(true)
    }
  }
}

export default Publications
