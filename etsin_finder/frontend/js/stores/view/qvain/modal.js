import { computed, observable, action } from 'mobx'

class Modal {
  constructor() {
  }

  @observable accessor data

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
