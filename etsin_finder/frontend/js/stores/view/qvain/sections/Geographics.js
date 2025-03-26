import { makeObservable, override } from 'mobx'
import Section from './section'

class Geographics extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.geographics' })
    makeObservable(this)
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'spatial'

  @override expandIfPopulated(dataset) {
    if (dataset.spatial?.length > 0) {
      this.setExpanded(true)
    }
  }
}

export default Geographics
