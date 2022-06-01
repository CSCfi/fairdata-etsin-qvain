import { makeObservable } from 'mobx'
import Section from './section'

class History extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.history' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'provenance'
}

export default History
