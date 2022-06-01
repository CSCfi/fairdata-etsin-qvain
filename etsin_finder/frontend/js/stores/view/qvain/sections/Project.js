import { makeObservable } from 'mobx'
import Section from './section'

class Project extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.projectV2' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'is_output_of'
}

export default Project
