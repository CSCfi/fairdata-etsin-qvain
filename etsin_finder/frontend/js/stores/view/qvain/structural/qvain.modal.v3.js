import { observable, action, makeObservable, override } from 'mobx'
import { CommonController } from './qvain.controllers'

class ModalController extends CommonController {
  constructor(args) {
    super(args)
    makeObservable(this)
    this.mandatoryArgs = ['listId', 'controller']
    this.attachMandatoryArgs(args)
  }

  @observable listId

  @observable hasChanged = false

  @override set(args) {
    this.controller.set(args)
  }

  @action.bound reset() {
    this.controller.reset()
  }

  @action.bound setHasChanged(value = true) {
    this.hasChanged = value
  }
}

class Modals {
  constructor() {
    makeObservable(this)
  }

  @observable modals = []

  @action.bound open(args) {
    if (!args.listId || !args.data || !args.save) {
      console.error(`Cannot open modal, arguments missing. 
        Required args: listId, data, save, 
        got: ${Object.entries(args)
          .filter(entries => entries[1])
          .map(entries => entries[0])}`)
      return
    }

    const foundIndex = this.modals.findIndex(modal => modal.listId === args.listId)
    const modal = args.data
    modal.isNew = args.isNew
    modal.save = args.save
    modal.controller = new ModalController({
      instance: modal,
      controller: modal.controller,
      listId: args.listId,
    })

    if (foundIndex < 0) {
      this.modals.push(modal)
    } else {
      this.modals[foundIndex] = modal
    }
  }

  @action.bound save(listId) {
    this.validate(listId)
    if (this.hasValidationErrors(listId)) return

    const modal = this.close(listId)
    modal.controller = modal.controller.controller
    modal.save(modal)
  }

  @action.bound close(listId) {
    const index = this.getIndex(listId)
    return this.modals.splice(index, 1)[0]
  }

  @action.bound validate(listId) {
    const modal = this.modals[this.getIndex(listId)]
    modal.controller.validate()
    this.modals[this.getIndex()] = modal
  }

  getIndex = listId => this.modals.findIndex(modal => modal.controller.listId === listId)

  hasValidationErrors = listId => {
    const modal = this.modals[this.getIndex(listId)]
    return Boolean(Object.values(modal.validationError).filter(i => i).length)
  }
}

export default Modals
