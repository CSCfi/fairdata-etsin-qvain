import { makeObservable, override } from 'mobx'
import Section from './section'

class Projects extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.projectV2' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'projects'

  @override expandIfPopulated(dataset) {
    if (dataset.projects?.length > 0) {
      this.setExpanded(true)
    }
  }
}

export default Projects
