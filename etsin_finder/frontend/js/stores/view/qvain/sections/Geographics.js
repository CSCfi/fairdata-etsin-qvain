import { action } from 'mobx'
import Section from './section'

class Geographics extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.geographics' })
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'spatial'

  @action.bound expandIfPopulated(dataset) {
    if (dataset.spatial?.length > 0) {
      this.setExpanded(true)
    }
  }
}

export default Geographics
