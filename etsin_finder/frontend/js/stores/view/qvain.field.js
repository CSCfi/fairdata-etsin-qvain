import { observable, action, toJS } from 'mobx'
import cloneDeep from 'lodash.clonedeep'

class Field {
  constructor(Parent, Template, fieldName, subFields = []) {
    this.Parent = Parent
    this.Template = Template
    this.fieldName = fieldName
    this.readonly = Parent.readonly
    this.subFields = subFields
  }

  @observable hasChanged

  @observable inEdit

  @observable editMode

  @observable validationError

  @action setChanged = (val) => {
    this.hasChanged = val
  }

  @action create = () => {
    this.setChanged(false)
    this.editMode = false
    this.inEdit = this.Template()
  }

  @action changeAttribute = (attribute, value) => {
    this.setChanged(true)
    this.inEdit[attribute] = value
  }

  @action save = () => {
    this.setChanged(false)
    this.editMode = false
    const edited = this.Parent[this.fieldName].find((s) => s.uiid === this.inEdit.uiid)
    if (!this.saveEdited(edited)) {
      this.saveNew()
    }
  }

  saveEdited = (edited) => {
    if (edited) {
      const indexOfItem = this.Parent[this.fieldName].indexOf(edited)
      this.subFields.forEach(sf => { this.inEdit[sf] = cloneDeep(toJS(this[sf])) })
      this.Parent[this.fieldName][indexOfItem] = cloneDeep(toJS(this.inEdit))
      return true
    }
    return false
  }

  saveNew = () => {
    this.validationError = ''
    this.subFields.forEach(sf => {
      this.inEdit[sf] = cloneDeep(toJS(this[sf]))
      console.log(toJS(this))
    })
    this.Parent[this.fieldName].push(cloneDeep(toJS(this.inEdit)))
  }

  @action clearInEdit = () => {
    this.validationError = ''
    this.setChanged(false)
    this.editMode = false
    this.subFields.forEach(sf => { this[sf] = [] })
    this.inEdit = undefined
  }

  @action remove = (uiid) => {
    this.Parent[this.fieldName] = this.Parent[this.fieldName].filter((item) => item.uiid !== uiid)
  }

  @action edit = (uiid) => {
    this.validationError = ''
    this.setChanged(false)
    this.editMode = true
    const item = this.Parent[this.fieldName].find((s) => s.uiid === uiid)
    this.inEdit = cloneDeep(toJS(item))
    console.log(toJS(this.inEdit))
    this.subFields.forEach(sf => {
      this[sf] = cloneDeep(toJS(this.inEdit[sf]))
      console.log(toJS(this[sf]))
     })
  }

  @action setValidationError = (error) => {
    this.validationError = error
  }
}

export default Field
