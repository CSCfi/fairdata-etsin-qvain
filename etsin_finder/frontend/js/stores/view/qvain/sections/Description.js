import { makeObservable } from 'mobx'
import Section from './section'

class Description extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.description' })
    makeObservable(this)
  }

  isRequired = true
}

export default Description
