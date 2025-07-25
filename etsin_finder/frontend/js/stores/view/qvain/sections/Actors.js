import { makeObservable } from 'mobx'
import Section from './section'

class Actors extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.actors' })
    makeObservable(this)
  }

  isRequired = true
  showAsterisk = true
}

export default Actors
