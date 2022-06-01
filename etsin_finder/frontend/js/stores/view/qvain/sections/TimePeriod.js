import { makeObservable } from 'mobx'
import Section from './section'

class TimePeriod extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.timePeriod' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'temporal'
}

export default TimePeriod
