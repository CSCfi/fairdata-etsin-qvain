import { makeObservable, override } from 'mobx'
import Section from './section'

class Project extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.projectV2' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'is_output_of'

  @override expandIfPopulated(dataset) {
    if (dataset.is_output_of?.length > 0) {
      this.setExpanded(true)
    }
  }
}

export default Project
