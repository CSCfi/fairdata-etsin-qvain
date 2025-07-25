import { makeObservable } from 'mobx'
import Section from './section'

class DataOrigin extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.dataOrigin' })
    makeObservable(this)
  }

  isRequired = true
  showAsterisk = true
}

export default DataOrigin
