import { observable, action } from 'mobx'

class Accessibility {
  @observable navText = ''
  @observable userIsTabbing = false

  @action
  toggleTabbing() {
    this.userIsTabbing = !this.userIsTabbing
  }

  @action
  setNavText(text) {
    this.navText = text
  }

  @action
  clearNavText() {
    this.navText = ''
  }
}

export default new Accessibility()
