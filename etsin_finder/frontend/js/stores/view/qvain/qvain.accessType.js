import SingleValueField from './qvain.singleValueField'
import { ACCESS_TYPE_URL } from '../../../utils/constants'
import { accessTypeSchema } from '../../../components/qvain/utils/formValidation'

const Model = (name, url) => ({
  name,
  url,
})

class AccessType extends SingleValueField {
  constructor(Parent) {
    super(Parent, accessTypeSchema, Model(undefined, ACCESS_TYPE_URL.OPEN))
  }

  fromBackend = dataset => {
    const at = dataset.access_rights.access_type ? dataset.access_rights.access_type : undefined
    this.value = at ? this.Model(at.pref_label, at.identifier) : this.defaultValue
  }

  Model = Model
}

export default AccessType
