import { makeObservable } from 'mobx'
import Section from './section'

class AdminOrg extends Section {
  constructor() {
    super({ translationsRoot: 'qvain.sections.adminOrg' })
    makeObservable(this)
  }

  isRequired = true
  showAsterisk = true
}

export default AdminOrg
