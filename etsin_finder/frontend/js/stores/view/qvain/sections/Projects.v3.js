import { makeObservable } from 'mobx'
import Section from './section'

class Projects extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.projectV2' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'projects'
}

export default Projects
