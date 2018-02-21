import { observable, action } from 'mobx'

class Accessibility {
  @observable navText = ''

  @action
  setNavText(text) {
    this.navText = text
  }
}

export default new Accessibility()
