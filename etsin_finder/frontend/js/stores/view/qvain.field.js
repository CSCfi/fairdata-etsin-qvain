import { observable, action, toJS } from 'mobx'
import cloneDeep from 'lodash.clonedeep'

class Field {
  constructor(Parent, Template, fieldName, references = []) {
    this.Parent = Parent
    this.Template = Template
    this.fieldName = fieldName
    this.readonly = Parent.readonly
    this.references = references
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

    Object.keys(toJS(this.inEdit)).forEach((key) => {
      if (this.inEdit[key] && (this.inEdit[key].fi || this.inEdit[key].en)) this.inEdit[key].und = this.inEdit[key].fi || this.inEdit[key].en
    })

    const edited = this.isParentRoot()
      ? this.Parent[this.fieldName].find((s) => s.uiid === this.inEdit.uiid)
      : this.Parent.inEdit[this.fieldName].find((s) => s.uiid === this.inEdit.uiid)

    if (!this.saveEdited(edited)) {
      this.saveNew()
    }
  }

  saveRefs = () => {
    this.references.forEach(ref => {
      this.inEdit[ref.dataIdentifier] = this.inEdit[ref.refIdentifier].save()
      delete this.inEdit[ref.refIdentifier]
    })
  }

  loadRefs = () => {
    this.references.forEach(ref => {
      this.inEdit[ref.refIdentifier] = new ref.Prototype(ref.Origin, this.inEdit[ref.dataIdentifier])
    })
  }

  saveEdited = (edited) => {
    if (edited) {
      this.saveRefs()

      if (this.isParentRoot()) {
        const indexOfItem = this.Parent[this.fieldName].indexOf(edited)
        this.Parent.editItemInField(this.fieldName, indexOfItem, cloneDeep(toJS(this.inEdit)))
      } else {
        const indexOfItem = this.Parent.inEdit[this.fieldName].indexOf(edited)
        this.Parent.inEdit[this.fieldName][indexOfItem] = cloneDeep(toJS(this.inEdit))
      }
      return true
    }
    return false
  }

  saveNew = () => {
    this.validationError = ''
    this.saveRefs()

    if (this.isParentRoot()) {
      this.Parent.addToField(this.fieldName, cloneDeep(toJS(this.inEdit)))
    } else {
      this.Parent.inEdit[this.fieldName] = [...this.Parent.inEdit[this.fieldName], cloneDeep(toJS(this.inEdit))]
    }
  }

  @action clearInEdit = () => {
    this.validationError = ''
    this.setChanged(false)
    this.editMode = false
    this.inEdit = undefined
  }

  @action remove = (uiid) => {
    if (this.isParentRoot()) {
      this.Parent.removeItemInField(this.fieldName, uiid)
    } else this.Parent.inEdit[this.fieldName] = this.Parent.inEdit[this.fieldName].filter((item) => item.uiid !== uiid)
  }

  isParentRoot = () =>
     !this.Parent.inEdit // only root doesn't have inEdit object


  @action edit = (uiid) => {
    this.validationError = ''
    this.setChanged(false)
    this.editMode = true
    const item = this.isParentRoot()
      ? this.Parent[this.fieldName].find((s) => s.uiid === uiid)
      : this.Parent.inEdit[this.fieldName].find((s) => s.uiid === uiid)

    this.inEdit = cloneDeep(toJS(item))

    this.loadRefs()
  }

  @action setValidationError = (error) => {
    this.validationError = error
  }
}

export default Field
