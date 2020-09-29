import { action, observable, computed } from 'mobx'

class ReferenceField {
  constructor(Parent, defaultStorageFactory = () => [], defaultItem = undefined) {
    this.Parent = Parent
    this.defaultStorageFactory = defaultStorageFactory
    this.defaultItem = defaultItem
  }

  @observable storage = this.defaultStorageFactory()

  @observable item = this.defaultItem

  @observable itemStr = ''

  @observable validationError = null

  @action reset = () => {
    this.storage = []
    this.item = this.defaultItem
    this.itemStr = ''
    this.validationError = null
  }

  @action
  add = item => {
    this.changed = true
    this.storage = [...this.storage, item]
  }

  @action
  set = array => {
    this.storage = array
    this.Parent.setChanged(true)
  }

  @action
  setItem = newItem => {
    this.item = newItem
    this.Parent.setChanged(true)
  }

  @action
  addItemStr = () => {
    this.add(this.itemStr)
    this.removeItemStr()
  }

  @action
  setItemStr = str => {
    this.itemStr = str
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
