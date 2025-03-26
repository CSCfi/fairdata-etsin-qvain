import { makeObservable, override } from 'mobx'
import Section from './section'

class Publications extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.publications' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'relation'

  @override expandIfPopulated(dataset) {
    if (dataset.relation?.length > 0) {
      this.setExpanded(true)
    }
  }
}

export default Publications
