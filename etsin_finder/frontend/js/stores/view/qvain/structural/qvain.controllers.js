import { action, makeObservable } from 'mobx'
import { ValidationError } from 'yup'

import { attachMandatoryArgs } from './helpers'

export class CommonController {
  constructor(args) {
    this.mandatoryArgs = ['instance']
    makeObservable(this)

    this.init()
    this.attachMandatoryArgs(args)
  }

  @action.bound init() {
    // add initial actions of the inherited class by using @override init()
    // in the inherited class's definition
  }

  attachMandatoryArgs = attachMandatoryArgs

  @action.bound set({ fieldName, value }) {
    this.instance[fieldName] = value
  }

  @action.bound validate(fieldName) {
    if (fieldName)
      try {
        this.instance.validationError[fieldName] = ''
        this.instance.schema?.[fieldName]?.validateSync?.(
          this.instance.adapter.toMetaxV3()[fieldName],
          {
            strict: true,
          }
        )
      } catch (e) {
        this.instance.validationError[fieldName] = e.message
      }
    else if (this.instance.schema)
      Object.entries(this.instance.schema)?.forEach(([key, value]) => {
        try {
          this.instance.validationError[key] = ''
          const validable = this.instance.adapter.toMetaxV3()[key]
          value.validateSync?.(validable, {
            strict: true,
          })
        } catch (e) {
          if (e instanceof ValidationError) this.setValidationError(key, e)
          else console.error(e)
        }
      })
  }

  @action.bound setValidationError(key, e) {
    this.instance.validationError[key] = e.message
  }
}

export class ListController extends CommonController {
  constructor(args) {
    super(args)
    makeObservable(this)
    this.mandatoryArgs = [...this.mandatoryArgs, 'Model']
    this.attachMandatoryArgs(args)

    if (!('inEdit' in this.instance)) {
      console.error(this.instance.prototype.name, 'instance is missing inEdit property')
    }
  }

  @action.bound save() {
    this.validate()

    const foundIndex = this.instance.storage.findIndex(
      item => item.itemId === this.instance.inEdit.itemId
    )

    if (foundIndex < 0) {
      this.instance.storage.push(this.instance.inEdit)
    } else {
      this.instance.storage[foundIndex] = this.instance.inEdit
    }

    this.create()
  }

  @action.bound create() {
    this.instance.inEdit = new this.Model()
  }

  @action.bound remove(itemId) {
    this.instance.storage = this.instance.storage.filter(item => item.itemId !== itemId)
  }
}

export class ListModalController extends CommonController {
  constructor(args) {
    super(args)
    makeObservable(this)

    this.mandatoryArgs = [...this.mandatoryArgs, 'listId', 'Qvain', 'Model']
    this.attachMandatoryArgs(args)
  }

  @action.bound save(temp) {
    const isNew = temp.isNew

    if (isNew) {
      this.instance.storage.push(temp)
    } else {
      const foundIndex = this.instance.storage.findIndex(i => i.itemId === temp.itemId)
      this.instance.storage[foundIndex] = temp
    }
  }

  @action.bound create() {
    this.Qvain.Modals.open({
      listId: this.listId,
      save: this.save,
      data: new this.Model(),
      isNew: true,
    })
  }

  @action.bound edit(itemId) {
    const data = this.instance.storage.find(item => item.itemId === itemId).adapter.clone()
    this.Qvain.Modals.open({
      listId: this.listId,
      save: this.save,
      data,
      isNew: false,
    })
  }

  @action.bound reset() {
    this.instance.storage = []
  }

  @action.bound getValidationErrors(data) {
    return Object.values(data.validationError)
  }

  @action.bound remove(itemId) {
    this.instance.storage = this.instance.storage.filter(item => item.itemId !== itemId)
  }
}
