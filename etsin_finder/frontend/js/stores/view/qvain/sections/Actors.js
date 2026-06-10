import Section from './section'

class Actors extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.actors' })
  }

  isRequired = true
  showAsterisk = true
}

export default Actors
