import { makeObservable } from 'mobx'
import Section from './section'

class Infrastructure extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.infrastructure' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'infrastructure'
}

export default Infrastructure
