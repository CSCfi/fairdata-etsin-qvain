import { makeObservable } from 'mobx'
import Section from './section'

class Publications extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.publications' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'relation'
}

export default Publications
