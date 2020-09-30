import ReferenceField from './qvain.referenceField'
import { LICENSE_URL } from '../../../utils/constants'

export const Model = (name, identifier) => ({
  name,
  identifier,
})

class Licenses extends ReferenceField {
  constructor(Parent) {
    super(Parent, () => [Model(undefined, LICENSE_URL.CCBY4)])
  }

  fromBackend = dataset => {
    const l = dataset.access_rights.license ? dataset.access_rights.license : undefined
    if (l !== undefined) {
      this.item = undefined
      this.storage = l.map(license => {
        if (license.identifier !== undefined) {
          return this.Model(license.title, license.identifier)
        }
        const name = {
          en: `Other (URL): ${license.license}`,
          fi: `Muu (URL): ${license.license}`,
        }
        return this.Model(name, license.license)
      })
    } else {
      this.item = undefined
      this.storage = []
    }
  }

  toBackend = () => this.storage

  Model = Model
}

export default Licenses
