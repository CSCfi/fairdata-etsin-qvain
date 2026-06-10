import Section from './section'

class Infrastructure extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.infrastructure' })
  }

  isRequired = false

  // used for checking if dataset has items
  metaxFieldName = 'infrastructure'
}

export default Infrastructure
