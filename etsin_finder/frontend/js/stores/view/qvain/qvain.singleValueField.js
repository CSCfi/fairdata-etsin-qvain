import { action, observable, computed, makeObservable } from 'mobx'

class SingleValueField {
  constructor(Parent, Schema = undefined, defaultValue = undefined) {
    this.Parent = Parent
    this.defaultValue = defaultValue
    this.Schema = Schema
    this.reset()
    makeObservable(this)
    this.set = this.set.bind(this)
  }

  @observable value = this.defaultValue

  @observable validationError = null

  @action set(newValue) {
    this.value = newValue
    this.Parent.setChanged(true)
  }

  @action.bound reset() {
    this.value = this.defaultValue
    this.validationError = undefined
  }

  @action setValidationError = error => {
    this.validationError = error
  }

  @action.bound
  validate() {
    if (!this.Schema) return
    this.Schema.validate(this.value, { strict: true })
      .then(() => {
        this.setValidationError(null)
      })
      .catch(err => {
        this.setValidationError(err.errors)
      })
  }

  toBackend = () => this.value

  @computed
  get readonly() {
    return this.Parent.readonly
  }
}

export default SingleValueField
