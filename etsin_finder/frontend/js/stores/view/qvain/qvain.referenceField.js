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

  @action
  addItemStr = () => {
    if (this.itemStr) {
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

  toBackend = () => this.storage.map(item => item.url)

  @computed
  get readonly() {
    return this.Parent.readonly
  }
}

export default ReferenceField
