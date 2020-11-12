import { action, makeObservable } from 'mobx'
import translate from 'counterpart'
import ReferenceField from './qvain.referenceField'
import { otherIdentifierSchema } from '../../../components/qvain/utils/formValidation'

class OtherIdentifiers extends ReferenceField {
  constructor(...args) {
    super(...args)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.reset()
    this.storage = dataset.other_identifier ? dataset.other_identifier.map(oid => oid.notation) : []
  }

  // move this to qvain.otherIdentifier class when refactor ticket is merged
  @action cleanupOtherIdentifiers = () => {
    const { item, storage, addItemStr, setValidationError } = this
    if (item !== '') {
      try {
        otherIdentifierSchema.validateSync(item)
      } catch (err) {
        this.Parent.Submit.setError(err)
        setValidationError(err.errors)
        return false
      }
      if (!storage.includes(item)) {
        addItemStr()
        this.Parent.Submit.clearResponse()
        return true
      }
      const message = translate('qvain.description.otherIdentifiers.alreadyAdded')
      setValidationError(message)
      return false
    }
    return true
  }
}

export default OtherIdentifiers
