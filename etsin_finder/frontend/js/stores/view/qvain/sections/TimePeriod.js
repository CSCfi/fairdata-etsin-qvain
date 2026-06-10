import { action } from 'mobx'
import Section from './section'

class TimePeriod extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.timePeriod' })
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'temporal'

  @action.bound expandIfPopulated(dataset) {
    if (dataset.temporal?.length > 0) {
      this.setExpanded(true)
    } else {
      this.setExpanded(false)
    }
  }
}

export default TimePeriod
