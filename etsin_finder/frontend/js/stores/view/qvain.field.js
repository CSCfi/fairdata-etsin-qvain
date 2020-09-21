import { observable, computed, action, toJS } from 'mobx'
import cloneDeep from 'lodash.clonedeep'

class Field {
  constructor(Parent, Template, Model, fieldName, references = []) {
    this.Template = Template
    this.Model = Model
    this.fieldName = fieldName
    this.references = references
    this.Parent = Parent
  }

  @computed
  get readonly() {
    return this.Parent.readonly
  }

  @observable storage = []

  @observable hasChanged

  @observable inEdit

  @observable editMode

  @observable validationError

  @action setChanged = val => {
    this.hasChanged = val
  }

  @action create = () => {
    this.setChanged(false)
    this.editMode = false
    this.inEdit = this.Template()
    this.validationError = undefined
  }

  @action changeAttribute = (attribute, value) => {
    this.setChanged(true)
    this.inEdit[attribute] = value
  }

  @action save = () => {
    this.setChanged(false)
    this.editMode = false

    Object.keys(toJS(this.inEdit)).forEach(key => {
      if (this.inEdit[key] && (this.inEdit[key].fi || this.inEdit[key].en)) {
        this.inEdit[key].und = this.inEdit[key].fi || this.inEdit[key].en
      }
    })

    const edited = this.storage.find(s => s.uiid === this.inEdit.uiid)

    if (!this.saveEdited(edited)) {
      this.saveNew()
    }
  }

  saveEdited = edited => {
    this.validationError = ''

    if (edited) {
      const refs = this.detachRefs(this.inEdit)
      const indexOfItem = this.storage.indexOf(edited)
      this.storage[indexOfItem] = cloneDeep(toJS(this.inEdit))
      this.attachRefs(refs, this.storage[indexOfItem])

      return true
    }

    return false
  }

  saveNew = () => {
    this.validationError = ''
    const refs = this.detachRefs(this.inEdit)
    const index = this.storage.length
    this.storage = [...this.storage, cloneDeep(toJS(this.inEdit))]
    this.attachRefs(refs, this.storage[index])
  }

  @action clearInEdit = () => {
    this.validationError = ''
    this.setChanged(false)
    this.editMode = false
    this.inEdit = undefined
  }

  @action remove = uiid => {
    this.storage = this.storage.filter(item => item.uiid !== uiid)
  }

  @action edit = uiid => {
    this.validationError = ''
    this.setChanged(false)
    this.editMode = true
    const item = this.storage.find(s => s.uiid === uiid)

    const clonedRefs = this.cloneRefs(item)
    const refs = this.detachRefs(item)

    this.inEdit = cloneDeep(toJS(item))

    this.attachRefs(clonedRefs, this.inEdit)
    this.attachRefs(refs, item)
  }

  @action setValidationError = error => {
    this.validationError = error
  }

  @action
  fromBackend = (data, Qvain) => {
    this.storage = []
    if (data !== undefined) {
      data.forEach(element => {
        const item = this.Model(element, Qvain)
        this.storage.push(item)
      })
    }
  }

  detachRefs = item => {
    const refs = {}
    this.references.forEach(ref => {
      refs[ref] = item[ref]
      item[ref] = undefined
    })
    return refs
  }

  attachRefs = (refs, item) => {
    this.references.forEach(ref => {
      item[ref] = refs[ref]
    })
  }

  cloneRefs = item => {
    const refs = {}
    this.references.forEach(ref => {
      refs[ref] = item[ref].clone()
    })
    return refs
  }
}

export default Field
