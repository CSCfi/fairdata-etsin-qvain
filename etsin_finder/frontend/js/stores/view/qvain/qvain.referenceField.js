import { action, observable, computed, makeObservable } from 'mobx'

class ReferenceField {
  constructor(Parent, defaultStorageFactory = () => [], defaultItem = undefined) {
    this.Parent = Parent
    this.defaultStorageFactory = defaultStorageFactory
    this.defaultItem = defaultItem
    makeObservable(this)
  }

  @observable storage

  @observable item = this.defaultItem

  @observable itemStr = ''

  @observable validationError = null

  @action reset = () => {
    this.storage = this.defaultStorageFactory()
    this.item = this.defaultItem
    this.itemStr = ''
    this.validationError = null
  }

  @action
  add = item => {
    this.Parent.setChanged(true)
    this.storage.replace([...this.storage, item])
  }

  @action
  set = array => {
    this.storage.replace(array)
    this.Parent.setChanged(true)
  }

  @action
  setItem = newItem => {
    this.item = newItem
    this.Parent.setChanged(true)
  }

  @action.bound
  addItemStr() {
    if (this.itemStr && this.validate()) {
      this.add(this.itemStr)
      this.removeItemStr()
    }
  }

  @action
  setItemStr = str => {
    this.itemStr = str
    this.Parent.setChanged(true)
  }

  @action
  removeItemStr = () => {
    this.itemStr = ''
  }

  @action
  remove = itemToRemove => {
    this.storage = this.storage.filter(item => item !== itemToRemove)
    this.Parent.setChanged(true)
  }

  @action
  setValidationError = value => {
    this.validationError = value
  }

  @action.bound
  validateStr() {
    this.setValidationError(null)
    if (!this.itemSchema || !this.itemStr) return true
    try {
      this.itemSchema.validateSync(this.itemStr)
    } catch (err) {
      this.setValidationError(err.errors)
      return false
    }

    if (this.storage.includes(this.itemStr)) {
      this.setValidationError(`${this.translationsRoot}.alreadyAdded`)
      return false
    }

    return true
  }

  @action.bound
  validate() {
    this.setValidationError(null)
    if (!this.Schema || !this.validateStr()) return false
    return this.Schema.validate(this.storage, { strict: true })
      .then(res => {
        this.setValidationError(null)
        res(true)
      })
      .catch(err => {
        this.setValidationError(err.errors)
        return false
      })
  }

  toBackend = () => this.storage.map(item => item.url)

  @computed
  get readonly() {
    return this.Parent.readonly
  }
}

export default ReferenceField
