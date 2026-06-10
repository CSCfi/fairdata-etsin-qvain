import { action } from 'mobx'
import Section from './section'

class Projects extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.projectV2' })
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'projects'

  @action.bound expandIfPopulated(dataset) {
    if (dataset.projects?.length > 0) {
      this.setExpanded(true)
    }
  }
}

export default Projects
