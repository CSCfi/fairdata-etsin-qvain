import { makeObservable, override } from 'mobx'
import Section from './section'

class TimePeriod extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.timePeriod' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'temporal'

  @override expandIfPopulated(dataset) {
    if (dataset.temporal?.length > 0) {
      this.setExpanded(true)
    } else {
      this.setExpanded(false)
    }
  }
}

export default TimePeriod
