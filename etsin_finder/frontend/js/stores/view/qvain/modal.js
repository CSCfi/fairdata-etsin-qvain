import { computed, observable, action, makeObservable } from 'mobx'

class Modal {
  constructor() {
    makeObservable(this)
  }

  @observable data

  @computed get isOpen() {
    return !!this.data
  }

  @action.bound open(data) {
    this.data = data
  }

  @action.bound close() {
    this.data = null
  }
}

export default Modal
