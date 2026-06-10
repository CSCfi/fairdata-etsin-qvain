import Section from './section'

class AdminOrg extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.adminOrg' })
  }

  isRequired = true
  showAsterisk = true
}

export default AdminOrg
