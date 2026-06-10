import Section from './section'

class DataOrigin extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.dataOrigin' })
  }

  isRequired = true
  showAsterisk = true
}

export default DataOrigin
