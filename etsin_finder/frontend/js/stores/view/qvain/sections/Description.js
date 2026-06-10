import Section from './section'

class Description extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.description' })
  }

  isRequired = true
}

export default Description
