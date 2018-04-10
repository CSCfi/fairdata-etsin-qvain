import { observable, action } from 'mobx'

class Accessibility {
  @observable navText = ''

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
