import { action, makeObservable } from 'mobx'
import { attachMandatoryArgs } from './helpers'

export class CommonAdapter {
  constructor(args) {
    this.clone = this.clone.bind(this)
    this.attachMandatoryArgs(args)
    makeObservable(this)
    this.init()
  }

  @action.bound init() {
    // add initial actions to this function in inherited classes using mobx override
  }

  clone() {
    const copy = new this.instance.constructor()
    copy.itemId = this.instance.itemId

    copy.adapter.fromMetaxV3(this.toMetaxV3())
    return copy
  }

  mandatoryArgs = ['instance', 'Model']

  attachMandatoryArgs = attachMandatoryArgs
}

export class ListAdapter extends CommonAdapter {
  constructor(args) {
    super(args)
    this.mandatoryArgs = [...this.mandatoryArgs, 'V3FieldName']
    this.attachMandatoryArgs(args)
    makeObservable(this)
  }

  @action.bound fromMetaxV3(data) {
    if (!data) {
      this.instance.storage = []
      return
    }

    this.instance.storage = data.map(d => {
      const item = new this.Model()
      item.adapter.fromMetaxV3(d)
      return item
    })
  }

  @action.bound toMetaxV3() {
    return this.instance.storage.map(item => item.adapter.toMetaxV3())
  }
}
